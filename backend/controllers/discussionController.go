package controllers

import (
	"database/sql"
	"encoding/json"
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

func (discussionController *DiscussionController) GetThreadsByDiscussionID(context *gin.Context, db *sql.DB) {

	discussionService := discussionController.DiscussionService
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)
	sortIndex := utils.ConvertStringToInt(context.Query("sort"), context)
	userAuthorID := utils.GetUserAuthorID(context)
	threads, responseErr := discussionService.GetThreadsByDiscussionID(discussionID, userAuthorID, sortIndex)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   threads,
	})
}

func (discussionController *DiscussionController) GetPopularDiscussions(context *gin.Context, db *sql.DB) {

	discussionService := discussionController.DiscussionService

	userAuthorID := utils.GetUserAuthorID(context)
	discussions, responseErr := discussionService.GetPopularDiscussions(userAuthorID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   discussions,
	})
}

func (discussionController *DiscussionController) GetDiscussionByID(context *gin.Context, db *sql.DB) {

	discussionService := discussionController.DiscussionService
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)
	userAuthorID := utils.GetUserAuthorID(context)
	discussion, responseErr := discussionService.GetDiscussionByID(discussionID, userAuthorID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   discussion,
	})
}

func (discussionController *DiscussionController) GetJoinRequestsByDiscussionID(context *gin.Context, db *sql.DB) {

	discussionService := discussionController.DiscussionService
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)
	joinRequests, responseErr := discussionService.GetJoinRequestsByDiscussionID(discussionID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   joinRequests,
	})
}

func (discussionController *DiscussionController) GetMembersByDiscussionID(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)
	members, responseErr := discussionService.GetMembersByDiscussionID(discussionID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   members,
	})
}

func (discussionController *DiscussionController) DeleteMemberByID(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	memberID := utils.ConvertStringToInt(context.Param("memberID"), context)

	responseErr := discussionService.DeleteMemberByID(memberID)

	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Member deleted",
	})
}

func (discussionController *DiscussionController) DeleteMemberByAuthorIDDiscussionID(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	authorID := utils.ConvertStringToInt(context.Param("authorID"), context)
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)

	responseErr := discussionService.DeleteMemberByAuthorIDDiscussionID(authorID, discussionID)

	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Member deleted",
	})
}

func (discussionController *DiscussionController) CreateDiscussion(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	contentType := context.GetHeader("Content-Type")

	if strings.Split(contentType, ";")[0] == "multipart/form-data" {
		discussion := new(dtos.DiscussionDTO)
		userAuthorID := utils.GetUserAuthorID(context)
		discussion.Creator = new(dtos.AuthorDTO)
		discussion.Creator.AuthorID = userAuthorID
		discussion.Name = context.PostForm("name")
		discussion.Description = context.PostForm("description")
	
		err := json.Unmarshal([]byte(context.PostForm("members")), &discussion.Members )
		if err != nil {
			context.JSON(http.StatusInternalServerError, dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			})
		}

		discussionIcon, err := context.FormFile("background_image")
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
			discussion.BackgroundImage = nil
		} else {
			discussion.BackgroundImage = discussionIcon
		}

		responseErr := discussionService.CreateDiscussion(discussion, userAuthorID)
		if responseErr != nil {
			context.JSON(http.StatusInternalServerError, responseErr)
		}

		context.JSON(http.StatusCreated, dtos.Success{
			Status:  "success",
			Message: "Discussion created successfully!",
		})
	}

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

func (discussionController *DiscussionController) CreateUserJoinRequest(context *gin.Context, db *sql.DB) {
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)
	userAuthorID := utils.GetUserAuthorID(context)
	if discussionID == 0 {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing discussion id for join request",
		})
		return
	}

	joinRequest := new(models.DiscussionJoinRequest)

	joinRequest.DiscussionID = discussionID
	joinRequest.AuthorID = userAuthorID
	discussionService := discussionController.DiscussionService
	responseErr := discussionService.CreateJoinRequest(joinRequest)
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
		Message: "Join request submitted",
	})
}

func (discussionController *DiscussionController) DeleteUserJoinRequest(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	userAuthorID := utils.GetUserAuthorID(context)
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)

	responseErr := discussionService.DeleteJoinRequestByDiscussionIDAuthorID(discussionID, userAuthorID)
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
		Message: "Join request deleted",
	})
}

func (discussionController *DiscussionController) DeleteJoinRequestByID(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	requestID := utils.ConvertStringToInt(context.Param("requestID"), context)

	responseErr := discussionService.DeleteJoinRequestByID(requestID)
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
		Message: "Join request deleted",
	})
}

func (discussionController *DiscussionController) SearchDiscussions(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	query := context.Query("query")
	page := utils.ConvertStringToInt(context.Query("page"), context)
	limit := utils.ConvertStringToInt(context.Query("limit"), context)
	sortIndex := utils.ConvertStringToInt(context.Query("sort"), context)
	userAuthorID := utils.GetUserAuthorID(context)

	discussions, responseErr := discussionService.SearchDiscussions(query, page, limit, sortIndex, userAuthorID)
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}
	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   discussions,
	})
}

func (discussionController *DiscussionController) UpdateDiscussion(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)
	// Declare a pointer to a new instance of a discussion struct
	discussion := new(models.Discussion)
	discussion.DiscussionID = discussionID
	err := context.ShouldBind(discussion)

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
	if discussion.Name == "" {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required discussion name",
		})
		return
	}

	responseErr := discussionService.UpdateDiscussion(discussion, discussionID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Discussion updated successfully!",
	})
}

func (discussionController *DiscussionController) AddUserToDiscussion(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	userAuthorID := utils.GetUserAuthorID(context)
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)

	responseErr := discussionService.CreateMember(userAuthorID, discussionID)

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

func (discussionController *DiscussionController) CreateMember(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)
	request := make(map[string]int)
	err := context.BindJSON(&request)
	if err != nil {
		context.JSON(http.StatusInternalServerError, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
	}

	responseErr := discussionService.CreateMember(request["author_id"], discussionID)

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

func (discussionController *DiscussionController) RemoveUserFromDiscussion(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService

	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)
	userAuthorID := utils.GetUserAuthorID(context)
	responseErr := discussionService.DeleteMemberByAuthorIDDiscussionID(userAuthorID, discussionID)

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
		Message: "Removed member from discussion",
	})
}

func (discussionController *DiscussionController) DeleteDiscussionByID(context *gin.Context, db *sql.DB) {
	discussionService := discussionController.DiscussionService
	discussionID := utils.ConvertStringToInt(context.Param("discussionID"), context)

	responseErr := discussionService.DeleteDiscussionByID(discussionID)
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
		Message: "Discussion deleted successfully",
	})
}
