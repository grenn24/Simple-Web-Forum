package services

import (
	"database/sql"
	"fmt"

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

func (commentService *CommentService) GetCommentsByThreadID(threadID int, sortIndex int) ([]*dtos.CommentDTO, *dtos.Error) {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}

	comments, err := commentRepository.GetCommentsByThreadID(threadID, sortIndex)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return comments, nil
}

func (commentService *CommentService) GetCommentsByAuthorID(authorID int) ([]*dtos.CommentDTO, *dtos.Error) {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	topicRepository := &repositories.TopicRepository{DB: commentService.DB}

	comments, err := commentRepository.GetCommentsByAuthorID(authorID)

	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	for _, comment := range comments {
	


		// Retrieve topics tagged
		topics, err := topicRepository.GetTopicsByThreadID(comment.Thread.ThreadID)
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		comment.Thread.TopicsTagged = topics

	}

	return comments, nil
}

func (commentService *CommentService) SearchComments(query string, page int, limit int, sortIndex int) ([]*dtos.CommentDTO, *dtos.Error) {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	topicRepository := &repositories.TopicRepository{DB: commentService.DB}

	comments, err := commentRepository.SearchComments(query, page, limit, sortIndex)

	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	for _, comment := range comments {

		// Retrieve topics for each thread
		topics, err := topicRepository.GetTopicsByThreadID(comment.Thread.ThreadID)
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		comment.Thread.TopicsTagged = topics
	}
	return comments, nil
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
	threadRepository := &repositories.ThreadRepository{DB: commentService.DB}
	err := threadRepository.IncrementCommentCountByThreadID(comment.ThreadID)
	if err != nil {
		return err
	}
	return commentRepository.CreateComment(comment)
}

func (commentService *CommentService) DeleteAllComments() *dtos.Error {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	threadRepository := &repositories.ThreadRepository{DB: commentService.DB}
	err := commentRepository.DeleteAllComments()
	if err != nil {
		// Check for internal server errors
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	err = threadRepository.ResetAllCommentCount()
	if err != nil {
		// Check for internal server errors
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (commentService *CommentService) DeleteCommentByID(commentID int) *dtos.Error {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	threadRepository := &repositories.ThreadRepository{DB: commentService.DB}
	comment, err := commentRepository.GetCommentByID(commentID)
	if err != nil {
		// Check for thread not found error
		if err == sql.ErrNoRows {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No comment found for comment id: %v", commentID),
			}
		}
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	rowsDeleted, err := commentRepository.DeleteCommentByID(commentID)

	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	// Check for comment not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No comments found for comment id: " + utils.ConvertIntToString(commentID),
		}
	}
	err = threadRepository.DecrementCommentCountByThreadID(comment.ThreadID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return nil
}
