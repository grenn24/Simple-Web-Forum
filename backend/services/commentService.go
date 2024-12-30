package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
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

func (commentService *CommentService) GetCommentsByThreadID(threadID int, sort string) ([]*dtos.CommentWithAuthorName, error) {
	commentRepository := &repositories.CommentRepository{DB: commentService.DB}
	return commentRepository.GetCommentsByThreadID(threadID, sort)
}

func (commentService *CommentService) GetCommentsByAuthorID(authorID string, sort string) ([]*models.Comment, error) {

	if sort == "newest" {
		sort = "DESC"
	} else if sort == "oldest" {
		sort = "ASC"
	} else {
		sort = ""
	}

	var rows *sql.Rows
	var err error

	if sort == "" {
		rows, err = commentService.DB.Query("SELECT * FROM comment WHERE author_id = $1", authorID)
	} else {
		rows, err = commentService.DB.Query("SELECT * FROM comment WHERE author_id = $1 ORDER BY created_at "+sort, authorID)
	}

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var comments []*models.Comment

	for rows.Next() {
		// Declare a pointer to a new instance of a comment struct
		comment := new(models.Comment)

		// Scan the current row into the comment struct
		err := rows.Scan(
			&comment.CommentID,
			&comment.ThreadID,
			&comment.AuthorID,
			&comment.CreatedAt,
			&comment.Content,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned comment to comments slice
		comments = append(comments, comment)
	}

	return comments, err
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
