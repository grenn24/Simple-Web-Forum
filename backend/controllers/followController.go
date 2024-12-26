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

	var follows []*models.Follow

	for rows.Next() {
		// Declare a pointer to a new instance of a follow struct
		follow := new(models.Follow)

		// Scan the current row into the follow struct
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

	// Check for empty table
	if len(follows) == 0 {
		context.String(http.StatusNotFound, "No follows in database")
		return
	}

	context.JSON(http.StatusOK, follows)
}

func CreateFollow(context *gin.Context, db *sql.DB) {
	// Declare a pointer to a new instance of a follow struct
	follow := new(models.Follow)

	err := context.ShouldBind(&follow)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusBadRequest, err.Error())
		return
	}

	// Check if the binded struct contains necessary fields
	if follow.FollowerAuthorID == 0 || (follow.FolloweeAuthorID == nil && follow.FolloweeTopicID == nil) {
		context.String(http.StatusBadRequest, "Missing required fields")
		return
	}

	_, err = db.Exec("INSERT INTO Follow (follower_author_id, followee_author_id, followee_topic_id) VALUES ($1, $2, $3)", follow.FolloweeAuthorID, follow.FolloweeAuthorID, follow.FolloweeTopicID)

	// Check for sql insertion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Thread added to database")
}
