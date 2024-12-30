package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/services"
	"github.com/grenn24/simple-web-forum/utils"
	"github.com/grenn24/simple-web-forum/models"
)

type AuthorController struct {
	AuthorService *services.AuthorService
}

func (authorController *AuthorController) GetAllAuthors(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService

	authors, err := authorService.GetAllAuthors()

	// Check for internal server errors
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	// Check for empty author table
	if len(authors) == 0 {
		context.JSON(http.StatusNotFound, dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No authors in the database",
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   authors,
	})
}

func (authorController *AuthorController) GetAuthorByID(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService

	authorID, _ := strconv.Atoi(context.Param("authorID"))

	author, err := authorService.GetAuthorByID(authorID)

	if err != nil {
		// Check for author not found error
		if err == sql.ErrNoRows {
			context.JSON(http.StatusNotFound, dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No author found for author id: %v", authorID),
			})
			return
		}
		// Check for internal server errors
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   author,
	})
}

func (authorController *AuthorController) GetUser(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService

	author, err := authorService.GetAuthorByID(utils.GetUserAuthorID(context))

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

	err := authorService.DeleteAllAuthors()

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
		Status:  "success",
		Message: "Deleted all authors",
	})
}

func (authorController *AuthorController) DeleteAuthorByID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	authorService := authorController.AuthorService

	responseErr := authorService.DeleteauthorByID(utils.ConvertStringToInt(authorID, context))

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
