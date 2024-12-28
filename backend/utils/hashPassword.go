package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
)

func HashPassword(password string) (string) {
	// Create Hashed Password using HMAC SHA-256
	secretKey := []byte("my secret key")
	hmac := hmac.New(sha256.New, secretKey)
	hmac.Write([]byte(password))
	passwordHash := hmac.Sum(nil)

	return base64.StdEncoding.EncodeToString(passwordHash)
}