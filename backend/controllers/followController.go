package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllFollows(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM follow")

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

func GetFollowedThreadsByAuthorID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	rows, err := db.Query(`
		SELECT DISTINCT 
			thread.thread_id, 
			thread.title, 
			thread.created_at, 
			thread.content, 
			thread.author_id, 
			thread.image_title, 
			thread.image_link
		FROM follow
		LEFT JOIN threadTopicJunction ON threadTopicJunction.topic_id = follow.followee_topic_id
		LEFT JOIN thread ON thread.author_id = follow.followee_author_id 
			OR thread.thread_id = threadTopicJunction.thread_id
		WHERE follower_author_id = $1
	`, authorID)

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var threads []*models.Thread

	for rows.Next() {
		// Declare a pointer to a new instance of a thread struct
		thread := new(models.Thread)

		// Scan the current row into the thread struct
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

		// Append the scanned follow to follows slice
		threads = append(threads, thread)
	}

	// Check for empty table
	if len(threads) == 0 {
		context.String(http.StatusNotFound, "No threads being followed")
		return
	}

	context.JSON(http.StatusOK, threads)
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

	_, err = db.Exec("INSERT INTO follow (follower_author_id, followee_author_id, followee_topic_id) VALUES ($1, $2, $3)", follow.FollowerAuthorID, follow.FolloweeAuthorID, follow.FolloweeTopicID)

	// Check for sql insertion errors
	if err != nil {
		// Check for existing follower_author-followee_author combination
		if err.Error() == "pq: duplicate key value violates unique constraint \"follow_follower_author_id_followee_author_id_key\"" {
			context.String(http.StatusBadRequest, "Author has already been followed")
			return
		}
		// Check for existing follower_author-followee_topic combination
		if err.Error() == "pq: duplicate key value violates unique constraint \"follow_follower_author_id_followee_topic_id_key\"" {
			context.String(http.StatusBadRequest, "Topic has already been followed")
			return
		}
		//Other errors
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Follow added to database")
}
