package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/utils"
)

type CommentRepository struct {
	DB *sql.DB
}

func (commentRepository *CommentRepository) GetAllComments(sort string) ([]*models.Comment, error) {

	var rows *sql.Rows
	var err error

	if sort == "" {
		rows, err = commentRepository.DB.Query("SELECT * FROM comment")
	} else {
		rows, err = commentRepository.DB.Query("SELECT * FROM comment ORDER BY created_at " + sort)
	}

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	comments := make([]*models.Comment, 0)

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

func (commentRepository *CommentRepository) GetCommentsByThreadID(threadID int, sort string) ([]*dtos.CommentedThread, error) {

	var rows *sql.Rows
	var err error

	if sort == "" {
		rows, err = commentRepository.DB.Query(`
		SELECT comment.comment_id, comment.content, comment.created_at, comment.thread_id, thread.title, thread.content, comment.author_id, author.name, author.avatar_icon_link
		FROM comment 
		INNER JOIN author ON comment.author_id = author.author_id
		INNER JOIN thread ON comment.thread_id = thread.thread_id
		WHERE thread.thread_id = $1`, threadID)
	} else {
		rows, err = commentRepository.DB.Query(`
		SELECT comment.comment_id, comment.content, comment.created_at, comment.thread_id, thread.title, thread.content, comment.author_id, author.name, author.avatar_icon_link
		FROM comment 
		INNER JOIN author ON comment.author_id = author.author_id
		INNER JOIN thread ON comment.thread_id = thread.thread_id
		WHERE thread.thread_id = $1
		ORDER BY created_at `+sort, threadID)
	}

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	comments := make([]*dtos.CommentedThread, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a comment struct
		comment := new(dtos.CommentedThread)

		// Scan the current row into the comment struct
		err := rows.Scan(
			&comment.CommentID,
			&comment.Content,
			&comment.CreatedAt,
			&comment.ThreadID,
			&comment.ThreadTitle,
			&comment.ThreadContentSummarised,
			&comment.AuthorID,
			&comment.AuthorName,
			&comment.AvatarIconLink,
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

func (commentRepository *CommentRepository) GetCommentedThreadsByAuthorID(authorID int) ([]*dtos.CommentedThread, error) {

	rows, err := commentRepository.DB.Query(`
		SELECT comment.comment_id, comment.thread_id, thread.title, thread.content, comment.author_id, comment.created_at, comment.content, author.name, author.avatar_icon_link
		FROM comment 
		INNER JOIN author ON comment.author_id = author.author_id
		INNER JOIN thread ON comment.thread_id = thread.thread_id
		WHERE author.author_id = $1
		ORDER BY comment.created_at DESC`, authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	comments := make([]*dtos.CommentedThread, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a comment struct
		comment := new(dtos.CommentedThread)

		// Scan the current row into the comment struct
		err := rows.Scan(
			&comment.CommentID,
			&comment.ThreadID,
			&comment.ThreadTitle,
			&comment.ThreadContentSummarised,
			&comment.AuthorID,
			&comment.CreatedAt,
			&comment.Content,
			&comment.AuthorName,
			&comment.AvatarIconLink,
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

func (commentRepository *CommentRepository) CountCommentsByThreadID(threadID int) (int, error) {
	row := commentRepository.DB.QueryRow("SELECT COUNT(*) FROM comment WHERE thread_id = " + utils.ConvertIntToString(threadID))

	var commentCount int

	err := row.Scan(&commentCount)

	return commentCount, err
}

func (commentRepository *CommentRepository) CreateComment(comment *models.Comment) error {

	_, err := commentRepository.DB.Exec("INSERT INTO comment (thread_id, author_id, content) VALUES ($1, $2, $3)", comment.ThreadID, comment.AuthorID, comment.Content)

	return err
}

func (commentRepository *CommentRepository) DeleteCommentByID(commentID int) (int, error) {

	result, err := commentRepository.DB.Exec("DELETE FROM comment WHERE comment_id = $1", commentID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err

}

func (commentRepository *CommentRepository) DeleteAllComments() error {

	_, err := commentRepository.DB.Exec("DELETE FROM comment")

	// Check for any deletion errors
	if err != nil {
		return err
	}

	return err

}
