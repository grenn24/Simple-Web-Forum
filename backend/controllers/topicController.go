package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllTopics(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM Topic")

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
			&topic.ThreadID,
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
