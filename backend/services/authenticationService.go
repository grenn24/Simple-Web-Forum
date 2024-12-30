package services

import (
	"database/sql"

	
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
	"github.com/grenn24/simple-web-forum/models"
)

type AuthenticationService struct {
	DB *sql.DB
}

func (authenticationService *AuthenticationService) LogIn(email string, password string) (string, *dtos.Error) {
	authorRepository := &repositories.AuthorRepository{DB: authenticationService.DB}

	passwordHash := utils.HashPassword(password)

	// Check if author with that email exists
	author := authorRepository.GetAuthorByEmail(email)
	if author == nil {
		return "", &dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORISED",
			Message:   "Invalid email or password",
		}
	}

	userAuthorID := author.AuthorID

	// Check if password is correct
	if passwordHash != authorRepository.GetPasswordHashByAuthorID(userAuthorID) {
		return "", &dtos.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORISED",
			Message:   "Invalid email or password",
		}
	}

	jwtToken, err := utils.GenerateJwtToken(userAuthorID, "15m")

	if err != nil {
		return "", &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   "Error generating jwt token",
		}
	}

	return jwtToken, nil
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
			return "", "",&dtos.Error{
				Status:    "error",
				ErrorCode: "NAME_ALREADY_EXISTS",
				Message:   "The name provided has already been used. (case insensitive)",
			}
		}
		// Check for existing username
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_username_lowercase\"" {
			return "", "",&dtos.Error{
				Status:    "error",
				ErrorCode: "USERNAME_ALREADY_EXISTS",
				Message:   "The username provided has already been used. (case insensitive)",
			}
		}
		// Check for existing email
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_email_lowercase\"" {
			return "", "",&dtos.Error{
				Status:    "error",
				ErrorCode: "EMAIL_ALREADY_EXISTS",
				Message:   "The email provided has already been used. (case insensitive)",
			}
		}
		// Check for internal server errors
		return "","", &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	jwtToken, err := utils.GenerateJwtToken(userAuthorID , "15m")

	if err != nil {
		return "","", &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   "Error generating jwt token",
		}
	}

	var refreshToken string
	refreshToken, err = utils.GenerateRefreshToken("3m")

	return jwtToken, refreshToken, nil
}
