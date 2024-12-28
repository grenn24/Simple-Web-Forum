package utils

import (
	"github.com/gin-gonic/gin"
)

func GetUserAuthorID(context *gin.Context) int {
	payload := ParseJwtTokenPayload(context)

	authorID := payload["sub"]

	var authorIDInt int
	// Convert authorID to int
	if val, ok := authorID.(float64); ok {
		authorIDInt = int(val)
	}

	return authorIDInt
}
