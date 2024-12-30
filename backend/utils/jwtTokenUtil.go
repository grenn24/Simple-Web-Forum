package utils

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strings"
	"time"
	"os"
	"crypto/hmac"
	"crypto/sha256"

	"github.com/gin-gonic/gin"

	"github.com/grenn24/simple-web-forum/dtos"
)

func GenerateJwtToken(userAuthorID int, expiresIn string) (string, error) {
	currentTime := time.Now()
	timeElapsed, _ := time.ParseDuration(expiresIn)

	header := gin.H{"alg": "HS256"}
	payload := gin.H{"iss": "https://simple-web-forum-backend-61723a55a3b5.herokuapp.com", "sub": userAuthorID, "role": "user", "iat": currentTime.Unix(), "exp": currentTime.Add(timeElapsed).Unix()}
	// Convert Headers and Payload into JSON
	headerJSON, err1 := json.Marshal(header)
	if err1 != nil {
		return "", err1
	}
	payloadJSON, err2 := json.Marshal(payload)
	if err2 != nil {
		return "", err1
	}

	// Encode Headers and Payload using base64
	headerEncoded := base64.URLEncoding.EncodeToString(headerJSON)
	payloadEncoded := base64.URLEncoding.EncodeToString(payloadJSON)

	// Create Signature using HMAC SHA-256 and encode it using base64
	secretKey := []byte(os.Getenv("SECRET_KEY"))
	hmac := hmac.New(sha256.New, secretKey)
	hmac.Write([]byte(headerEncoded + "." + payloadEncoded))
	signature := hmac.Sum(nil)
	signatureEncoded := base64.URLEncoding.EncodeToString(signature)

	// JWT Token
	jwtToken := headerEncoded + "." + payloadEncoded + "." + signatureEncoded

	return jwtToken, nil
}

func ParseJwtTokenPayload(jwtToken string) (map[string]any, *dtos.Error) {


	jwtTokenSlice := strings.Split(jwtToken, ".")

	payloadEncoded := jwtTokenSlice[1]
	payloadDecoded, err := (base64.URLEncoding.DecodeString(payloadEncoded))

	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	var payload map[string]any
	err = json.Unmarshal(payloadDecoded, &payload)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return payload, nil
}

func RetrieveJwtToken(context *gin.Context) (string) {
	jwtToken, err := context.Cookie("jwtToken")

	// Missing jwt token in cookie headers
	if err == http.ErrNoCookie || jwtToken == "" {
		context.JSON(http.StatusUnauthorized, dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORIZED",
			Message:   "Missing jwt token",
		})
		context.Abort()
		return ""
	}
	return jwtToken
}

