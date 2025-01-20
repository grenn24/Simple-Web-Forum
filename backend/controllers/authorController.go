package controllers

import (
	"database/sql"
	"fmt"
	_ "fmt"
	"net/http"
	"strings"

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

func (authorController *AuthorController) GetUserAvatarIconLink(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService
	userAuthorID := utils.GetUserAuthorID(context)
	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   authorService.GetAvatarIconLinkByAuthorID(userAuthorID),
	})
}

func (authorController *AuthorController) GetAuthorActivityByAuthorID(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService
	authorID := utils.ConvertStringToInt(context.Param("authorID"), context)
	authorActivities, responseErr := authorService.GetAuthorActivityByAuthorID(authorID)
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}
	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   authorActivities,
	})
}

func (authorController *AuthorController) SearchAuthors(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService
	userAuthorID := utils.GetUserAuthorID(context)
	query := context.Query("query")
	page := utils.ConvertStringToInt(context.Query("page"), context)
	limit := utils.ConvertStringToInt(context.Query("limit"), context)
	sortIndex := utils.ConvertStringToInt(context.Query("sort"), context)

	authors, responseErr := authorService.SearchAuthors(userAuthorID, query, page, limit, sortIndex)
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}
	context.JSON(http.StatusOK, dtos.Success{
		Status: "success",
		Data:   authors,
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

	if responseErr != nil {
		if responseErr.ErrorCode != "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		// Check for duplicate fields
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusCreated, dtos.Success{
		Status:  "success",
		Message: "Author created successfully!",
	})
}

// Can update avatar icon link
func (authorController *AuthorController) UpdateUser(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService
	userAuthorID := utils.GetUserAuthorID(context)
	contentType := context.GetHeader("Content-Type")
	// Declare a pointer to a new instance of an author dto
	author := new(dtos.AuthorDTO)
	if strings.Split(contentType, ";")[0] == "multipart/form-data" {
		author.Name = context.PostForm("name")
		author.Username = context.PostForm("username")
		// If email is not provided, set email to nil
		email, exists := context.GetPostForm("email")
		if exists {
			author.Email = &email
		} else {
			author.Email = nil
		}

		// If biography is not provided, set biography to nil
		biography, exists := context.GetPostForm("biography")
		if exists {
			author.Biography = &biography
		} else {
			author.Biography = nil
		}

		// If faculty is not provided, set faculty to nil
		faculty, exists := context.GetPostForm("faculty")
		if exists {
			author.Faculty = &faculty
		} else {
			author.Faculty = nil
		}

		// If birthday is not provided, set biography to nil
		birthday, exists := context.GetPostForm("birthday")
		if exists {
			fmt.Println(birthday)
			birthday := utils.ParseDateString(birthday)
			author.Birthday = &birthday
		} else {
			author.Birthday = nil
		}

		// Check if avatar icon is provided (formfile returns err if not provided)
		avatarIcon, err := context.FormFile("avatar_icon")
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
			author.AvatarIcon = nil
		} else {
			author.AvatarIcon = avatarIcon
		}
	}

	responseErr := authorService.UpdateAuthor(author, userAuthorID)

	if responseErr != nil {
		if responseErr.ErrorCode != "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		// Check for duplicate fields
		context.JSON(http.StatusBadRequest, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Updated author info successfully!",
	})
}

// Can update avatar icon link (but wont delete it if its undefined)
func (authorController *AuthorController) UpdateAuthor(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService
	authorID := utils.ConvertStringToInt(context.Param("authorID"), context)
	contentType := context.GetHeader("Content-Type")
	// Declare a pointer to a new instance of an author dto
	author := new(dtos.AuthorDTO)

	if strings.Split(contentType, ";")[0] == "multipart/form-data" {
		author.Name = context.PostForm("name")
		author.Username = context.PostForm("username")
		// If email is not provided, set email to nil
		email, exists := context.GetPostForm("email")
		if exists {
			author.Email = &email
		} else {
			author.Email = nil
		}

		// If biography is not provided, set biography to nil
		biography, exists := context.GetPostForm("biography")
		if exists {
			author.Biography = &biography
		} else {
			author.Biography = nil
		}

		// If faculty is not provided, set faculty to nil
		faculty, exists := context.GetPostForm("faculty")
		if exists {
			author.Faculty = &faculty
		} else {
			author.Faculty = nil
		}

		// If birthday is not provided, set birthday to nil
		birthday, exists := context.GetPostForm("birthday")
		if exists {
			birthday := utils.ParseDateString(birthday)
			author.Birthday = &birthday
		} else {
			author.Birthday = nil
		}

		// If gender is not provided, set gender to nil
		gender, exists := context.GetPostForm("gender")
		if exists {
			author.Gender = &gender
		} else {
			author.Gender = nil
		}

		// Check if avatar icon is provided (formfile returns err if not provided)
		avatarIcon, err := context.FormFile("avatar_icon")
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
			author.AvatarIcon = nil
		} else {
			author.AvatarIcon = avatarIcon
		}
	}

	responseErr := authorService.UpdateAuthor(author, authorID)
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
		Message: "Updated author info successfully!",
	})
}

// Handles a http form data request and updates only the avatar icon link of user
func (authorController *AuthorController) UpdateUserAvatarIconLink(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService
	userAuthorID := utils.GetUserAuthorID(context)

	avatarIcon, err := context.FormFile("avatar_icon")

	if err != nil {
		if err.Error() != "http: no such file" {
			context.JSON(http.StatusInternalServerError, dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			})
			return
		}
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "No image file was uploaded",
		})
		return
	}

	responseErr := authorService.UpdateAuthorAvatarIconLink(avatarIcon, userAuthorID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Updated author avatar icon successfully!",
	})
}

func (authorController *AuthorController) DeleteUserAvatarIconLink(context *gin.Context, db *sql.DB) {
	authorService := authorController.AuthorService
	userAuthorID := utils.GetUserAuthorID(context)

	responseErr := authorService.DeleteAuthorAvatarIconLink(userAuthorID)

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Delete author avatar icon successfully!",
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
