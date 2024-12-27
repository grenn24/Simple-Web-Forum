package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/services"
)

type ThreadController struct {
	ThreadService *services.ThreadService
}

func (threadController *ThreadController) GetAllThreads(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService

	threads, err := threadService.GetAllThreads()

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no threads found
	if len(threads) == 0 {
		context.JSON(http.StatusNotFound, models.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No threads in the database",
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status: "success",
		Data:   threads,
	})
}

func (threadController *ThreadController) GetThreadByID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	threadService := threadController.ThreadService

	thread, err := threadService.GetThreadByID(threadID)

	if err != nil {
		// Check for thread not found error
		if err == sql.ErrNoRows {
			context.JSON(http.StatusNotFound, models.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   "No thread found for thread id: " + threadID,
			})
		}
		// Check for internal server errors
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
	}

	context.JSON(http.StatusOK, models.Success{
		Status: "success",
		Data:   thread,
	})
}

func (threadController *ThreadController) GetThreadsByAuthorID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	threadService := threadController.ThreadService

	threads, err := threadService.GetThreadsByAuthorID(authorID)

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no threads found
	if len(threads) == 0 {
		context.JSON(http.StatusNotFound, models.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No thread found for author id: " + authorID,
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status: "success",
		Data:   threads,
	})
}

func (threadController *ThreadController) GetThreadsByTopicID(context *gin.Context, db *sql.DB) {
	topicID := context.Param("topicID")

	threadService := threadController.ThreadService

	threads, err := threadService.GetThreadsByTopicID(topicID)

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no threads found
	if len(threads) == 0 {
		context.JSON(http.StatusNotFound, models.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No thread found for topic id: " + topicID,
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status: "success",
		Data:   threads,
	})
}

func (threadController *ThreadController) CreateThread(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService

	// Declare a pointer to a new instance of a thread struct
	thread := new(models.Thread)

	err := context.ShouldBind(&thread)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusBadRequest, err.Error())
		return
	}

	// Check if the binded struct contains necessary fields
	if thread.Title == "" || thread.Content == "" || thread.AuthorID == 0 {
		context.JSON(http.StatusBadRequest, models.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in thread object",
		})
		return
	}

	err = threadService.CreateThread(thread)

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}
}

func (threadController *ThreadController) DeleteAllThreads(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService

	err := threadService.DeleteAllThreads()

	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}
}

func (threadController *ThreadController) DeleteThreadByID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	threadService := threadController.ThreadService

	rowsDeleted, err := threadService.DeleteThreadByID(threadID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for thread not found error
	if rowsDeleted == 0 {
		context.JSON(http.StatusBadRequest, models.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No threads found for thread id: " + threadID,
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status:  "success",
		Message: "Thread deleted successfully",
	})
}
