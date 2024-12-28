package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/services"
)

type TopicController struct {
	TopicService *services.TopicService
}

func (topicController *TopicController) GetAllTopics(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	topics, err := topicService.GetAllTopics()

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no topics found
	if len(topics) == 0 {
		context.JSON(http.StatusNotFound, models.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No topics in the database",
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status: "success",
		Data:   topics,
	})
}

func (topicController *TopicController) GetTopicsByThreadID(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	threadID := context.Param("threadID")

	topics, err := topicService.GetTopicsByThreadID(threadID)

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no topics found
	if len(topics) == 0 {
		context.JSON(http.StatusNotFound, models.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No topics found for thread id: " + threadID,
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status: "success",
		Data:   topics,
	})
}

func (topicController *TopicController) CreateTopic(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	// Declare a pointer to a new instance of a topic struct
	topic := new(models.Topic)

	err := context.ShouldBind(topic)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusBadRequest, err.Error())
		return
	}

	// Check if the binded struct contains necessary fields
	if topic.Name == "" {
		context.JSON(http.StatusBadRequest, models.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in topic object",
		})
		return
	}

	err = topicService.CreateTopic(topic)

	// Check for sql insertion errors
	if err != nil {
		// Check for existing name
		if err.Error() == "pq: duplicate key value violates unique constraint \"topic_name_lowercase\"" {
			context.JSON(http.StatusBadRequest, models.Error{
				Status:    "error",
				ErrorCode: "NAME_ALREADY_EXISTS",
				Message:   "The topic name provided has already been used. (case insensitive)",
			})
			return
		}
		// Other errors
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status:  "success",
		Message: "Topic added to database",
	})
}
