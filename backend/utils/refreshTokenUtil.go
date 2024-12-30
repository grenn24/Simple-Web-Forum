package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"os"
	"time"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
)

func GenerateRefreshToken(userAuthorID int, expiresIn string) (string, error) {
	currentTime := time.Now()
	timeElapsed, _ := time.ParseDuration(expiresIn)

	header := gin.H{"alg": "HS256"}
	payload := gin.H{"iss": "https://simple-web-forum-backend-61723a55a3b5.herokuapp.com", "sub": userAuthorID,"role": "user", "iat": currentTime.Unix(), "exp": currentTime.Add(timeElapsed).Unix()}
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

	// Refresh Token
	refreshToken := headerEncoded + "." + payloadEncoded + "." + signatureEncoded

	return refreshToken, nil
}

func ParseRefreshTokenPayload(refreshToken string) (map[string]any, *dtos.Error) {

	refreshTokenSlice := strings.Split(refreshToken, ".")

	payloadEncoded := refreshTokenSlice[1]
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

func ValidateRefreshToken(refreshToken string) *dtos.Error {

	refreshTokenSlice := strings.Split(refreshToken, ".")

	// Incorrect token structure
	if len(refreshTokenSlice) != 3 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORIZED",
			Message:   "Invalid or expired refresh token",
		}

	}

	headerEncoded := refreshTokenSlice[0]
	payloadEncoded := refreshTokenSlice[1]
	signatureOriginalEncoded := refreshTokenSlice[2]

	// Check validity: Recreate signature using HMAC SHA-256 and encode it using base64
	secretKey := []byte(os.Getenv("SECRET_KEY"))
	hmac := hmac.New(sha256.New, secretKey)
	hmac.Write([]byte(headerEncoded + "." + payloadEncoded))
	signatureRecreated := hmac.Sum(nil)
	signatureRecreatedEncoded := base64.URLEncoding.EncodeToString(signatureRecreated)

	if signatureOriginalEncoded != signatureRecreatedEncoded {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORIZED",
			Message:   "Invalid or expired refresh token",
		}
	}

	// Check expiration time
	payload, responseErr := ParseRefreshTokenPayload(refreshToken)
	if responseErr != nil {
		return responseErr
	}
	var expirationTime int64
	val, ok := payload["exp"].(float64)
	if !ok {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORIZED",
			Message:   "Invalid or expired refresh token",
		}
	} else {
		expirationTime = int64(val)
	}
	currentTime := time.Now().Unix()
	if currentTime > expirationTime {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORIZED",
			Message:   "Invalid or expired refresh token",
		}
	}
	return nil
}

