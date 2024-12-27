package controllers

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/services"
)

type FollowController struct {
	FollowService *services.FollowService
}

func (followController *FollowController) GetAllFollows(context *gin.Context, db *sql.DB) {
	followService := followController.FollowService

	follows, err := followService.GetAllFollows()

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
	}

	// Check for no follows found
	if len(follows) == 0 {
		context.JSON(http.StatusNotFound, models.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No follows in the database",
		})
	}

	context.JSON(http.StatusOK, models.Success{
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
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
	}

	// Check for no followed threads found
	if len(follows) == 0 {
		context.JSON(http.StatusNotFound, models.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No threads being followed by author id: " + authorID,
		})
	}

	context.JSON(http.StatusOK, models.Success{
		Status: "success",
		Data:   follows,
	})
}

func (followController *FollowController) CreateFollow(context *gin.Context, db *sql.DB) {
	followService := followController.FollowService

	// Declare a pointer to a new instance of a follow struct
	follow := new(models.Follow)

	err := context.ShouldBind(&follow)

	// Check for JSON binding errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check if the binded struct contains necessary fields
	if follow.FollowerAuthorID == 0 || (follow.FolloweeAuthorID == nil && follow.FolloweeTopicID == nil) {
		context.JSON(http.StatusBadRequest, models.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in follow object",
		})
		return
	}

	err = followService.CreateFollow(follow)

	if err != nil {
		// Check for existing follower_author-followee_author combination
		if err.Error() == "pq: duplicate key value violates unique constraint \"follow_follower_author_id_followee_author_id_key\"" {
			context.JSON(http.StatusBadRequest, models.Error{
				Status:    "error",
				ErrorCode: "FOLLOW_ALREADY_EXISTS",
				Message:   fmt.Sprintf("Author of author id %v is already following author of author id %v", follow.FollowerAuthorID, follow.FolloweeAuthorID),
			})
			return
		}
		// Check for existing follower_author-followee_topic combination
		if err.Error() == "pq: duplicate key value violates unique constraint \"follow_follower_author_id_followee_topic_id_key\"" {
			context.JSON(http.StatusBadRequest, models.Error{
				Status:    "error",
				ErrorCode: "FOLLOW_ALREADY_EXISTS",
				Message:   fmt.Sprintf("Author of author id %v is already following topic of topic id %v", follow.FollowerAuthorID, follow.FolloweeTopicID),
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
		Message: "Follow added to database",
	})
}
