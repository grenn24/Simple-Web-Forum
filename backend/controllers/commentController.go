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

type CommentController struct {
	CommentService *services.CommentService
}

func (commentController *CommentController) GetAllComments(context *gin.Context, db *sql.DB) {
	commentService := commentController.CommentService

	comments, responseErr := commentService.GetAllComments(context.Query("sort"))

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   comments,
	})
}

func (commentController *CommentController) GetCommentsByThreadID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	commentService := commentController.CommentService

	comments, responseErr := commentService.GetCommentsByThreadID(utils.ConvertStringToInt(threadID, context), context.Query("sort"))

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   comments,
	})
}

func (commentController *CommentController) GetCommentedThreadsByAuthorID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	commentService := commentController.CommentService

	comments, responseErr := commentService.GetCommentedThreadsByAuthorID(utils.ConvertStringToInt(authorID, context))

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   comments,
	})
}

func (commentController *CommentController) GetCommentedThreadsByUser(context *gin.Context, db *sql.DB) {

	commentService := commentController.CommentService

	comments, responseErr := commentService.GetCommentedThreadsByAuthorID(utils.GetUserAuthorID(context))

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   comments,
	})
}

func (commentController *CommentController) CountAllComments(context *gin.Context, db *sql.DB) {
	commentService := commentController.CommentService

	commentCount, err := commentService.CountAllComments()

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
		Data:   gin.H{"commentCount": commentCount},
	})
}

func (commentController *CommentController) CountCommentsByThreadID(context *gin.Context, db *sql.DB) {
	commentService := commentController.CommentService

	threadID := context.Param("threadID")

	commentCount, err := commentService.CountCommentsByThreadID(threadID)

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
		Data:   gin.H{"commentCount": commentCount},
	})
}

func (commentController *CommentController) CreateCommentByThreadID(context *gin.Context, db *sql.DB) {
	commentService := commentController.CommentService
	threadID := context.Param("threadID")

	// Declare a pointer to a new instance of a comment struct
	comment := new(models.Comment)

	err := context.ShouldBind(comment)
	comment.ThreadID = utils.ConvertStringToInt(threadID, context)

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
	if comment.ThreadID == 0 || comment.AuthorID == 0 || comment.Content == "" {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in comment object",
		})
		return
	}

	responseErr := commentService.CreateComment(comment)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Comment added to database",
	})
}

func (commentController *CommentController) CreateUserCommentByThreadID(context *gin.Context, db *sql.DB) {
	commentService := commentController.CommentService
	threadID := context.Param("threadID")
	authorID := utils.GetUserAuthorID(context)

	// Declare a pointer to a new instance of a comment struct
	comment := new(models.Comment)

	err := context.ShouldBind(comment)
	comment.AuthorID = authorID
	comment.ThreadID = utils.ConvertStringToInt(threadID, context)

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
	if comment.ThreadID == 0 || comment.AuthorID == 0 || comment.Content == "" {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in comment object",
		})
		return
	}

	responseErr := commentService.CreateComment(comment)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Comment added to database",
	})
}

func (commentController *CommentController) DeleteAllComments(context *gin.Context, db *sql.DB) {
	commentService := commentController.CommentService

	responseErr := commentService.DeleteAllComments()

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Deleted all comments",
	})
}

func (commentController *CommentController) DeleteCommentByID(context *gin.Context, db *sql.DB) {
	commentService := commentController.CommentService
	commentID := context.Param("commentID")

	responseErr := commentService.DeleteCommentByID(utils.ConvertStringToInt(commentID, context))

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
		Message: "Deleted comment with comment id: " + commentID,
	})
}
