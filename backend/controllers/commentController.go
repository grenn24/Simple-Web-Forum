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
