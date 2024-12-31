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

type BookmarkController struct {
	BookmarkService *services.BookmarkService
}

func (bookmarkController *BookmarkController) CreateBookmark(context *gin.Context, db *sql.DB) {
	bookmarkService := bookmarkController.BookmarkService

	// Declare a pointer to a new instance of a bookmark struct
	bookmark := new(models.Bookmark)

	err := context.ShouldBind(bookmark)

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
	if bookmark.ThreadID == 0 || bookmark.AuthorID == 0 {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in bookmark object",
		})
		return
	}

	responseErr := bookmarkService.CreateBookmark(bookmark)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Bookmark added to database",
	})
}

func (bookmarkController *BookmarkController) CreateUserBookmarkByThreadID(context *gin.Context, db *sql.DB) {
	bookmarkService := bookmarkController.BookmarkService
	userAuthorID := utils.GetUserAuthorID(context)
	threadID := context.Param("threadID")

	// Declare a pointer to a new instance of a bookmark struct
	bookmark := new(models.Bookmark)

	bookmark.ThreadID = utils.ConvertStringToInt(threadID, context)
	bookmark.AuthorID = userAuthorID

	// Check if the binded struct contains necessary fields
	if bookmark.ThreadID == 0 || bookmark.AuthorID == 0 {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in bookmark object",
		})
		return
	}

	responseErr := bookmarkService.CreateBookmark(bookmark)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Bookmark added to database",
	})
}

func (bookmarkController *BookmarkController) DeleteBookmarkByID(context *gin.Context, db *sql.DB) {
	bookmarkService := bookmarkController.BookmarkService
	bookmarkID := context.Param("bookmarkID")

	responseErr := bookmarkService.DeleteBookmarkByID(utils.ConvertStringToInt(bookmarkID, context))

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
		Message: "Bookmark deleted successfully",
	})
}

func (bookmarkController *BookmarkController) DeleteUserBookmarkByThreadID(context *gin.Context, db *sql.DB) {
	bookmarkService := bookmarkController.BookmarkService
	userAuthorID := utils.GetUserAuthorID(context)
	threadID := utils.ConvertStringToInt(context.Param("threadID"), context)

	responseErr := bookmarkService.DeleteBookmarkByThreadIDAuthorID(threadID, userAuthorID)

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
		Message: "Bookmark deleted successfully",
	})
}

func (bookmarkController *BookmarkController) GetBookmarkedThreadsByUser(context *gin.Context, db *sql.DB)  {
	bookmarkService := bookmarkController.BookmarkService
	userAuthorID := utils.GetUserAuthorID(context)

	bookmarkedThreads, responseErr := bookmarkService.GetBookmarkedThreadsByAuthorID(userAuthorID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   bookmarkedThreads,
	})
}
