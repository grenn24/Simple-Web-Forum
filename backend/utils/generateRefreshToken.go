package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func GenerateRefreshToken(expiresIn string) (string, error) {
	currentTime := time.Now()
	timeElapsed, _ := time.ParseDuration(expiresIn)

	header := gin.H{"alg": "HS256"}
	payload := gin.H{"iss": "https://simple-web-forum-backend-61723a55a3b5.herokuapp.com", "role": "user", "iat": currentTime.Unix(), "exp": currentTime.Add(timeElapsed).Unix()}
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

	// JWT Token Response
	jwtToken := headerEncoded + "." + payloadEncoded + "." + signatureEncoded

	return jwtToken, nil
}
