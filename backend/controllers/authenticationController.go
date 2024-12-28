package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/services"
)


type AuthenticationController struct {
	AuthenticationService *services.AuthenticationService
}

type LogInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignUpRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (authenticationController *AuthenticationController) LogIn(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService

	// Declare a pointer to a new instance of a log-in request struct
	logInRequest := new(LogInRequest)

	err := context.ShouldBind(logInRequest)

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
	if logInRequest.Password == "" || logInRequest.Email == "" {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required log-in fields",
		})
		return
	}

	jwtToken, responseErr := authenticationService.LogIn(logInRequest.Email, logInRequest.Password)

	if responseErr != nil && responseErr.ErrorCode == "UNAUTHORISED" {
		context.JSON(http.StatusUnauthorized, responseErr)
		return
	}

	if responseErr != nil && responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	// Return the newly created jwt token in http response header
	context.Header("Authorization", "Bearer "+jwtToken)

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Logged in successfully!",
	})
}

func (authenticationController *AuthenticationController) SignUp(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService

	// Declare a pointer to a new instance of a sign-up request struct
	signUpRequest := new(SignUpRequest)

	err := context.ShouldBind(signUpRequest)

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
	if signUpRequest.Name == "" || signUpRequest.Email == "" || signUpRequest.Password == "" || signUpRequest.Username == "" {
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REQUIRED_FIELDS",
			Message:   "Missing required sign-up fields",
		})
		return
	}

	jwtToken, responseErr := authenticationService.SignUp(signUpRequest.Name, signUpRequest.Username, signUpRequest.Email, signUpRequest.Password)

	// Check for existing authors with same credentials
	if responseErr != nil {
		if responseErr.ErrorCode != "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusBadRequest, responseErr)
		} else {
			context.JSON(http.StatusInternalServerError, responseErr)
		}
		return
	}

	// Return the newly created jwt token in http response header
	context.Header("Authorization", "Bearer "+jwtToken)

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Author created successfully!",
	})
}
