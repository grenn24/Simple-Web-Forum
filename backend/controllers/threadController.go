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

type ThreadController struct {
	ThreadService *services.ThreadService
}

func (threadController *ThreadController) GetAllThreads(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService

	threads, err := threadService.GetAllThreads()

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
		Data:   threads,
	})
}

func (threadController *ThreadController) GetThreadByID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")
	

	threadService := threadController.ThreadService

	thread, responseErr := threadService.GetThreadByID(utils.ConvertStringToInt(threadID, context))

	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.JSON(http.StatusNotFound, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   thread,
	})
}

func (threadController *ThreadController) GetThreadExpandedByID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	threadService := threadController.ThreadService

	thread, responseErr := threadService.GetThreadExpandedByID(utils.ConvertStringToInt(threadID, context), utils.GetUserAuthorID(context))

	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.JSON(http.StatusNotFound, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   thread,
	})
}

func (threadController *ThreadController) GetThreadsByAuthorID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	threadService := threadController.ThreadService

	threads, responseErr := threadService.GetThreadsByAuthorID(utils.ConvertStringToInt(authorID, context))

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   threads,
	})
}

func (threadController *ThreadController) GetThreadsByUser(context *gin.Context, db *sql.DB) {

	threadService := threadController.ThreadService

	threads, responseErr := threadService.GetThreadsByAuthorID(utils.GetUserAuthorID(context))

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   threads,
	})
}

func (threadController *ThreadController) GetThreadsByTopicID(context *gin.Context, db *sql.DB) {
	topicID := utils.ConvertStringToInt(context.Param("topicID"), context)
	userAuthorID := utils.GetUserAuthorID(context)

	threadService := threadController.ThreadService

	threads, responseErr := threadService.GetThreadsByTopicID(topicID, userAuthorID)

	if responseErr != nil {
		if responseErr.ErrorCode=="INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   threads,
	})
}

func (threadController *ThreadController) CreateUserThread(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService

	// Declare a pointer to a new instance of a thread struct
	thread := new(models.Thread)

	err := context.ShouldBind(thread)

	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Retrieve current user author id and bind it to thread struct
	authorID := utils.GetUserAuthorID(context)
	thread.AuthorID = authorID

	// Check if the binded struct contains necessary fields
	if thread.Title == "" || thread.AuthorID == 0 {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in thread object",
		})
		return
	}

	// Create new thread
	responseErr := threadService.CreateThread(thread)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Thread created successfully!",
	})
}

func (threadController *ThreadController) DeleteAllThreads(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService

	err := threadService.DeleteAllThreads()

	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "All threads deleted",
	})
}

func (threadController *ThreadController) DeleteThreadByID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	threadService := threadController.ThreadService

	rowsDeleted, err := threadService.DeleteThreadByID(utils.ConvertStringToInt(threadID, context))

	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for thread not found error
	if rowsDeleted == 0 {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No threads found with thread id: " + threadID,
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Thread deleted successfully",
	})
}

func (threadController *ThreadController) GetAllThreadTopicJunctions(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService

	threadTopicJunctions, err := threadService.GetAllThreadTopicJunctions()

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

func (threadController *ThreadController) AddThreadToTopic(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService

	topicID := context.Param("topicID")
	threadID := context.Param("threadID")

	responseErr := threadService.AddThreadToTopic(utils.ConvertStringToInt(threadID, context), utils.ConvertStringToInt(topicID, context))

	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		} else {
			context.JSON(http.StatusBadRequest, responseErr)
			return
		}
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Added thread to topic",
	})
}
