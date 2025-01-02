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

func (commentService *CommentService) GetCommentsByThreadID(threadID int, sort string) ([]*dtos.CommentExpanded, *dtos.Error) {
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

func (commentService *CommentService) GetCommentedThreadsByAuthorID(authorID int) ([]*dtos.CommentExpanded, *dtos.Error) {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	topicRepository := &repositories.TopicRepository{DB: commentService.DB}


	commentedThreads, err := commentRepository.GetCommentedThreadsByAuthorID(authorID)
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

func (commentService *CommentService) DeleteAllComments() *dtos.Error {

	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	err := commentRepository.DeleteAllComments()
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
	rowsDeleted, err := commentRepository.DeleteCommentByID(commentID)

	if err != nil {
		// Check for internal server errors
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

	return nil
}
