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

type FollowController struct {
	FollowService *services.FollowService
}

func (followController *FollowController) GetAllFollows(context *gin.Context, db *sql.DB) {
	followService := followController.FollowService

	follows, err := followService.GetAllFollows()

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
	}

	// Check for no follows found
	if len(follows) == 0 {
		context.JSON(http.StatusNotFound, dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No follows in the database",
		})
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   follows,
	})
}

func (followController *FollowController) GetFollowedThreadsByAuthorID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	followService := followController.FollowService

	follows, err := followService.GetFollowedThreadsByAuthorID(authorID)

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
	}

	// Check for no followed threads found
	if len(follows) == 0 {
		context.JSON(http.StatusNotFound, dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No threads being followed by author id: " + authorID,
		})
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   follows,
	})
}

func (followController *FollowController) CreateFollow(context *gin.Context, db *sql.DB) {
	followService := followController.FollowService

	// Declare a pointer to a new instance of a follow struct
	follow := new(models.Follow)

	err := context.ShouldBind(follow)

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
	if follow.FollowerAuthorID == 0 || (follow.FolloweeAuthorID == nil && follow.FolloweeTopicID == nil) {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in follow object",
		})
		return
	}

	responseErr := followService.CreateFollow(follow)

	
	if responseErr != nil {
		// Check for internal server errors
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Follow added to database",
	})
}

func (followController *FollowController) CreateUserFollow(context *gin.Context, db *sql.DB) {
	followService := followController.FollowService

	// Declare a pointer to a new instance of a follow struct
	follow := new(models.Follow)

	follow.FollowerAuthorID = utils.GetUserAuthorID(context)

	err := context.ShouldBind(follow)

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
	if follow.FollowerAuthorID == 0 || (follow.FolloweeAuthorID == nil && follow.FolloweeTopicID == nil) {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in follow object",
		})
		return
	}

	responseErr := followService.CreateFollow(follow)

	
	if responseErr != nil {
		// Check for internal server errors
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Follow added to database",
	})
}


func (followController *FollowController) DeleteFollow(context *gin.Context, db *sql.DB) {
	followService := followController.FollowService

	// Declare a pointer to a new instance of a followstruct
	follow := new(models.Follow)

	err := context.ShouldBind(follow)

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
	if follow.FollowerAuthorID == 0 || (follow.FolloweeAuthorID == nil && follow.FolloweeTopicID == nil) {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in follow for deletion",
		})
		return
	}

	responseErr := followService.DeleteFollowByFollowerFolloweeID(follow.FollowerAuthorID, follow.FolloweeTopicID, follow.FolloweeAuthorID)

	if responseErr != nil && responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	
	if responseErr != nil && responseErr.ErrorCode == "NOT_FOUND" {
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Follow deleted successfully",
	})
}

func (followController *FollowController) DeleteUserFollow(context *gin.Context, db *sql.DB) {
	followService := followController.FollowService

	// Declare a pointer to a new instance of a follow struct
	follow := new(models.Follow)

	follow.FollowerAuthorID = utils.GetUserAuthorID(context)

	err := context.ShouldBind(follow)

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
	if  (follow.FolloweeAuthorID == nil && follow.FolloweeTopicID == nil) {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in follow for deletion",
		})
		return
	}

	

	responseErr := followService.DeleteFollowByFollowerFolloweeID(follow.FollowerAuthorID, follow.FolloweeTopicID, follow.FolloweeAuthorID)

	if responseErr != nil && responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	
	if responseErr != nil && responseErr.ErrorCode == "NOT_FOUND" {
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Follow deleted successfully",
	})
}
