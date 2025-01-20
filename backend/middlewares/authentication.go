package middlewares

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/utils"
)

// For protected routes, validate jwt tokens. If the jwt tokens are expired, validate the refresh tokens and return the new jwt tokens
func Authenticate(context *gin.Context) {

	jwtToken, _ := context.Cookie("jwtToken")
	refreshToken, _ := context.Cookie("refreshToken")

	// Missing both jwt and refresh token in cookie headers
	if jwtToken == "" && refreshToken == "" {
		context.JSON(http.StatusUnauthorized, dtos.Error{
			Status:    "error",
			ErrorCode: "MISSING_TOKENS",
			Message:   "Missing jwt and refresh token in cookies",
		})
		context.Abort()
		return
	}

	// If jwt tokens are missing, validate the refresh tokens
	if jwtToken == "" {
		responseErr := utils.ValidateRefreshToken(refreshToken)
		if responseErr != nil {
			if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
				context.JSON(http.StatusInternalServerError, responseErr)
				context.Abort()
				return
			}
			context.JSON(http.StatusUnauthorized, responseErr)
			context.Abort()
			return
		}
		//After the refresh token is validated successfully, return the new jwt tokens as cookies
		jwtToken, _ = utils.RefreshJwtToken(refreshToken)
		context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "TOKEN_REFRESHED",
			Message:   "The existing jwt token is invalid/expired, please make another request with the new jwt tokens returned",
		})
		context.Abort()
		return
	}

	// If jwt token is present, validate it
	responseErr := utils.ValidateJwtToken(jwtToken)

	if responseErr != nil {
		if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
			context.JSON(http.StatusInternalServerError, responseErr)
			context.Abort()
			return
		}

		// If jwt token is invalid, check if the refresh token exists and validate the refresh token
		if refreshToken == "" {
			context.JSON(http.StatusUnauthorized, responseErr)
			context.Abort()
			return
		}
		responseErr = utils.ValidateRefreshToken(refreshToken)
		if responseErr != nil {
			if responseErr.ErrorCode == "INTERNAL_SERVER_ERROR" {
				context.JSON(http.StatusInternalServerError, responseErr)
				context.Abort()
				return
			}
			context.JSON(http.StatusUnauthorized, responseErr)
			context.Abort()
			return
		}
		//If refresh token is validated, add the new jwt tokens as cookies to be returned
		jwtToken, _ = utils.RefreshJwtToken(refreshToken)
		context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("jwtToken=%v; Max-Age=%v; Path=/api; Domain=%v; HttpOnly; Secure; SameSite=None", jwtToken, os.Getenv("JWT_TOKEN_MAX_AGE"), os.Getenv("DOMAIN_NAME")))
		context.JSON(http.StatusBadRequest, dtos.Error{
			Status:    "error",
			ErrorCode: "TOKEN_REFRESHED",
			Message:   "The existing jwt token is invalid/expired, please make another request with the new jwt tokens returned",
		})
		context.Abort()
		return
	}

	// Delegate request to next controller handler
	context.Next()
}
