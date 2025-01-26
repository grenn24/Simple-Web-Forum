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

type LikeController struct {
	LikeService *services.LikeService
}

func (likeController *LikeController) GetAllLikes(context *gin.Context, db *sql.DB) {
	likeService := likeController.LikeService

	likes, responseErr := likeService.GetAllLikes()

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	// Check for no likes found
	if len(likes) == 0 {
		context.JSON(http.StatusNotFound, dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No likes in the database",
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   likes,
	})
}

func (likeController *LikeController) GetLikesByAuthorID(context *gin.Context, db *sql.DB) {
	likeService := likeController.LikeService
	sortIndex := utils.ConvertStringToInt(context.Query("sort"), context)
	userAuthorID := utils.GetUserAuthorID(context)

	authorID := context.Param("authorID")

	likes, responseErr := likeService.GetLikesByAuthorID(utils.ConvertStringToInt(authorID, context), sortIndex, userAuthorID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   likes,
	})
}

func (likeController *LikeController) GetLikesByUser(context *gin.Context, db *sql.DB) {
	likeService := likeController.LikeService
	sortIndex := utils.ConvertStringToInt(context.Query("sort"), context)

	userAuthorID := utils.GetUserAuthorID(context)

	likes, responseErr := likeService.GetLikesByAuthorID(userAuthorID, sortIndex, userAuthorID)

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   likes,
	})
}

func (likeController *LikeController) GetLikesByThreadID(context *gin.Context, db *sql.DB) {
	likeService := likeController.LikeService

	threadID := context.Param("threadID")

	likes, err := likeService.GetLikesByThreadID(threadID)

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for no likes found
	if len(likes) == 0 {
		context.JSON(http.StatusNotFound, dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No likes in the database",
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   likes,
	})
}

func (likeController *LikeController) CountAllLikes(context *gin.Context, db *sql.DB) {
	likeService := likeController.LikeService

	likeCount, err := likeService.CountAllLikes()

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
		Data:   gin.H{"likeCount": likeCount},
	})
}

func (likeController *LikeController) CountLikesByThreadID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	likeService := likeController.LikeService

	likeCount := likeService.CountLikesByThreadID(utils.ConvertStringToInt(threadID, context))

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   gin.H{"likeCount": likeCount},
	})
}

func (likeController *LikeController) CountLikesByAuthorID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	likeService := likeController.LikeService

	likeCount, err := likeService.CountLikesByAuthorID(authorID)

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
		Data:   gin.H{"likeCount": likeCount},
	})
}

func (likeController *LikeController) CreateLikeByThreadID(context *gin.Context, db *sql.DB) {

	likeService := likeController.LikeService
	threadID := context.Param("threadID")

	// Declare a pointer to a new instance of a like struct
	like := new(models.Like)

	err := context.ShouldBind(like)

	like.ThreadID = utils.ConvertStringToInt(threadID, context)

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
	if like.AuthorID == 0 || like.ThreadID == 0 {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in like object",
		})
		return
	}

	responseErr := likeService.CreateLike(like)

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
		Message: "Like added to database",
	})
}

func (likeController *LikeController) CreateUserLikeByThreadID(context *gin.Context, db *sql.DB) {
	likeService := likeController.LikeService
	authorID := utils.GetUserAuthorID(context)
	threadID := context.Param("threadID")

	// Declare a pointer to a new instance of a like struct
	like := new(models.Like)

	like.ThreadID = utils.ConvertStringToInt(threadID, context)
	like.AuthorID = authorID

	// Check if the binded struct contains necessary fields
	if like.AuthorID == 0 || like.ThreadID == 0 {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in like object",
		})
		return
	}

	responseErr := likeService.CreateLike(like)
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
		Message: "Like added to database",
	})
}

func (likeController *LikeController) DeleteUserLikeByThreadID(context *gin.Context, db *sql.DB) {
	likeService := likeController.LikeService
	authorID := utils.GetUserAuthorID(context)
	threadID := context.Param("threadID")

	// Declare a pointer to a new instance of a like struct
	like := new(models.Like)

	like.ThreadID = utils.ConvertStringToInt(threadID, context)
	like.AuthorID = authorID

	// Check if the binded struct contains necessary fields
	if like.AuthorID == 0 || like.ThreadID == 0 {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in like for deletion",
		})
		return
	}

	responseErr := likeService.DeleteLikeByThreadAuthorID(like.ThreadID, like.AuthorID)
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
		Message: "Like deleted successfully",
	})

}
