package services

import (
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"os"
	"strings"
	"time"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type AuthenticationService struct {
	DB *sql.DB
}

func (authenticationService *AuthenticationService) LogIn(email string, password string) (string, string, *dtos.Error) {
	authorRepository := &repositories.AuthorRepository{DB: authenticationService.DB}

	// Check if author with that email exists
	authorFromEmail := authorRepository.GetAuthorByEmail(email)
	if authorFromEmail == nil {
		return "", "", &dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORISED",
			Message:   "Invalid email or password",
		}
	}

	// Check if password is correct for that author
	passwordHash := utils.HashPassword(password)
	authorFromPassword := authorRepository.GetAuthorByPasswordHash(passwordHash)
	if authorFromPassword == nil || authorFromEmail.AuthorID != authorFromPassword.AuthorID {
		return "", "", &dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORISED",
			Message:   "Invalid email or password",
		}
	}
	// If credentials are correct, generate new jwt token and refresh token
	userAuthorID := authorFromPassword.AuthorID
	jwtToken, err := utils.GenerateJwtToken(userAuthorID, os.Getenv("JWT_TOKEN_MAX_AGE")+"s", "user")
	if err != nil {
		return "", "", &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   "Error generating jwt token",
		}
	}
	refreshToken, err := utils.GenerateRefreshToken(userAuthorID, os.Getenv("REFRESH_TOKEN_MAX_AGE")+"s", "user")
	if err != nil {
		return "", "", &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   "Error generating refresh token",
		}
	}

	return jwtToken, refreshToken, nil
}

func (authenticationService *AuthenticationService) SignUp(name string, username string, email string, password string) (string, string, *dtos.Error) {
	authorRepository := &repositories.AuthorRepository{DB: authenticationService.DB}

	passwordHash := utils.HashPassword(password)

	// Declare a pointer to a new instance of an author struct
	author := &models.Author{Name: name, Username: username, Email: email, PasswordHash: passwordHash}

	userAuthorID, err := authorRepository.CreateAuthor(author)

	if err != nil {
		// Check for existing name
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_name_lowercase\"" {
			return "", "", &dtos.Error{
				Status:    "error",
				ErrorCode: "NAME_ALREADY_EXISTS",
				Message:   "The name provided has already been used. (case insensitive)",
			}
		}
		// Check for existing username
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_username_lowercase\"" {
			return "", "", &dtos.Error{
				Status:    "error",
				ErrorCode: "USERNAME_ALREADY_EXISTS",
				Message:   "The username provided has already been used. (case insensitive)",
			}
		}
		// Check for existing email
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_email_lowercase\"" {
			return "", "", &dtos.Error{
				Status:    "error",
				ErrorCode: "EMAIL_ALREADY_EXISTS",
				Message:   "The email provided has already been used. (case insensitive)",
			}
		}
		// Check for internal server errors
		return "", "", &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// jwt token expires in 15 minutes from the time of creation
	jwtToken, err := utils.GenerateJwtToken(userAuthorID, os.Getenv("JWT_TOKEN_MAX_AGE")+"s", "user")

	if err != nil {
		return "", "", &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// refresh token expires in 3 months from the time of creation
	var refreshToken string
	refreshToken, err = utils.GenerateRefreshToken(userAuthorID, os.Getenv("REFRESH_TOKEN_MAX_AGE")+"s", "user")

	if err != nil {
		return "", "", &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return jwtToken, refreshToken, nil
}

// Generate a new jwt token using user author id
func (authenticationService *AuthenticationService) GenerateJwtToken(userAuthorID int) (string, *dtos.Error) {
	jwtToken, err := utils.GenerateJwtToken(userAuthorID, os.Getenv("JWT_TOKEN_MAX_AGE")+"s", "user")

	if err != nil {

		return "", &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return jwtToken, nil
}

// Validate a jwt token 
func (authenticationService *AuthenticationService) ValidateJwtToken(jwtToken string) *dtos.Error {

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
	payload, _ := utils.ParseJwtTokenPayload(jwtToken)
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

// Generate a new jwt token using refresh token payload (refresh token must be validated first)
func (authenticationService *AuthenticationService) RefreshJwtToken(refreshToken string) (string, *dtos.Error) {
	// Get user author id from refresh token
	payload, responseErr := utils.ParseRefreshTokenPayload(refreshToken)
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
	jwtToken, responseErr := authenticationService.GenerateJwtToken(userAuthorIDInt)
	if responseErr != nil {
		return "", responseErr
	}
	return jwtToken, nil
}

func (authenticationService *AuthenticationService) ValidateRefreshToken(refreshToken string) *dtos.Error {

	refreshTokenSlice := strings.Split(refreshToken, ".")

	// Incorrect token structure
	if len(refreshTokenSlice) != 3 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INVALID_TOKEN",
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
			ErrorCode: "INVALID_TOKEN",
			Message:   "Invalid or expired refresh token",
		}
	}

	// Check expiration time
	payload, responseErr := utils.ParseRefreshTokenPayload(refreshToken)
	if responseErr != nil {
		return responseErr
	}
	var expirationTime int64
	val, ok := payload["exp"].(float64)
	if !ok {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INVALID_TOKEN",
			Message:   "Invalid or expired refresh token",
		}
	} else {
		expirationTime = int64(val)
	}
	currentTime := time.Now().Unix()
	if currentTime > expirationTime {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INVALID_TOKEN",
			Message:   "Invalid or expired refresh token",
		}
	}
	return nil
}
