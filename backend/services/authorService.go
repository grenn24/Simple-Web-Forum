package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type AuthorService struct {
	DB *sql.DB
}

func (authorService *AuthorService) GetAllAuthors() ([]*models.Author, *dtos.Error) {

	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}

	authors, err := authorRepository.GetAllAuthors()

	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return authors, nil
}

func (authorService *AuthorService) GetAuthorByID(authorID int) (*models.Author, error) {

	row := authorService.DB.QueryRow("SELECT * FROM author WHERE author_id = $1", authorID)

	// Declare a pointer to a new instance of an author struct
	author := new(models.Author)

	// Scan the current row into the author struct
	err := row.Scan(
		&author.AuthorID,
		&author.Name,
		&author.Username,
		&author.Email,
		&author.PasswordHash,
		&author.AvatarIconLink,
		&author.CreatedAt,
	)

	// Check for any scanning errors
	if err != nil {
		return nil, err
	}

	return author, err
}

func (authorService *AuthorService) CreateAuthor(author *models.Author) *dtos.Error {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}

	_, err := authorRepository.CreateAuthor(author)

	if err != nil {
		// Check for existing name
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_name_lowercase\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "NAME_ALREADY_EXISTS",
				Message:   "The name provided has already been used. (case insensitive)",
			}
		}
		// Check for existing username
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_username_lowercase\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "USERNAME_ALREADY_EXISTS",
				Message:   "The username provided has already been used. (case insensitive)",
			}
		}
		// Check for existing email
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_email_lowercase\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "EMAIL_ALREADY_EXISTS",
				Message:   "The email provided has already been used. (case insensitive)",
			}
		}
		// Check for internal server errors
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (authorService *AuthorService) DeleteAllAuthors() *dtos.Error {

	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}

	err := authorRepository.DeleteAllAuthors()

	if err != nil {
		// Check for internal server errors
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (authorService *AuthorService) DeleteAuthorByID(authorID int) *dtos.Error {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}
	rowsDeleted, err := authorRepository.DeleteAuthorByID(authorID)

	if err != nil {
		// Check for internal server errors
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Check for author not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No authors found for author id: " + utils.ConvertIntToString(authorID),
		}
	}

	return nil
}