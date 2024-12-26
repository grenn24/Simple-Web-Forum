package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllTopics(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM topic")

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var topics []*models.Topic

	for rows.Next() {
		// Declare a pointer to a new instance of a topic struct
		topic := new(models.Topic)

		// Scan the current row into the topic struct
		err := rows.Scan(
			&topic.TopicID,
			&topic.Name,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned topic to topics slice
		topics = append(topics, topic)
	}

	// Check for empty table
	if len(topics) == 0 {
		context.String(http.StatusNotFound, "No topics in database")
		return
	}

	context.JSON(http.StatusOK, topics)
}

func GetTopicsByThreadID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	rows, err := db.Query(`
		SELECT topic.topic_id, topic.name
		FROM threadTopicJunction
		INNER JOIN topic ON threadTopicJunction.topic_id = topic.topic_id
		WHERE threadTopicJunction.thread_id = $1
	`, threadID)

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var topics []*models.Topic

	for rows.Next() {
		// Declare a pointer to a new instance of a topic struct
		topic := new(models.Topic)

		// Scan the current row into the topic struct
		err := rows.Scan(
			&topic.TopicID,
			&topic.Name,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned topic to topics slice
		topics = append(topics, topic)
	}

	// Check for empty table
	if len(topics) == 0 {
		context.String(http.StatusNotFound, "No topics found for this thread")
		return
	}

	context.JSON(http.StatusOK, topics)

}

func CreateTopic(context *gin.Context, db *sql.DB) {
	// Declare a pointer to a new instance of a topic struct
	topic := new(models.Topic)

	err := context.ShouldBind(&topic)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusBadRequest, err.Error())
		return
	}

	// Check if the binded struct contains necessary fields
	if topic.Name == "" {
		context.String(http.StatusBadRequest, "Missing required fields")
		return
	}

	_, err = db.Exec("INSERT INTO topic (name) VALUES ($1)", topic.Name)

	// Check for sql insertion errors
	if err != nil {
		// Check for existing name
		if err.Error() == "pq: duplicate key value violates unique constraint \"topic_name_lowercase\"" {
			context.String(http.StatusBadRequest, "Topic name already exists (case insensitive)")
			return
		}
		// Other errors
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Topic added to database")
}
