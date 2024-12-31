package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/services"
	"github.com/grenn24/simple-web-forum/utils"
)

type TopicController struct {
	TopicService *services.TopicService
}

func (topicController *TopicController) GetAllTopics(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	topics, err := topicService.GetAllTopics()

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   topics,
	})
}

func (topicController *TopicController) GetTopicsByThreadID(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	threadID := context.Param("threadID")

	topics, responseErr := topicService.GetTopicsByThreadID(utils.ConvertStringToInt(threadID, context))

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
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
		context.JSON(http.StatusBadRequest, dtos.Error{
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
			context.JSON(http.StatusBadRequest, dtos.Error{
				Status:    "error",
				ErrorCode: "NAME_ALREADY_EXISTS",
				Message:   "The topic name provided has already been used. (case insensitive)",
			})
			return
		}
		// Other errors
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Topic added to database",
	})
}

func (topicController *TopicController) GetAllThreadTopicJunctions(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	threadTopicJunctions, err := topicService.GetAllThreadTopicJunctions()

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no threadTopicJunctions found
	if len(threadTopicJunctions) == 0 {
		context.JSON(http.StatusNotFound, dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No threadTopicJunctions in the database",
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   threadTopicJunctions,
	})
}

func (topicController *TopicController) AddThreadToTopic(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	topicID := context.Param("topicID")
	threadID := context.Param("threadID")

	err := topicService.AddThreadToTopic(threadID, topicID)

	if err != nil {
		// Thread-Topic Combination already exists
		if err.Error() == "pq: duplicate key value violates unique constraint \"threadtopicjunction_thread_id_topic_id_key\"" {
			context.JSON(http.StatusBadRequest, dtos.Error{
				Status:    "error",
				ErrorCode: "THREADTOPICJUNCTION_ALREADY_EXISTS",
				Message:   "Thread of thread id: " + threadID + " is already added to topic id " + topicID,
			})
			return
		}
		// Thread does not exist
		if err.Error() == "pq: insert or update on table \"threadtopicjunction\" violates foreign key constraint \"threadtopicjunction_thread_id_fkey\"" {
			context.JSON(http.StatusBadRequest, dtos.Error{
				Status:    "error",
				ErrorCode: "THREAD_DOES_NOT_EXIST",
				Message:   "Thread of thread id: " + threadID + " does not exist",
			})
			return
		}
		// Topic does not exist
		if err.Error() == "pq: insert or update on table \"threadtopicjunction\" violates foreign key constraint \"threadtopicjunction_topic_id_fkey\"" {
			context.JSON(http.StatusBadRequest, dtos.Error{
				Status:    "error",
				ErrorCode: "TOPIC_DOES_NOT_EXIST",
				Message:   "Topic of topic id: " + topicID + " does not exist",
			})
			return
		}
		// Internal server errors
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Added thread to topic",
	})
}

func (topicController *TopicController) GetAllTopicsWithThreads(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	topicsWithThreads, responseErr := topicService.GetAllTopicsWithThreads(utils.GetUserAuthorID(context))

	if responseErr != nil {
		// Internal server errors
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   topicsWithThreads,
	})
}

func (topicController *TopicController) GetAllTopicsWithFollowStatus(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	topicsWithFollowStatus, responseErr := topicService.GetAllTopicsWithFollowStatus(utils.GetUserAuthorID(context))

	if responseErr != nil {
		// Internal server errors
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   topicsWithFollowStatus,
	})
}
