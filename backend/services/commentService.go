package services

import (
	"database/sql"
	

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type CommentService struct {
	DB *sql.DB
}

func (commentService *CommentService) GetAllComments(sort string) ([]*models.Comment, *dtos.Error) {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	if sort == "newest" {
		sort = "DESC"
	} else if sort == "oldest" {
		sort = "ASC"
	} else {
		sort = ""
	}

	comments, err := commentRepository.GetAllComments(sort)

	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return comments, nil
}

func (commentService *CommentService) GetCommentsByThreadID(threadID int, sort string) ([]*dtos.CommentCard, *dtos.Error) {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	if sort == "newest" {
		sort = "DESC"
	} else if sort == "oldest" {
		sort = "ASC"
	} else {
		sort = ""
	}
	comments, err := commentRepository.GetCommentsByThreadID(threadID, sort)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return comments, nil
}

func (commentService *CommentService) GetCommentedThreadsByAuthorID(authorID int, sort string) ([]*dtos.CommentCard, *dtos.Error) {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	topicRepository := &repositories.TopicRepository{DB: commentService.DB}

	if sort == "newest" {
		sort = "DESC"
	} else if sort == "oldest" {
		sort = "ASC"
	} else {
		sort = ""
	}

	commentedThreads, err := commentRepository.GetCommentedThreadsByAuthorID(authorID, sort)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	for _, commentedThread := range commentedThreads {
		// Truncate thread content
		truncatedContent := utils.TruncateString(*commentedThread.ThreadContentSummarised, 20)
		commentedThread.ThreadContentSummarised = &truncatedContent

		// Retrieve topics tagged
		topics, err := topicRepository.GetTopicsByThreadID(commentedThread.ThreadID)
		commentedThread.TopicsTagged = topics
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
	}

	return commentedThreads, nil
}

func (commentService *CommentService) CountAllComments() (int, error) {
	row := commentService.DB.QueryRow("SELECT COUNT(*) FROM comment")

	var commentCount int

	err := row.Scan(&commentCount)

	// Check for any scanning errors
	if err != nil {
		return 0, err
	}

	return commentCount, nil
}

func (commentService *CommentService) CountCommentsByThreadID(threadID string) (int, error) {

	row := commentService.DB.QueryRow("SELECT COUNT(*) FROM comment WHERE thread_id = $1", threadID)

	var commentCount int

	err := row.Scan(&commentCount)

	// Check for any scanning errors
	if err != nil {
		return 0, err
	}

	return commentCount, err
}

func (commentService *CommentService) CreateComment(comment *models.Comment) error {

	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	return commentRepository.CreateComment(comment)
}

func (commentService *CommentService) DeleteAllComments() error {

	_, err := commentService.DB.Exec("DELETE FROM comment")

	return err

}
