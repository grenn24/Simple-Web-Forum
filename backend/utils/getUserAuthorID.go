package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUserAuthorID(context *gin.Context) int {
	payload, responseErr := ParseJwtTokenPayload(RetrieveJwtToken(context))

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
	}

	authorID := payload["sub"]

	var authorIDInt int
	// Convert authorID to int
	if val, ok := authorID.(float64); ok {
		authorIDInt = int(val)
	}

	return authorIDInt
}
