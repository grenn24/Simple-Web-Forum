package services

import (
	"database/sql"
	"fmt"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
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

func (threadService *ThreadService) GetThreadExpandedByID(threadID int) (*dtos.ThreadExpanded, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	authorRepository := &repositories.AuthorRepository{DB: threadService.DB}
	likeRepository := &repositories.LikeRepository{DB: threadService.DB}
	commentRepository := &repositories.CommentRepository{DB: threadService.DB}

	threadExpanded := new(dtos.ThreadExpanded)

	// Retrieve expanded thread information
	thread, err := threadRepository.GetThreadByID(threadID)
	threadExpanded.ThreadID = thread.ThreadID
	threadExpanded.Title = thread.Title
	threadExpanded.Content = thread.Content
	threadExpanded.ImageLink = thread.ImageLink
	threadExpanded.ImageTitle = thread.ImageTitle
	threadExpanded.CreatedAt = thread.CreatedAt

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
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}
	topics, err := topicRepository.GetTopicsByThreadID(fmt.Sprintf("%v", threadID))
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

func (threadService *ThreadService) GetThreadsByAuthorID(authorID int) ([]*models.Thread, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.GetThreadsByAuthorID(authorID)
}

func (threadService *ThreadService) GetThreadsByTopicID(topicID int) ([]*dtos.ThreadWithAuthorName, error) {
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
