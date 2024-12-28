package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
)

func GenerateJwtToken(header map[string]any, payload map[string]any) (string, error) {
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
	secretKey := []byte("my secret key")
	hmac := hmac.New(sha256.New, secretKey)
	hmac.Write([]byte(headerEncoded + "." + payloadEncoded))
	signature := hmac.Sum(nil)
	signatureEncoded := base64.URLEncoding.EncodeToString(signature)

	// JWT Token Response
	jwtToken := headerEncoded + "." + payloadEncoded + "." + signatureEncoded

	return jwtToken, nil
}