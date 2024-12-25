package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllFollows(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM Follow")

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var follows []models.Follow

	for rows.Next() {
		// Declare a follow struct instance
		var follow models.Follow

		// Scan the row and modify the follow instance
		err := rows.Scan(
			&follow.FollowID,
			&follow.FollowerAuthorID,
			&follow.FolloweeAuthorID,
			&follow.FolloweeTopicID,
			&follow.CreatedAt,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned follow to follows slice
		follows = append(follows, follow)
	}

	context.JSON(http.StatusOK, follows)
}
