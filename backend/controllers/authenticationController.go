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

// Issue authentication tokens (jwt and refresh token)
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
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("refreshToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", refreshToken, os.Getenv("REFRESH_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))

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
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=Strict", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("refreshToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=Strict", refreshToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Author created successfully!",
	})
}

// Issues new jwt tokens after validating refresh tokens
func (authenticationController *AuthenticationController) RefreshJwtToken(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService
	refreshToken, err := context.Cookie("refreshToken")

	// Missing refresh token in cookie headers
	if err == http.ErrNoCookie || refreshToken == "" {
		context.JSON(http.StatusUnauthorized, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_TOKENS",
			Message:   "Missing refresh token in cookies",
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

	// Generate a new jwt token
	jwtToken, responseErr := authenticationService.RefreshJwtToken(refreshToken)
	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
		return
	}

	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=Strict", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Jwt Token refreshed successfully!",
	})

}

// Sends over new jwt and refresh tokens with max age of 0 (for deletion)
func (authenticationController *AuthenticationController) LogOut(context *gin.Context, db *sql.DB) {
	jwtToken, _ := context.Cookie("jwtToken")
	refreshToken, _ := context.Cookie("refreshToken")
	// Return the expired cookies with max age of 0
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, 0, os.Getenv("DOMAIN_NAME")))
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("refreshToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", refreshToken, 0, os.Getenv("DOMAIN_NAME")))

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Logged out successfully!",
	})
}

// Validate jwt tokens (if they are expired, validate the refresh tokens and return new jwt tokens)
func (authenticationController *AuthenticationController) ValidateJwtToken(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService
	jwtToken, _ := context.Cookie("jwtToken")
	refreshToken, _ := context.Cookie("refreshToken")

	// Both jwt and refresh tokens not present in cookies
	if jwtToken == "" && refreshToken == "" {
		context.JSON(http.StatusUnauthorized, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_TOKENS",
			Message:   "Missing jwt and refresh token in cookies",
		})
		return
	}

	// If jwt tokens are missing, validate the refresh tokens
	if jwtToken == "" {
		responseErr := authenticationService.ValidateRefreshToken(refreshToken)
		// Refresh token invalid / internal server error
		if responseErr != nil {
			if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
				context.JSON(http.StatusInternalServerError, responseErr)
				return
			}
			context.JSON(http.StatusUnauthorized, responseErr)
			return
		}
		// Refresh token valid, create new jwt tokens and return back to client
		jwtToken, _ = utils.RefreshJwtToken(refreshToken)
		context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
		context.JSON(http.StatusOK, dtos.Success{
			Status:  "success",
			Message: "The existing jwt token is invalid/expired, please make another request with the new jwt tokens returned",
		})
		return
	}

	// If jwt token is present, validate it
	responseErr := authenticationService.ValidateJwtToken(jwtToken)
	// Jwt token invalid / internal server error
	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}

		responseErr := authenticationService.ValidateRefreshToken(refreshToken)
		// Refresh token invalid / internal server error
		if responseErr != nil {
			if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
				context.JSON(http.StatusInternalServerError, responseErr)
				return
			}
			context.JSON(http.StatusUnauthorized, responseErr)
			return
		}
		// Refresh token valid, create new jwt tokens and return back to client
		jwtToken, responseErr := authenticationService.RefreshJwtToken(refreshToken)
		if responseErr != nil {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
		context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
		context.JSON(http.StatusOK, dtos.Success{
			Status:  "success",
			Message: "The existing jwt token is invalid/expired, please make another request with the new jwt tokens returned",
		})
		return
	}

	// Jwt token is present and validated
	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Jwt token validated successfully!",
	})
}
