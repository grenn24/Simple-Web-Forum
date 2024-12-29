package middlewares

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"net/http"
	"strings"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
)


func ValidateJwtToken(context *gin.Context) {
	authorisationHeader := context.GetHeader("Authorization")

	if authorisationHeader == "" {
		context.JSON(http.StatusUnauthorized, dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORIZED",
			Message:   "Authorisation header missing",
		})
		context.Abort()
		return
	}

	jwtToken := strings.TrimPrefix(authorisationHeader, "Bearer ")
	jwtTokenSlice := strings.Split(jwtToken, ".")

	headerEncoded := jwtTokenSlice[0]
	payloadEncoded := jwtTokenSlice[1]
	signatureOriginalEncoded := jwtTokenSlice[2]

	// Recreate signature using HMAC SHA-256 and encode it using base64
	secretKey := []byte(os.Getenv("SECRET_KEY"))
	hmac := hmac.New(sha256.New, secretKey)
	hmac.Write([]byte(headerEncoded + "." + payloadEncoded))
	signatureRecreated := hmac.Sum(nil)
	signatureRecreatedEncoded := base64.URLEncoding.EncodeToString(signatureRecreated)

	if signatureOriginalEncoded != signatureRecreatedEncoded {
		context.JSON(http.StatusUnauthorized, dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORIZED",
			Message:   "Invalid or expired token",
		})
		context.Abort()
		return
	}

	// Delegate request to next controller handler
	context.Next()
}
