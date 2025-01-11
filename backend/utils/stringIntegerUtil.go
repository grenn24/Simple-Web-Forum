package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
)

func ConvertStringToInt(value string, context *gin.Context) int {
	if value == "" {
		return 0
	}
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

// Converts a javascript date object represented as string into time.Time
func DateStringToTime(dateString string) time.Time {
	format := "Mon Jan 2 2006 15:04:05 GMT-0700"
	timeString := strings.Split(dateString, " (")[0]
	time, _ := time.Parse(format, timeString)
	return time
}

// Hash a raw password using hmac
func HashPassword(password string) (string) {
	// Create Hashed Password using HMAC SHA-256
	secretKey := []byte("my secret key")
	hmac := hmac.New(sha256.New, secretKey)
	hmac.Write([]byte(password))
	passwordHash := hmac.Sum(nil)

	return base64.StdEncoding.EncodeToString(passwordHash)
}

