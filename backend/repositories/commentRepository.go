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

func (commentRepository *CommentRepository) GetCommentsByThreadID(threadID int, sort string) ([]*dtos.CommentWithAuthorName, error) {
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
		rows, err = commentRepository.DB.Query(`
		SELECT comment.comment_id, comment.thread_id, comment.author_id, comment.created_at, comment.content, author.name, author.avatar_icon_link
		FROM comment 
		INNER JOIN author ON comment.author_id = author.author_id WHERE thread_id = $1`, threadID)
	} else {
		rows, err = commentRepository.DB.Query(`
		SELECT comment.comment_id, comment.thread_id, comment.author_id, comment.created_at, comment.content, author.name, author.avatar_icon_link
		FROM comment
		INNER JOIN author ON comment.author_id = author.author_id
		WHERE thread_id = $1
		ORDER BY created_at `+sort, threadID)
	}

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var comments []*dtos.CommentWithAuthorName

	for rows.Next() {
		// Declare a pointer to a new instance of a comment struct
		comment := new(dtos.CommentWithAuthorName)

		// Scan the current row into the comment struct
		err := rows.Scan(
			&comment.CommentID,
			&comment.ThreadID,
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
