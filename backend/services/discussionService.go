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

func (discussionService *DiscussionService) GetThreadsByDiscussionID(discussionID int, userAuthorID int, sortIndex int) ([]*dtos.ThreadDTO, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: discussionService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: discussionService.DB}
	likeRepository := &repositories.LikeRepository{DB: discussionService.DB}

	threads, err := threadRepository.GetThreadsByDiscussionID(userAuthorID, discussionID, sortIndex)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	for _, thread := range threads {
		// Retrieve like, bookmark and isUser status
		likeStatus := likeRepository.GetLikeStatusByThreadIDAuthorID(thread.ThreadID, thread.Author.AuthorID)
		thread.LikeStatus = &likeStatus
		bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(thread.ThreadID, thread.Author.AuthorID)
		thread.BookmarkStatus = &bookmarkStatus
		threadAuthorIsUser := thread.Author.AuthorID == userAuthorID
		thread.Author.IsUser = &threadAuthorIsUser
	}

	return threads, nil
}

func (discussionService *DiscussionService) GetDiscussionByID(discussionID int, userAuthorID int) (*dtos.DiscussionDTO, *dtos.Error) {
	discussionRepository := &repositories.DiscussionRepository{DB: discussionService.DB}
	discussionMemberRepository := &repositories.DiscussionMemberRepository{DB: discussionService.DB}
	discussion, err := discussionRepository.GetDiscussionByID(discussionID, userAuthorID)
	if err != nil {
		// Check for discussion not found error
		if err == sql.ErrNoRows {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No discussion found for discussion id: %v", discussionID),
			}
		}
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	members, err := discussionMemberRepository.GetMembersByDiscussionID(discussionID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	discussion.Members = members

	return discussion, nil

}

func (discussionService *DiscussionService) GetJoinRequestsByDiscussionID(discussionID int) ([]*dtos.DiscussionJoinRequestDTO, *dtos.Error) {
	discussionJoinRequestRepository := &repositories.DiscussionJoinRequestRepository{DB: discussionService.DB}
	joinRequests, err := discussionJoinRequestRepository.GetJoinRequestsByDiscussionID(discussionID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return joinRequests, nil
}

func (discussionService *DiscussionService) GetMembersByDiscussionID(discussionID int) ([]*dtos.AuthorDTO, *dtos.Error) {
	discussionMemberRepository := &repositories.DiscussionMemberRepository{DB: discussionService.DB}

	members, err := discussionMemberRepository.GetMembersByDiscussionID(discussionID)

	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return members, nil
}

func (discussionService *DiscussionService) CreateDiscussion(discussion *dtos.DiscussionDTO, userAuthorID int) *dtos.Error {
	discussionRepository := &repositories.DiscussionRepository{DB: discussionService.DB}
	discussionMemberRepository := &repositories.DiscussionMemberRepository{DB: discussionService.DB}
	if discussion.BackgroundImage != nil {
		backgroundImageLink, err := utils.PostFileHeaderToS3Bucket(discussion.BackgroundImage, "background_image")
		if err != nil {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		discussion.BackgroundImageLink = &backgroundImageLink
	}
	discussionID, err := discussionRepository.CreateDiscussion(discussion)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Add the creator and selected authors into the discussion member table
	err = discussionMemberRepository.CreateMember(userAuthorID, discussionID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	for _, member := range discussion.Members {
		err = discussionMemberRepository.CreateMember(member.AuthorID, discussionID)
		if err != nil {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
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

func (discussionService *DiscussionService) CreateJoinRequest(joinRequest *models.DiscussionJoinRequest) *dtos.Error {
	discussionJoinRequestRepository := &repositories.DiscussionJoinRequestRepository{DB: discussionService.DB}
	err := discussionJoinRequestRepository.CreateJoinRequest(joinRequest)

	if err != nil {
		// Check for existing likes errors
		if err.Error() == "pq: duplicate key value violates unique constraint \"discussion_id_author_id_key\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "LIKE_ALREADY_EXISTS",
				Message:   fmt.Sprintf("Follow request has already been submitted for author id %v", joinRequest.AuthorID),
			}
		}
		// Internal server errors
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (discussionService *DiscussionService) DeleteJoinRequestByDiscussionIDAuthorID(discussionID int, authorID int) *dtos.Error {
	discussionJoinRequestRepository := &repositories.DiscussionJoinRequestRepository{DB: discussionService.DB}
	rowsDeleted, err := discussionJoinRequestRepository.DeleteJoinRequestByDiscussionIDAuthorID(discussionID, authorID)

	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}

	// Check for like not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No join requests found for the discussion and author ids provided ",
		}
	}

	return nil
}

func (discussionService *DiscussionService) DeleteJoinRequestByID(requestID int) *dtos.Error {
	discussionJoinRequestRepository := &repositories.DiscussionJoinRequestRepository{DB: discussionService.DB}
	rowsDeleted, err := discussionJoinRequestRepository.DeleteJoinRequestByID(requestID)

	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}

	// Check for like not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No join requests found for the request id: " + utils.ConvertIntToString(requestID),
		}
	}

	return nil
}

func (discussionService *DiscussionService) CreateMember(memberAuthorID int, discussionID int) *dtos.Error {
	discussionMemberRepository := &repositories.DiscussionMemberRepository{DB: discussionService.DB}
	err := discussionMemberRepository.CreateMember(memberAuthorID, discussionID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (discussionService *DiscussionService) DeleteMemberByID(memberID int) *dtos.Error {
	discussionMemberRepository := &repositories.DiscussionMemberRepository{DB: discussionService.DB}
	rowsDeleted, err := discussionMemberRepository.DeleteMemberByID(memberID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	// Check for like not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   fmt.Sprintf("No member with member id %v", memberID),
		}
	}
	return nil
}

func (discussionService *DiscussionService) DeleteMemberByAuthorIDDiscussionID(memberAuthorID int, discussionID int) *dtos.Error {
	discussionMemberRepository := &repositories.DiscussionMemberRepository{DB: discussionService.DB}
	rowsDeleted, err := discussionMemberRepository.DeleteMemberByAuthorIDDiscussionID(memberAuthorID, discussionID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	// Check for like not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   fmt.Sprintf("No member with author id %v is in discussion with discussion id %v", memberAuthorID, discussionID),
		}
	}
	return nil
}

func (discussionService *DiscussionService) GetPopularDiscussions(userAuthorID int) ([]*dtos.DiscussionDTO, *dtos.Error) {
	discussionRepository := &repositories.DiscussionRepository{DB: discussionService.DB}
	discussions, err := discussionRepository.GetPopularDiscussions(userAuthorID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return discussions, nil
}

func (discussionService *DiscussionService) SearchDiscussions(query string, page int, limit int, sortIndex int, userAuthorID int) ([]*dtos.DiscussionDTO, *dtos.Error) {
	discussionRepository := &repositories.DiscussionRepository{DB: discussionService.DB}
	discussions, err := discussionRepository.SearchDiscussions(query, page, limit, sortIndex, userAuthorID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return discussions, nil
}

func (discussionService *DiscussionService) UpdateDiscussion(discussion *models.Discussion, discussionID int) *dtos.Error {
	discussionRepository := &repositories.DiscussionRepository{DB: discussionService.DB}

	existingDiscussion, err := discussionRepository.GetDiscussionByID(discussionID, 0)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	existingDiscussion.Name = discussion.Name
	existingDiscussion.Description = discussion.Description
	if discussion.BackgroundImage != nil {
		backgroundImageLink, err := utils.PostFileHeaderToS3Bucket(discussion.BackgroundImage, "background_image")
		if err != nil {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		fmt.Println(backgroundImageLink)
		existingDiscussion.BackgroundImageLink = &backgroundImageLink
	}

	err = discussionRepository.UpdateDiscussion(existingDiscussion, discussionID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (discussionService *DiscussionService) DeleteDiscussionByID(discussionID int) *dtos.Error {
	discussionRepository := &repositories.DiscussionRepository{DB: discussionService.DB}
	rowsDeleted, err := discussionRepository.DeleteDiscussionByID(discussionID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Check for discussion not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   fmt.Sprintf("No discussions found with discussion id: %v", discussionID),
		}
	}
	discussion, _ := discussionRepository.GetDiscussionByID(discussionID, 0)
	if discussion.BackgroundImageLink != nil {
		utils.DeleteFileFromS3Bucket(*discussion.BackgroundImageLink)
	}
	return nil
}
