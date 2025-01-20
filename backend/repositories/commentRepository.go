package repositories

import (
	"database/sql"
	"fmt"

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

func (commentRepository *CommentRepository) GetCommentByID(commentID int) (*models.Comment, error) {

	row := commentRepository.DB.QueryRow("SELECT * FROM comment WHERE comment_id = $1", commentID)
	comment := new(models.Comment)
	err := row.Scan(
		&comment.CommentID,
		&comment.ThreadID,
		&comment.AuthorID,
		&comment.CreatedAt,
		&comment.Content,
	)

	return comment, err
}

func (commentRepository *CommentRepository) GetCommentsByThreadID(threadID int, sortIndex int) ([]*dtos.CommentDTO, error) {
	sortOrder := []string{"comment.created_at DESC", "", "comment.created_at ASC"}

	rows, err := commentRepository.DB.Query(`
		SELECT comment.comment_id, comment.content, comment.created_at, comment_author.author_id, comment_author.name, comment_author.username, comment_author.avatar_icon_link, thread.thread_id, thread.title,
		thread.content, thread.created_at, thread_author.author_id, thread_author.name, thread_author.username, thread_author.avatar_icon_link
		FROM comment 
		INNER JOIN author AS comment_author ON comment.author_id = comment_author.author_id
		INNER JOIN thread ON comment.thread_id = thread.thread_id
		INNER JOIN author AS thread_author ON thread.author_id = thread_author.author_id
		WHERE thread.thread_id = $1
		ORDER BY 
	`+sortOrder[sortIndex], threadID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	comments := make([]*dtos.CommentDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a comment struct
		comment := new(dtos.CommentDTO)
		comment.Author = new(dtos.AuthorDTO)
		comment.Thread = new(dtos.ThreadDTO)
		comment.Thread.Author = new(dtos.AuthorDTO)

		// Scan the current row into the comment struct
		err := rows.Scan(
			&comment.CommentID,
			&comment.Content,
			&comment.CreatedAt,
			&comment.Author.AuthorID,
			&comment.Author.Name,
			&comment.Author.Username,
			&comment.Author.AvatarIconLink,
			&comment.Thread.ThreadID,
			&comment.Thread.Title,
			&comment.Thread.Content,
			&comment.Thread.CreatedAt,
			&comment.Thread.Author.AuthorID,
			&comment.Thread.Author.Name,
			&comment.Thread.Author.Username,
			&comment.Thread.Author.AvatarIconLink,
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

func (commentRepository *CommentRepository) GetCommentsByAuthorID(authorID int) ([]*dtos.CommentDTO, error) {

	rows, err := commentRepository.DB.Query(`
		SELECT
			comment.comment_id,
			comment.created_at,
			comment.content,
			comment_author.author_id,
			comment_author.name,
			comment_author.avatar_icon_link,
			thread.thread_id,
			thread.title,
			thread.content,
			thread.created_at,
			thread_author.author_id,
			thread_author.name,
			thread_author.avatar_icon_link
		FROM comment 
		INNER JOIN thread ON comment.thread_id = thread.thread_id
		INNER JOIN author AS thread_author ON thread.author_id = thread_author.author_id
		INNER JOIN author AS comment_author ON comment.author_id = comment_author.author_id
		WHERE comment.author_id = $1 AND thread.visibility = 'public'
		ORDER BY comment.created_at DESC`, authorID)
	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	comments := make([]*dtos.CommentDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a comment struct
		comment := new(dtos.CommentDTO)
		comment.Author = new(dtos.AuthorDTO)
		comment.Thread = new(dtos.ThreadDTO)
		comment.Thread.Author = new(dtos.AuthorDTO)

		// Scan the current row into the comment struct
		err := rows.Scan(
			&comment.CommentID,
			&comment.CreatedAt,
			&comment.Content,
			&comment.Author.AuthorID,
			&comment.Author.Name,
			&comment.Author.AvatarIconLink,
			&comment.Thread.ThreadID,
			&comment.Thread.Title,
			&comment.Thread.Content,
			&comment.Thread.CreatedAt,
			&comment.Thread.Author.AuthorID,
			&comment.Thread.Author.Name,
			&comment.Thread.Author.AvatarIconLink,
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

func (commentRepository *CommentRepository) SearchComments(query string, page int, limit int, sortIndex int) ([]*dtos.CommentDTO, error) {
	sortOrder := []string{"comment.created_at DESC", "comment.created_at ASC"}
	var limitOffset string
	if limit != 0 {
		limitOffset = fmt.Sprintf(" LIMIT %v", limit)
		if page != 0 {
			limitOffset += fmt.Sprintf(" OFFSET %v", (page-1)*limit)
		}
	}

	rows, err := commentRepository.DB.Query(`
		SELECT comment.comment_id, comment.content, comment.created_at, comment_author.author_id, comment_author.name, comment_author.username, comment_author.avatar_icon_link, thread.thread_id, thread.title,
		thread.content, thread.created_at, thread.like_count, thread.comment_count, thread_author.author_id, thread_author.name, thread_author.username, thread_author.avatar_icon_link
		FROM comment 
		INNER JOIN author AS comment_author ON comment.author_id = comment_author.author_id
		INNER JOIN thread ON comment.thread_id = thread.thread_id
		INNER JOIN author AS thread_author ON thread.author_id = thread_author.author_id
		WHERE comment.content ILIKE $1 AND thread.discussion_id IS NULL
		ORDER BY
	`+sortOrder[sortIndex]+limitOffset, "%"+query+"%")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	comments := make([]*dtos.CommentDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a comment struct
		comment := new(dtos.CommentDTO)
		comment.Author = new(dtos.AuthorDTO)
		comment.Thread = new(dtos.ThreadDTO)
		comment.Thread.Author = new(dtos.AuthorDTO)

		// Scan the current row into the comment struct
		err := rows.Scan(
			&comment.CommentID,
			&comment.Content,
			&comment.CreatedAt,
			&comment.Author.AuthorID,
			&comment.Author.Name,
			&comment.Author.Username,
			&comment.Author.AvatarIconLink,
			&comment.Thread.ThreadID,
			&comment.Thread.Title,
			&comment.Thread.Content,
			&comment.Thread.CreatedAt,
			&comment.Thread.LikeCount,
			&comment.Thread.CommentCount,
			&comment.Thread.Author.AuthorID,
			&comment.Thread.Author.Name,
			&comment.Thread.Author.Username,
			&comment.Thread.Author.AvatarIconLink,
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
