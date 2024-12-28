package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/models"
)

type AuthenticationService struct {
	DB *sql.DB
}

func (authenticationService *AuthenticationService) LogIn(email string, password string) (bool, int, *models.Error) {
	authorRepository := &repositories.AuthorRepository{DB: authenticationService.DB}

	// Check if author with that email exists
	author := authorRepository.GetAuthorByEmail(email)
	if author == nil {
		return false, 0, &models.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORISED",
			Message:   "Invalid email or password",
		}
	}
	
	authorID := author.AuthorID

	// Check if password is correct
	if password == authorRepository.GetPasswordByAuthorID(authorID) {
		return true, author.AuthorID, nil
	} else {
		return false, 0, &models.Error{
			Status:    "error",
			ErrorCode: "UNAUTHORISED",
			Message:   "Invalid email or password",
		}
	}

}
