package middlewares

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/utils"
)

func ValidateJwtToken(context *gin.Context) {

	jwtToken, err := context.Cookie("jwtToken")

	if err == http.ErrNoCookie || jwtToken == "" {
		context.JSON(http.StatusUnauthorized, dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORIZED",
			Message:   "Missing authorisation tokens",
		})
		context.Abort()
		return
	}

	

	jwtTokenSlice := strings.Split(jwtToken, ".")

	headerEncoded := jwtTokenSlice[0]
	payloadEncoded := jwtTokenSlice[1]
	signatureOriginalEncoded := jwtTokenSlice[2]

	// Check validity: Recreate signature using HMAC SHA-256 and encode it using base64
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

	// Check expiration time
	payload := utils.ParseJwtTokenPayload(context)
	var expirationTime int64
	val, ok := payload["exp"].(float64)
	if !ok {
		context.JSON(http.StatusUnauthorized, dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORIZED",
			Message:   "Invalid or expired token",
		})
		context.Abort()
		return
	} else {
		expirationTime = int64(val)
	}
	currentTime := time.Now().Unix()
	if currentTime > expirationTime {
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
