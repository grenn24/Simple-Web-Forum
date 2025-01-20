package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/services"
	"github.com/grenn24/simple-web-forum/utils"
)

type AuthenticationController struct {
	AuthenticationService *services.AuthenticationService
}

// Handle OAuth requests, for both login and sign-up
func (authenticationController *AuthenticationController) OAuth(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService
	var jwtToken string
	var refreshToken string
	var responseErr *dtos.Error
	provider := context.Query("provider")
	if provider == "google" {
		authorisationHeader := context.GetHeader("Authorization")
		accessToken := strings.Split(authorisationHeader, " ")[1]
		jwtToken, refreshToken, responseErr = authenticationService.GoogleOAuth(accessToken)
		if responseErr != nil {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
	}
	if provider == "github" {
		resBody := make(map[string]string)
		err := context.ShouldBind(&resBody)
		// Check for JSON binding errors
		if err != nil {
			context.JSON(http.StatusInternalServerError, dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			})
			return
		}
		authCode := resBody["authorisationCode"]
	
		jwtToken, refreshToken, responseErr = authenticationService.GitHubOAuth(authCode)
		if responseErr != nil {
			context.JSON(http.StatusInternalServerError, responseErr)
			return
		}
	}
	// Send the cookies containing the newly created jwt and refresh tokens
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("refreshToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", refreshToken, os.Getenv("REFRESH_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "Authenticated successfully!",
	})
}

// Issue authentication tokens (jwt and refresh token)
func (authenticationController *AuthenticationController) LogIn(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService

	// Declare a pointer to a new instance of a log-in request struct
	logInRequest := new(dtos.LogInRequest)

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

// Check availability of name, username, email before sign up
func (authenticationController *AuthenticationController) SignUpCheckAvailability(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService

	// Declare a pointer to a new instance of a sign-up request struct
	signUpRequest := new(dtos.SignUpRequest)

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

	responseErr := authenticationService.SignUpCheckAvailability(signUpRequest.Name, signUpRequest.Username, signUpRequest.Email, signUpRequest.Password)

	// Check for existing authors with same credentials
	if responseErr != nil {
		if responseErr.ErrorCode != "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusBadRequest, responseErr)
		} else {
			context.JSON(http.StatusInternalServerError, responseErr)
		}
		return
	}

	context.JSON(http.StatusOK, dtos.Success{
		Status:  "success",
		Message: "You're ready to create an account!",
	})
}

// Issue authentication tokens (jwt and refresh token)
func (authenticationController *AuthenticationController) SignUp(context *gin.Context, db *sql.DB) {
	authenticationService := authenticationController.AuthenticationService

	// Declare a pointer to a new instance of a sign-up request struct
	signUpRequest := new(dtos.SignUpRequest)
	signUpRequest.Name = context.PostForm("name")
	signUpRequest.Username = context.PostForm("username")
	signUpRequest.Password = context.PostForm("password")
	signUpRequest.Email = context.PostForm("email")
	signUpRequest.Biography = context.PostForm("biography")

	// Convert empty strings to nil
	if faculty := context.PostForm("faculty"); faculty == "" {
		signUpRequest.Faculty = nil
	} else {
		signUpRequest.Faculty = &faculty
	}
	if birthday := context.PostForm("birthday"); birthday == "" {
		signUpRequest.Birthday = nil
	} else {
		birthday := utils.ParseDateString(context.PostForm("birthday"))
		signUpRequest.Birthday = &birthday
	}
	if gender := context.PostForm("gender"); gender == "" {
		signUpRequest.Gender = nil
	} else {
		gender := context.PostForm("gender")
		signUpRequest.Gender = &gender
	}
	// Check if avatar icon was uploaded
	if avatarIcon, err := context.FormFile("avatar_icon"); err != nil {
		// Check for internal server errors / no file uploaded error
		if err.Error() != "http: no such file" {
			context.JSON(http.StatusInternalServerError, dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			})
			return
		}
		avatarIcon = nil
	} else {
		signUpRequest.AvatarIcon = avatarIcon
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

	jwtToken, refreshToken, responseErr := authenticationService.SignUp(signUpRequest)

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
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("refreshToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", refreshToken, os.Getenv("REFRESH_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))

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

	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))

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
			context.JSON(http.StatusBadRequest, dtos.Error{
			Status:  "error",
			ErrorCode: "TOKEN_REFRESHED",
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
			context.JSON(http.StatusBadRequest, dtos.Error{
			Status:  "error",
			ErrorCode: "TOKEN_REFRESHED",
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
