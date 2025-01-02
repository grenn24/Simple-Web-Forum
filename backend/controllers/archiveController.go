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

type ArchiveController struct {
	ArchiveService *services.ArchiveService
}

func (archiveController *ArchiveController) CreateUserArchiveByThreadID(context *gin.Context, db *sql.DB) {
	archiveService := archiveController.ArchiveService
	userAuthorID := utils.GetUserAuthorID(context)
	threadID := context.Param("threadID")

	// Declare a pointer to a new instance of a narchive struct
	archive := new(models.Archive)
	archive.ThreadID = utils.ConvertStringToInt(threadID, context)
	archive.AuthorID = userAuthorID

	// Check if the binded struct contains necessary fields
	if archive.ThreadID == 0 || archive.AuthorID == 0 {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in archive object",
		})
		return
	}

	responseErr := archiveService.CreateArchive(archive)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Thread archived successfully!",
	})
}

func (archiveController *ArchiveController) GetArchivedThreadsByUser(context *gin.Context, db *sql.DB) {
	archiveService := archiveController.ArchiveService

	userAuthorID := utils.GetUserAuthorID(context)

	archivedThreads, responseErr := archiveService.GetArchivedThreadsByAuthorID(userAuthorID)

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   archivedThreads,
	})
}

func (archiveController *ArchiveController) GetArchivedThreadsByAuthorID(context *gin.Context, db *sql.DB) {
	archiveService := archiveController.ArchiveService

	authorID := utils.ConvertStringToInt(context.Param("authorID"), context)

	archivedThreads, responseErr := archiveService.GetArchivedThreadsByAuthorID(authorID)

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   archivedThreads,
	})
}


func (archiveController *ArchiveController) DeleteArchiveByID(context *gin.Context, db *sql.DB) {
	archiveService := archiveController.ArchiveService
	archiveID := context.Param("archiveID")

	responseErr := archiveService.DeleteArchiveByID(utils.ConvertStringToInt(archiveID, context))

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
		Message: "Thread removed from archive successfully!",
	})
}

func (archiveController *ArchiveController) DeleteUserArchiveByThreadID(context *gin.Context, db *sql.DB) {
	archiveService := archiveController.ArchiveService
	userAuthorID := utils.GetUserAuthorID(context)
	threadID := utils.ConvertStringToInt(context.Param("threadID"), context)

	responseErr := archiveService.DeleteArchiveByThreadIDAuthorID(threadID, userAuthorID)

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
		Message: "Thread removed from archive successfully!",
	})
}
