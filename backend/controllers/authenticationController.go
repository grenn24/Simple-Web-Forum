package controllers

import (
	"database/sql"
	"fmt"
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

	jwtToken, refreshToken, responseErr := authenticationService.LogIn(logInRequest.Email, logInRequest.Password)

	if responseErr != nil && responseErr.ErrorCode == "UNAUTHORISED" {
		context.JSON(http.StatusUnauthorized, responseErr)
		return
	}

	if responseErr != nil && responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	// Send the cookies containing the newly created jwt and refresh tokens
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("refreshToken=%v; Max-Age=%v; Path=/authentication/refresh-jwt-token; Domain=%v; HttpOnly; Secure; SameSite=None", refreshToken, os.Getenv("REFRESH_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Logged in successfully!",
	})
}

// Issue authentication tokens (jwt and refresh token)
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
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("refreshToken=%v; Max-Age=%v; Path=/refresh-jwt-token; Domain=%v; HttpOnly; Secure; SameSite=None", refreshToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))

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

	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Jwt Token refreshed successfully!",
	})

}

/*
Authentication tokens need to be deleted on logout
Since the cookies storing auth tokens are set to httponly, they cannot be accessed or modified or deleted on the client-side.
Cookies can be indirectly deleted by sending over new cookies from the api with a max-age of 0
*/
func (authenticationController *AuthenticationController) LogOut(context *gin.Context, db *sql.DB) {
	jwtToken, _ := context.Cookie("jwtToken")
	refreshToken, _ := context.Cookie("refreshToken")
	// Return the expired cookies
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, 0, os.Getenv("DOMAIN_NAME")))
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("refreshToken=%v; Max-Age=%v; Path=/authentication/refresh-jwt-token; Domain=%v; HttpOnly; Secure; SameSite=None", refreshToken, 0, os.Getenv("DOMAIN_NAME")))

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Logged out successfully!",
	})
}
