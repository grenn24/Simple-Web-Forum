package services

import (
	"database/sql"
	"fmt"

	"github.com/jinzhu/copier"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type ThreadService struct {
	DB *sql.DB
}

func (threadService *ThreadService) GetAllThreads() ([]*models.Thread, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.GetAllThreads()
}

func (threadService *ThreadService) GetThreadByID(threadID int) (*models.Thread, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	thread, err := threadRepository.GetThreadByID(threadID)
	if err != nil {
		// Check for thread not found error
		if err == sql.ErrNoRows {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No thread found for thread id: %v", threadID),
			}
		}
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return thread, nil
}

func (threadService *ThreadService) GetThreadExpandedByID(threadID int, userAuthorID int) (*dtos.ThreadExpanded, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	authorRepository := &repositories.AuthorRepository{DB: threadService.DB}
	likeRepository := &repositories.LikeRepository{DB: threadService.DB}
	commentRepository := &repositories.CommentRepository{DB: threadService.DB}
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}

	threadExpanded := new(dtos.ThreadExpanded)

	// Retrieve expanded thread information
	thread, err := threadRepository.GetThreadByID(threadID)
	copier.Copy(threadExpanded, thread)

	if err != nil {
		// Check for thread not found error
		if err == sql.ErrNoRows {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No thread found for thread id: %v", threadID),
			}
		}
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Retrieve author information
	authorMinimised := new(dtos.AuthorMinimised)
	author := new(models.Author)
	author, err = authorRepository.GetAuthorByID(thread.AuthorID)
	authorMinimised.AuthorID = author.AuthorID
	authorMinimised.AuthorName = author.Name
	authorMinimised.AvatarIconLink = author.AvatarIconLink
	threadExpanded.Author = *authorMinimised
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Retrieve likeCount
	likeCount, err := likeRepository.CountLikesByThreadID(threadID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	threadExpanded.LikeCount = likeCount

	// Retrieve commentCount
	commentCount, err := commentRepository.CountCommentsByThreadID(threadID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	threadExpanded.CommentCount = commentCount

	// Retrieve like status
	_, err = likeRepository.GetLikeByThreadAuthorID(threadID, userAuthorID)
	if err != nil && err != sql.ErrNoRows {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	} else if err != nil && err == sql.ErrNoRows {
		threadExpanded.LikeStatus = false
	} else {
		threadExpanded.LikeStatus = true
	}

	// Retrieve comments
	comments, err := commentRepository.GetCommentsByThreadID(threadID, "")
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	threadExpanded.Comments = comments

	// Retrieve topics
	topics, err := topicRepository.GetTopicsByThreadID(threadID)
	threadExpanded.TopicsTagged = topics
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return threadExpanded, nil
}

func (threadService *ThreadService) GetThreadsByAuthorID(authorID int) ([]*dtos.ThreadGridCard, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	authorRepository := &repositories.AuthorRepository{DB: threadService.DB}

	threads, err := threadRepository.GetThreadsByAuthorID(authorID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Retrieve the topics array for each thread
	threadsWithTopics := make([]*dtos.ThreadGridCard, 0)
	for _, thread := range threads {
		threadWithTopics := new(dtos.ThreadGridCard)
		copier.Copy(threadWithTopics, thread)
		topics, err := topicRepository.GetTopicsByThreadID(thread.ThreadID)
		threadWithTopics.TopicsTagged = topics
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		threadWithTopics.ContentSummarised = utils.TruncateString(thread.Content, 10)
		threadWithTopics.AuthorName = authorRepository.GetAuthorNameByAuthorID(thread.AuthorID)
		threadsWithTopics = append(threadsWithTopics, threadWithTopics)
	}

	return threadsWithTopics, nil
}

func (threadService *ThreadService) GetThreadsByTopicID(topicID int) ([]*dtos.ThreadGridCard, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.GetThreadsByTopicID(topicID)
}

func (threadService *ThreadService) CreateThread(thread *models.Thread) error {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.CreateThread(thread)
}

func (threadService *ThreadService) DeleteAllThreads() error {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.DeleteAllThreads()
}

func (threadService *ThreadService) DeleteThreadByID(threadID int) (int, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.DeleteThreadByID(threadID)
}

func (threadService *ThreadService) GetAllThreadTopicJunctions() ([]*models.ThreadTopicJunction, error) {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: threadService.DB}
	return threadTopicJunctionRepository.GetAllThreadTopicJunctions()
}

func (threadService *ThreadService) AddThreadToTopic(threadID string, topicID string) error {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: threadService.DB}
	return threadTopicJunctionRepository.AddThreadToTopic(threadID, topicID)
}
