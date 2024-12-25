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

	var topics []models.Topic

	for rows.Next() {
		// Declare a topic struct instance
		var topic models.Topic

		// Scan the row and modify the topic instance
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

	context.JSON(http.StatusOK, topics)
}
