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

	responseErr := topicService.CreateTopic(topic)

	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		} else {
			context.JSON(http.StatusBadRequest, responseErr)
			return
		}
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

	request := make(map[string]int)

	responseErr := topicService.AddThreadToTopic(request["thread_id"], request["topic_id"])

	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Added thread to topic",
	})
}

func (topicController *TopicController) GetAllTopics(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	topicsWithThreads, responseErr := topicService.GetAllTopics(utils.GetUserAuthorID(context))

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

func (topicController *TopicController) GetTrendingTopics(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService

	topicsWithThreads, responseErr := topicService.GetTrendingTopics(utils.GetUserAuthorID(context))

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


func (topicController *TopicController) SearchTopics(context *gin.Context, db *sql.DB) {
	topicService := topicController.TopicService
	userAuthorID := utils.GetUserAuthorID(context)
	query := context.Query("query")
	page := utils.ConvertStringToInt(context.Query("page"), context)
	limit := utils.ConvertStringToInt(context.Query("limit"), context)
	sortIndex := utils.ConvertStringToInt(context.Query("sort"), context)

	topics, responseErr := topicService.SearchTopics(userAuthorID, query, page, limit, sortIndex)
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}
	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   topics,
	})
}