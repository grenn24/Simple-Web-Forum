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

type AuthorController struct {
	AuthorService *services.AuthorService
}

func (authorController *AuthorController) GetAllAuthors(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService

	authors, responseErr := authorService.GetAllAuthors()

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   authors,
	})
}

func (authorController *AuthorController) GetAuthorByID(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService

	authorID := utils.ConvertStringToInt(context.Param("authorID"), context)
	userAuthorID := utils.GetUserAuthorID(context)

	author, responseErr := authorService.GetAuthorByID(authorID, userAuthorID)

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
		Data:   author,
	})
}

func (authorController *AuthorController) GetUser(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService
	userAuthorID := utils.GetUserAuthorID(context)

	author, responseErr := authorService.GetAuthorByID(userAuthorID, userAuthorID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   author,
	})
}

func (authorController *AuthorController) CreateAuthor(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService

	// Declare a pointer to a new instance of an author struct
	author := new(models.Author)

	err := context.ShouldBind(author)

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
	if author.Email == "" || author.Name == "" || author.PasswordHash == "" || author.Username == "" {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required fields in author object",
		})
		return
	}

	responseErr := authorService.CreateAuthor(author)

	// Check for existing authors with same credentials
	if responseErr != nil {
		if responseErr.ErrorCode != "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusBadRequest, responseErr)
		} else {
			context.JSON(http.StatusInternalServerError, responseErr)
		}
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Author created successfully!",
	})
}

func (authorController *AuthorController) DeleteAllAuthors(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService

	responseErr := authorService.DeleteAllAuthors()

	// Check for internal server errors
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Deleted all authors",
	})
}

func (authorController *AuthorController) DeleteAuthorByID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	authorService := authorController.AuthorService

	responseErr := authorService.DeleteAuthorByID(utils.ConvertStringToInt(authorID, context))

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
		Message: "author deleted successfully",
	})
}
