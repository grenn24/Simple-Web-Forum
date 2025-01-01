package controllers

import (
	"database/sql"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/services"
	"github.com/grenn24/simple-web-forum/utils"
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

	// Return the newly created jwt token in a cookie
	context.Writer.Header().Add("Set-Cookie", "jwtToken="+jwtToken+"; Max-Age="+os.Getenv("JWT_TOKEN_MAX_AGE")+"; Path=/; HttpOnly; Secure; SameSite=None")

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

	jwtToken, refreshToken, responseErr := authenticationService.SignUp(signUpRequest.Name, signUpRequest.Username, signUpRequest.Email, signUpRequest.Password)

	// Check for existing authors with same credentials
	if responseErr != nil {
		if responseErr.ErrorCode != "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusBadRequest, responseErr)
		} else {
			context.JSON(http.StatusInternalServerError, responseErr)
		}
		return
	}

	// Return the newly created jwt token and refresh token in http response header as cookies
	context.Writer.Header().Add("Set-Cookie", "jwtToken="+jwtToken+"; Max-Age="+os.Getenv("JWT_TOKEN_MAX_AGE")+"; Path=/; HttpOnly; Secure; SameSite=None")
	context.Writer.Header().Add("Set-Cookie", "refreshToken="+refreshToken+"; Max-Age="+os.Getenv("REFRESH_TOKEN_MAX_AGE")+"; Path=/; HttpOnly; Secure; SameSite=None")

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Author created successfully!",
	})
}

func (authenticationController *AuthenticationController) RefreshJwtToken(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService
	refreshToken, err := context.Cookie("refreshToken")

	// Missing refresh token in cookie headers
	if err == http.ErrNoCookie || refreshToken == "" {
		context.JSON(http.StatusUnauthorized, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_REFRESH_TOKEN",
			Message:   "Missing refresh token",
		})
		return
	}

	// Validate refresh token
	responseErr := utils.ValidateRefreshToken(refreshToken)
	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		} else {
			context.JSON(http.StatusUnauthorized, responseErr)
			return
		}
	}

	// Get user author id from refresh token
	payload, responseErr := utils.ParseRefreshTokenPayload(refreshToken)
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}
	userAuthorID := payload["sub"]
	var userAuthorIDInt int
	// Convert author id from float64 to int
	if val, ok := userAuthorID.(float64); ok {
		userAuthorIDInt = int(val)
	}

	// Generate a new jwt token
	jwtToken, responseErr := authenticationService.GenerateJwtToken(userAuthorIDInt)
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.Writer.Header().Add("Set-Cookie", "jwtToken="+jwtToken+"; Max-Age="+os.Getenv("JWT_TOKEN_MAX_AGE")+"; Path=/; HttpOnly; Secure; SameSite=None")

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Jwt Token refreshed successfully!",
	})

}
