package services

import (
	"database/sql"
	"os"

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
