package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/services"
	"github.com/grenn24/simple-web-forum/utils"
)

type DiscussionController struct {
	DiscussionService *services.DiscussionService
}

func (discussionController *DiscussionController) CreateDiscussion(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	discussion := new(models.Discussion)
	authorID := utils.GetUserAuthorID(context)
	discussion.CreatorAuthorID = authorID
	discussion.Name = context.PostForm("name")
	discussion.Description = context.PostForm("description")

	discussionIcon, err := context.FormFile("discussion_icon")
	if err != nil {
		// Check for internal server errors
		if err.Error() != "http: no such file" {
			context.JSON(http.StatusInternalServerError, dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			})
			return
		}
		discussion.DiscussionIcon = nil
	} else {
		discussion.DiscussionIcon = discussionIcon
	}

	responseErr := discussionService.CreateDiscussion(discussion)
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
	}
	
	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Discussion created successfully!",
	})
}

func (discussionController *DiscussionController) CreateDiscussionThread(context *gin.Context, db *sql.DB, progressChannels map[string]chan float64, errorChannels map[string]chan *dtos.Error, mutex *sync.Mutex) {
	discussionService := discussionController.DiscussionService
	contentType := context.GetHeader("Content-Type")
	// Declare a pointer to a new instance of a thread struct
	thread := new(models.Thread)
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)
	if strings.Split(contentType, ";")[0] == "multipart/form-data" {
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
		go discussionService.CreateDiscussionThread(thread, discussionID, progressChannel, errorChannel)
	}
}

func (discussionController *DiscussionController) AddMemberToDiscussion(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService

	request := make(map[string]int)

	responseErr := discussionService.AddMemberToDiscussion(request["member_author_id"], request["discussion_id"])

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
		Message: "Added member to discussion",
	})
}
