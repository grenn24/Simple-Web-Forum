package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllComments(context *gin.Context, db *sql.DB) {
	var sort string
	if context.Query("sort") == "newest" {
		sort = "DESC"
	} else if context.Query("sort") == "oldest" {
		sort = "ASC"
	} else {
		sort = ""
	}

	var rows *sql.Rows
	var err error

	if sort == "" {
		rows, err = db.Query("SELECT * FROM comment")
	} else {
		rows, err = db.Query("SELECT * FROM comment ORDER BY created_at " + sort)
	}

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
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
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned comment to comments slice
		comments = append(comments, comment)
	}

	// Check for empty table
	if len(comments) == 0 {
		context.String(http.StatusNotFound, "No comments in database")
		return
	}

	context.JSON(http.StatusOK, comments)
}

func GetCommentsByThreadID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	var sort string
	if context.Query("sort") == "newest" {
		sort = "DESC"
	} else if context.Query("sort") == "oldest" {
		sort = "ASC"
	} else {
		sort = ""
	}

	var rows *sql.Rows
	var err error

	if sort == "" {
		rows, err = db.Query("SELECT * FROM comment WHERE thread_id = $1", threadID)
	} else {
		rows, err = db.Query("SELECT * FROM comment WHERE thread_id = $1 ORDER BY created_at "+sort, threadID)
	}

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
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
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned comment to comments slice
		comments = append(comments, comment)
	}

	// Check for empty table
	if len(comments) == 0 {
		context.String(http.StatusNotFound, "No comments found for this thread")
		return
	}

	context.JSON(http.StatusOK, comments)
}

func GetCommentsByAuthorID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	var sort string
	if context.Query("sort") == "newest" {
		sort = "DESC"
	} else if context.Query("sort") == "oldest" {
		sort = "ASC"
	} else {
		sort = ""
	}

	var rows *sql.Rows
	var err error

	if sort == "" {
		rows, err = db.Query("SELECT * FROM comment WHERE author_id = $1", authorID)
	} else {
		rows, err = db.Query("SELECT * FROM comment WHERE author_id = $1 ORDER BY created_at "+sort, authorID)
	}

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
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
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned comment to comments slice
		comments = append(comments, comment)
	}

	// Check for empty table
	if len(comments) == 0 {
		context.String(http.StatusNotFound, "No comments found for this author")
		return
	}

	context.JSON(http.StatusOK, comments)
}

func CountAllComments(context *gin.Context, db *sql.DB) {
	row := db.QueryRow("SELECT COUNT(*) FROM comment")

	var commentCount int

	err := row.Scan(&commentCount)

	// Check for any scanning errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.JSON(http.StatusOK, gin.H{"commentCount": commentCount})
}

func CountCommentsByThreadID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	row := db.QueryRow("SELECT COUNT(*) FROM comment WHERE thread_id = $1", threadID)

	var commentCount int

	err := row.Scan(&commentCount)

	// Check for any scanning errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.JSON(http.StatusOK, gin.H{"commentCount": commentCount})
}

func CreateComment(context *gin.Context, db *sql.DB) {
	// Declare a pointer to a new instance of a comment struct
	comment := new(models.Comment)

	err := context.ShouldBind(&comment)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	// Check if the binded struct contains necessary fields
	if comment.ThreadID == 0 || comment.AuthorID == 0 || comment.Content == "" {
		context.String(http.StatusBadRequest, "Missing required fields")
		return
	}

	_, err = db.Exec("INSERT INTO comment (thread_id, author_id, content) VALUES ($1, $2, $3)", comment.ThreadID, comment.AuthorID, comment.Content)

	// Check for sql insertion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Comment added to database")
}

func DeleteAllComments(context *gin.Context, db *sql.DB) {

	_, err := db.Exec("DELETE FROM comment")

	// Check for any deletion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Deleted all comments")
}
