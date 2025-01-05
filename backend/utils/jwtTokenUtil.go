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

func GenerateJwtToken(userAuthorID int, expiresIn string, role string) (string, error) {
	currentTime := time.Now()
	timeElapsed, _ := time.ParseDuration(expiresIn)

	header := gin.H{"alg": "HS256"}
	payload := gin.H{"iss": "https://simple-web-forum-backend-61723a55a3b5.herokuapp.com", "sub": userAuthorID, "role": role, "iat": currentTime.Unix(), "exp": currentTime.Add(timeElapsed).Unix()}
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

// Structure of jwt token must be validated first
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
			ErrorCode: "MISSING_TOKENS",
			Message:   "Missing jwt token in cookies",
		})
		context.Abort()
		return ""
	}
	return jwtToken
}


// Generate a new jwt token using existing refresh token payload (refresh token must be present and validated first)
func RefreshJwtToken(refreshToken string) (string, *dtos.Error) {
	// Get user author id from refresh token
	payload, responseErr := ParseRefreshTokenPayload(refreshToken)
	if responseErr != nil {
		return "", responseErr
	}
	userAuthorID := payload["sub"]
	var userAuthorIDInt int
	// Convert author id from float64 to int
	if val, ok := userAuthorID.(float64); ok {
		userAuthorIDInt = int(val)
	}

	// Generate a new jwt token
	jwtToken, err := GenerateJwtToken(userAuthorIDInt, os.Getenv("JWT_TOKEN_MAX_AGE")+"s", "user")
	if err != nil {
		return "", &dtos.Error {
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return jwtToken, nil
}

// Checks for structure, signature and expiry date of jwt token
func ValidateJwtToken(jwtToken string) *dtos.Error {

	jwtTokenSlice := strings.Split(jwtToken, ".")

	// Check for jwt token structure
	if len(jwtTokenSlice) != 3 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INVALID_TOKEN",
			Message:   "Invalid or expired jwt token",
		}
	}

	headerEncoded := jwtTokenSlice[0]
	payloadEncoded := jwtTokenSlice[1]
	signatureOriginalEncoded := jwtTokenSlice[2]

	// Check for validity: By recreating signature using HMAC SHA-256 and encode it using base64
	secretKey := []byte(os.Getenv("SECRET_KEY"))
	hmac := hmac.New(sha256.New, secretKey)
	hmac.Write([]byte(headerEncoded + "." + payloadEncoded))
	signatureRecreated := hmac.Sum(nil)
	signatureRecreatedEncoded := base64.URLEncoding.EncodeToString(signatureRecreated)

	if signatureOriginalEncoded != signatureRecreatedEncoded {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INVALID_TOKEN",
			Message:   "Invalid or expired jwt token",
		}
	}

	// Check for expiration time
	payload, _ := ParseJwtTokenPayload(jwtToken)
	var expirationTime int64
	val, ok := payload["exp"].(float64)
	if !ok {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INVALID_TOKEN",
			Message:   "Invalid or expired jwt token",
		}
	} else {
		expirationTime = int64(val)
	}
	currentTime := time.Now().Unix()
	if currentTime > expirationTime {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INVALID_TOKEN",
			Message:   "Invalid or expired jwt token",
		}
	}
	return nil
}