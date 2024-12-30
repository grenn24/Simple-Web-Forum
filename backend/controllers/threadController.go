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

	threads, err := threadService.GetThreadsByAuthorID(utils.ConvertStringToInt(authorID, context))

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no threads found
	if len(threads) == 0 {
		context.JSON(http.StatusNotFound, dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No thread found for author id: " + authorID,
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   threads,
	})
}

func (threadController *ThreadController) GetThreadsByTopicID(context *gin.Context, db *sql.DB) {
	topicID := context.Param("topicID")

	threadService := threadController.ThreadService

	threads, err := threadService.GetThreadsByTopicID(utils.ConvertStringToInt(topicID, context))

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no threads found
	if len(threads) == 0 {
		context.JSON(http.StatusNotFound, dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No thread found for topic id: " + topicID,
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   threads,
	})
}

func (threadController *ThreadController) CreateThread(context *gin.Context, db *sql.DB) {
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

	err = threadService.CreateThread(thread)

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Thread created successfully",
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
			Message:   "No threads found for thread id: " + threadID,
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

	err := threadService.AddThreadToTopic(threadID, topicID)

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

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Added thread to topic",
	})
}
