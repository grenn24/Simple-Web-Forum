package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllComments(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM Comment")

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var comments []models.Comment

	for rows.Next() {
		// Declare a comment struct instance
		var comment models.Comment

		// Scan the row and modify the comment instance
		err := rows.Scan(
			&comment.CommentID,
			&comment.AuthorID,
			&comment.ThreadID,
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

	context.JSON(http.StatusOK, comments)
}

func CreateComment(context *gin.Context, db *sql.DB) {
	// Declare a thread struct instance
	var comment models.Comment

	err := context.ShouldBind(&comment)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	_, err = db.Exec("INSERT INTO Comment (thread_id, author_id, content) VALUES ($1, $2, $3)", comment.ThreadID, comment.AuthorID, comment.Content)

		// Check for sql insertion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Comment added to database")
}

func CreateLike(context *gin.Context, db *sql.DB) {
	// Declare a like struct instance
	var like models.Like

	err := context.ShouldBind(&like)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusBadRequest, err.Error())
		return
	}

	_, err = db.Exec("INSERT INTO Like (thread_id, author_id) VALUES ($1, $2)", like.ThreadID, like.AuthorID)

	// Check for sql insertion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Like added to database")
}