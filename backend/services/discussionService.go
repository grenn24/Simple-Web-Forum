package services

import (
	"database/sql"
	"fmt"
	"sync"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type DiscussionService struct {
	DB *sql.DB
}

func (discussionService *DiscussionService) CreateDiscussion(discussion *models.Discussion) *dtos.Error {
	discussionRepository := &repositories.DiscussionRepository{DB: discussionService.DB}
	if discussion.DiscussionIcon != nil {
		discussionIconLink, err := utils.PostFileHeaderToS3Bucket(discussion.DiscussionIcon, "discussion_icon")
		if err != nil {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		discussion.DiscussionIconLink = &discussionIconLink
	}
	err := discussionRepository.CreateDiscussion(discussion)

	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (discussionService *DiscussionService) CreateDiscussionThread(thread *models.Thread, discussionID int, progressChannel chan float64, errorChannel chan *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: discussionService.DB}

	// Create an instance of the s3 bucket utility struct
	awsS3Bucket := &utils.AwsS3Bucket{
		ProgressChannel: progressChannel,
		ErrorChannel:    errorChannel,
	}

	progressChannel <- 0
	fmt.Println("progress channel 0")

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		videoUrls := awsS3Bucket.PostFileHeadersToS3Bucket(thread.Video, "thread_video")
		thread.VideoLink = videoUrls
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		imageUrls := awsS3Bucket.PostFileHeadersToS3Bucket(thread.Image, "thread_image")
		thread.ImageLink = imageUrls
	}()

	wg.Wait()
	err := threadRepository.CreateDiscussionThread(thread, discussionID)

	// Check for internal server errors
	if err != nil {
		fmt.Println(err)
		errorChannel <- &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	fmt.Println("thread created")

	progressChannel <- 95

	progressChannel <- 100
	fmt.Println("progress channel 100")
}

func (discussionService *DiscussionService) AddMemberToDiscussion(memberAuthorID int, discussionID int) *dtos.Error {
	discussionMemberRepository := &repositories.DiscussionMemberRepository{DB: discussionService.DB}
	err := discussionMemberRepository.AddMemberToDiscussion(memberAuthorID, discussionID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}
