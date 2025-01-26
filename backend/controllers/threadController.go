package controllers

import (
	"database/sql"
	"fmt"
	_ "image"
	"net/http"
	"strings"
	"sync"

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
	threadService := threadController.ThreadService
	threadID := utils.ConvertStringToInt(context.Param("threadID"), context)
	userAuthorID := utils.GetUserAuthorID(context)
	commentSortIndex := utils.ConvertStringToInt(context.Query("comment-sort"), context)

	thread, responseErr := threadService.GetThreadExpandedByID(threadID, userAuthorID, commentSortIndex)

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
	authorID := utils.ConvertStringToInt(context.Param("authorID"),context)
	userAuthorID := utils.GetUserAuthorID(context)

	threadService := threadController.ThreadService

	threads, responseErr := threadService.GetThreadsByAuthorID(authorID, userAuthorID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   threads,
	})
}

func (threadController *ThreadController) SearchThreads(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService
	userAuthorID := utils.GetUserAuthorID(context)
	query := context.Query("query")
	page := utils.ConvertStringToInt(context.Query("page"), context)
	limit := utils.ConvertStringToInt(context.Query("limit"), context)
	sortIndex := utils.ConvertStringToInt(context.Query("sort"), context)

	threads, responseErr := threadService.SearchThreads(userAuthorID, query, page, limit, sortIndex)
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
	userAuthorID := utils.GetUserAuthorID(context)
	threadService := threadController.ThreadService

	threads, responseErr := threadService.GetThreadsByAuthorID(userAuthorID, userAuthorID)

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
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
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

func (threadController *ThreadController) GetTrendingThreads(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService
	userAuthorID := utils.GetUserAuthorID(context)
	page := utils.ConvertStringToInt(context.Query("page"), context)
	limit := utils.ConvertStringToInt(context.Query("limit"), context)
	threads, responseErr := threadService.GetTrendingThreads(userAuthorID, page, limit)
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}
	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   threads,
	})

}

// Accepts form data request body
func (threadController *ThreadController) CreateThread(context *gin.Context, db *sql.DB, progressChannels map[string]chan float64, errorChannels map[string]chan *dtos.Error, mutex *sync.Mutex) {
	threadService := threadController.ThreadService
	contentType := context.GetHeader("Content-Type")

	if strings.Split(contentType, ";")[0] == "multipart/form-data" {
		// Declare a pointer to a new instance of a thread struct
		thread := new(models.Thread)

		// Create the progress and error channels
		uploadID := context.PostForm("upload_id")
		if uploadID == "" {
			context.JSON(http.StatusBadRequest, dtos.Error{
				Status:    "error",
				ErrorCode: "MISSING_REQUIRED_FIELDS",
				Message:   "Missing upload id",
			})
			return
		}
		mutex.Lock()
		fmt.Println("progress channel created")
		progressChannel := make(chan float64)
		progressChannels[uploadID] = progressChannel
		fmt.Println("error channel created")
		errorChannel := make(chan *dtos.Error)
		errorChannels[uploadID] = errorChannel
		mutex.Unlock()

		// Assign the necessary fields
		authorID := utils.GetUserAuthorID(context)
		thread.AuthorID = authorID
		thread.Title = context.PostForm("title")
		thread.Content = context.PostForm("content")

		fmt.Println(("no errors"))

		// Check if the binded struct contains necessary fields
		if thread.Title == "" || thread.AuthorID == 0 {
			context.JSON(http.StatusBadRequest, dtos.Error{
				Status:    "error",
				ErrorCode: "MISSING_REQUIRED_FIELDS",
				Message:   "Missing required thread title",
			})
			return
		}

		context.JSON(http.StatusCreated, dtos.Success{
			Status:  "success",
			Message: "Thread upload has started",
		})

		// Extract images and topics tagged from http request multipart form
		thread.TopicsTagged = context.PostFormArray("topics_tagged")
		formData, err := context.MultipartForm()

		if err != nil {
			errorChannel <- &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
			return
		}
		// If no images are uploaded, images will be an empty file array
		images := formData.File["images"]
		thread.Image = images
		videos := formData.File["videos"]
		thread.Video = videos
		thread.Visiblity = "public"

		fmt.Println(("thread upload started"))
		// Create new thread, subsequent errors sent using websocket
		go threadService.CreateThread(thread, progressChannel, errorChannel)
	}
}

func (threadController *ThreadController) UpdateThread(context *gin.Context, db *sql.DB) {
	threadService := threadController.ThreadService
	threadID := utils.ConvertStringToInt(context.Param("threadID"), context)

	// Declare a pointer to a new instance of a thread struct
	thread := new(models.Thread)
	thread.ThreadID = threadID
	err := context.ShouldBind(thread)

	// Check for JSON binding errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check if the binded struct contains necessary fields
	if thread.Title == "" {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required thread title",
		})
		return
	}

	responseErr := threadService.UpdateThread(thread, threadID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Thread updated successfully!",
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

	responseErr := threadService.DeleteThreadByID(utils.ConvertStringToInt(threadID, context))

	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.JSON(http.StatusNotFound, responseErr)
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
