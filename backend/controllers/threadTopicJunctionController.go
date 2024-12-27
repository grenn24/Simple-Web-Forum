package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/services"
)

type ThreadTopicJunctionController struct {
	ThreadTopicJunctionService *services.ThreadTopicJunctionService
}

func (threadTopicJunctionController *ThreadTopicJunctionController) GetAllThreadTopicJunctions(context *gin.Context, db *sql.DB) {
	threadTopicJunctionService := threadTopicJunctionController.ThreadTopicJunctionService

	threadTopicJunctions, err := threadTopicJunctionService.GetAllThreadTopicJunctions()

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no threadTopicJunctions found
	if len(threadTopicJunctions) == 0 {
		context.JSON(http.StatusNotFound, models.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No threadTopicJunctions in the database",
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status: "success",
		Data:   threadTopicJunctions,
	})
}

func (threadTopicJunctionController *ThreadTopicJunctionController) AddThreadToTopic(context *gin.Context, db *sql.DB) {
	threadTopicJunctionService := threadTopicJunctionController.ThreadTopicJunctionService

	topicID := context.Param("topicID")
	threadID := context.Param("threadID")

	err := threadTopicJunctionService.AddThreadToTopic(threadID, topicID)

	if err != nil {
		// Thread-Topic Combination already exists
		if err.Error() == "pq: duplicate key value violates unique constraint \"threadtopicjunction_thread_id_topic_id_key\"" {
			context.JSON(http.StatusBadRequest, models.Error{
				Status:    "error",
				ErrorCode: "THREADTOPICJUNCTION_ALREADY_EXISTS",
				Message:   "Thread is already added to topic id " + topicID,
			})
			return
		}
		// Thread does not exist
		if err.Error() == "pq: insert or update on table \"threadtopicjunction\" violates foreign key constraint \"threadtopicjunction_thread_id_fkey\"" {
			context.JSON(http.StatusBadRequest, models.Error{
				Status:    "error",
				ErrorCode: "THREAD_DOES_NOT_EXIST",
				Message:   "Thread of thread id: " + threadID + ") does not exist",
			})
			return
		}
		// Topic does not exist
		if err.Error() == "pq: insert or update on table \"threadtopicjunction\" violates foreign key constraint \"threadtopicjunction_topic_id_fkey\"" {
			context.JSON(http.StatusBadRequest, models.Error{
				Status:    "error",
				ErrorCode: "TOPIC_DOES_NOT_EXIST",
				Message:   "Topic of topic id: " + topicID + ") does not exist",
			})
			return
		}
		// Internal server errors
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status:  "success",
		Message: "Added thread to topic",
	})
}
