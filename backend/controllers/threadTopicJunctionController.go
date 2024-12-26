package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllThreadTopicJunctions(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM threadTopicJunction")

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var threadTopicJunctions []*models.ThreadTopicJunction

	for rows.Next() {
		// Declare a pointer to a new instance of a threadTopicJunction struct
		threadTopicJunction := new(models.ThreadTopicJunction)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&threadTopicJunction.ThreadTopicJunctionID,
			&threadTopicJunction.ThreadID,
			&threadTopicJunction.TopicID,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned threadTopicJunction to the threadTopicJunctions slice
		threadTopicJunctions = append(threadTopicJunctions, threadTopicJunction)

		// Check for empty table
		if len(threadTopicJunctions) == 0 {
			context.String(http.StatusNotFound, "No threadTopicJunctions in database")
			return
		}

		context.JSON(http.StatusOK, threadTopicJunctions)
	}
}

func AddThreadToTopic(context *gin.Context, db *sql.DB) {
	topicID := context.Param("topicID")
	threadID := context.Param("threadID")

	_, err := db.Exec("INSERT INTO threadTopicJunction (thread_id, topic_id) VALUES ($1, $2)", threadID, topicID)

	// Check for any insertion errors
	if err != nil {
		// Thread-Topic Combination already exists
		if err.Error() == "pq: duplicate key value violates unique constraint \"threadtopicjunction_thread_id_topic_id_key\"" {
			context.String(http.StatusBadRequest, "Thread already added to topic")
			return
		}
		// Thread does not exist
		if err.Error() == "pq: insert or update on table \"threadtopicjunction\" violates foreign key constraint \"threadtopicjunction_thread_id_fkey\"" {
			context.String(http.StatusBadRequest, "Referenced thread (threadID: "+threadID+") does not exist, therefore it cannot be added to topic")
			return
		}
		// Topic does not exist
		if err.Error() == "pq: insert or update on table \"threadtopicjunction\" violates foreign key constraint \"threadtopicjunction_topic_id_fkey\"" {
			context.String(http.StatusBadRequest, "Topic (topicID: "+topicID+") does not exist")
			return
		}
		// Other errors
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Added thread to topic")
}
