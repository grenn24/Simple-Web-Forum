package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/services"
)

type AuthenticationController struct {
	AuthenticationService *services.AuthenticationService
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (authenticationController *AuthenticationController) LogIn(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService

	// Declare a pointer to a new instance of a login request struct
	loginRequest := new(LoginRequest)

	err := context.ShouldBind(loginRequest)

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
	if loginRequest.Password == "" || loginRequest.Email == "" {
		context.JSON(http.StatusBadRequest, models.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required log-in fields",
		})
		return
	}

	status, author_id, responseErr := authenticationService.LogIn(loginRequest.Email, loginRequest.Password)

	if !status {
		context.JSON(http.StatusUnauthorized, responseErr)
		return
	} 

	context.JSON(http.StatusOK, models.Success{
		Status:  "success",
		Message: "Logged in successfully!",
		Data: gin.H{
			"author_id": author_id,
		},
	})
}
