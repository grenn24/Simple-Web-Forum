package utils

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
)

func ConvertStringToInt(value string, context *gin.Context) int {
	valueConverted, err := strconv.Atoi(value)
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		context.Abort()
		return 0
	}
	return valueConverted
}

func ConvertIntToString(value int) string {
	valueConverted := strconv.Itoa(value)
	return valueConverted
}

func TruncateString(content string, wordLimit int) string {
	// Split content into words
	words := strings.Fields(content)

	// If there are more words than the limit, truncate and add "..."
	if len(words) > wordLimit {
		return strings.Join(words[:wordLimit], " ") + "..."
	}
	return content
}
