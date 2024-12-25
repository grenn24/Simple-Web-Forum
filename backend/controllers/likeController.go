package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllLikes(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM \"Like\"")

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var likes []models.Like

	for rows.Next() {
		// Declare a like struct instance
		var like models.Like

		// Scan the row and modify the like instance
		err := rows.Scan(
			&like.LikeID,
			&like.ThreadID,
			&like.AuthorID,
			&like.CreatedAt,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned like to likes slice
		likes = append(likes, like)
	}

	context.JSON(http.StatusOK, likes)
}
