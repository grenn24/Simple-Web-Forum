package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllThreads(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM Thread")
	
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var threads []models.Thread

	for rows.Next() {
		// Declare a thread struct instance
		var thread models.Thread

		// Scan the row and modify the thread instance
		err := rows.Scan(
			&thread.ThreadID,
			&thread.Title,
			&thread.CreatedAt,
			&thread.Content,
			&thread.AuthorID,
			&thread.ImageTitle,
			&thread.ImageLink,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned thread to threads slice
		threads = append(threads, thread)
	}

	context.JSON(http.StatusOK, threads)
}
