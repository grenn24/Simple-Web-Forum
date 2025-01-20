package services

import (
	"database/sql"
	"fmt"
	"mime/multipart"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type AuthorService struct {
	DB *sql.DB
}

func (authorService *AuthorService) GetAllAuthors() ([]*dtos.AuthorDTO, *dtos.Error) {

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

func (authorService *AuthorService) GetAuthorByID(authorID int, userAuthorID int) (*dtos.AuthorDTO, *dtos.Error) {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}
	followRepository := &repositories.FollowRepository{DB: authorService.DB}

	author, err := authorRepository.GetAuthorWithFollowStatusByID(authorID, userAuthorID)
	if err != nil {
		// Check for author not found error
		if err == sql.ErrNoRows {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No author found for author id: %v", authorID),
			}
		}
		// Check for internal server errors
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	// Check if the author being requested is the current user
	isUser := userAuthorID == author.AuthorID
	author.IsUser = &isUser

	// Get follower count
	followerCount, err := followRepository.CountFollowersByAuthorID(authorID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	author.FollowerCount = &followerCount

	return author, nil
}

func (authorService *AuthorService) GetAuthorActivityByAuthorID(authorID int) ([]*dtos.AuthorActivityDTO, *dtos.Error) {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}

	authorActivities, err := authorRepository.GetAuthorActivityByAuthorID(authorID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return authorActivities, nil
}

func (authorService *AuthorService) GetAvatarIconLinkByAuthorID(authorID int) string {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}
	return authorRepository.GetAvatarIconLinkByAuthorID(authorID)
}

func (authorService *AuthorService) SearchAuthors(userAuthorID int, query string, page int, limit int, sortIndex int) ([]*dtos.AuthorDTO, *dtos.Error) {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}
	authors, err := authorRepository.SearchAuthors(userAuthorID, query, page, limit, sortIndex)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return authors, nil
}

func (authorService *AuthorService) CreateAuthor(author *models.Author) *dtos.Error {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}

	_, err := authorRepository.CreateAuthor(author)

	if err != nil {
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

// Only update existing fields with values (for replacing fields with null values using other deletion methods)
func (authorService *AuthorService) UpdateAuthor(author *dtos.AuthorDTO, authorID int) *dtos.Error {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}

	// Update fields on existing author
	existingAuthor, err := authorRepository.GetAuthorByID(authorID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	if author.Name != "" {
		existingAuthor.Name = author.Name
	}
	if author.Username != "" {
		existingAuthor.Username = author.Username
	}
	if author.Email != nil && *author.Email != "" {
		existingAuthor.Email = author.Email
	}

	// If biography is provided, update it
	if author.Biography != nil {
		existingAuthor.Biography = author.Biography
	}
	// If birthday is provided, update it
	if author.Birthday != nil {
		if *author.Birthday != utils.ParseDateString("") {
			existingAuthor.Birthday = author.Birthday
		} else {
			existingAuthor.Birthday = nil
		}

	}
	// If faculty is provided, update it
	if author.Faculty != nil {
		if *author.Faculty != "" {
			existingAuthor.Faculty = author.Faculty
		} else {
			existingAuthor.Faculty = nil
		}

	}
	// If gender is provided, update it
	if author.Gender != nil {
		if *author.Gender != "" {
			existingAuthor.Gender = author.Gender
		} else {
			existingAuthor.Gender = nil
		}

	}

	// Check if avatar icon file was uploaded
	if author.AvatarIcon != nil {
		// Check if existing icon link exists in db, if yes delete it in s3
		avatarIconLink := authorRepository.GetAvatarIconLinkByAuthorID(authorID)
		if avatarIconLink != "" {
			err := utils.DeleteFileFromS3Bucket(avatarIconLink)
			if err != nil {
				return &dtos.Error{
					Status:    "error",
					ErrorCode: "INTERNAL_SERVER_ERROR",
					Message:   err.Error(),
				}
			}
		}

		// Upload the avatar icon to s3 bucket and obtain the public link

		avatarIconLink, err := utils.PostFileHeaderToS3Bucket(author.AvatarIcon, "avatar_icon")
		if err != nil {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		// Assign the newly returned link to author dto
		existingAuthor.AvatarIconLink = &avatarIconLink
	}

	err = authorRepository.UpdateAuthor(existingAuthor, authorID)

	if err != nil {
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_username_lowercase\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "USERNAME_ALREADY_EXISTS",
				Message:   "Username already exists (duplicate)",
			}
		}
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_email_lowercase\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "USERNAME_ALREADY_EXISTS",
				Message:   "Email already exists (duplicate)",
			}
		}
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

// Update the avatar icon link field in authors table for a particular author
func (authorService *AuthorService) UpdateAuthorAvatarIconLink(avatarIcon *multipart.FileHeader, authorID int) *dtos.Error {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}
	author := new(dtos.AuthorDTO)

	// Replace these author fields with existing values
	author.Name = authorRepository.GetAuthorNameByAuthorID(authorID)
	author.Username = authorRepository.GetAuthorUsernameByAuthorID(authorID)
	email := authorRepository.GetAuthorEmailByAuthorID(authorID)
	author.Email = &email
	biography := authorRepository.GetBiographyByAuthorID(authorID)
	author.Biography = &biography

	// Check if existing icon link exists in db, and delete if it exists
	avatarIconLink := authorRepository.GetAvatarIconLinkByAuthorID(authorID)
	if avatarIconLink != "" {
		err := utils.DeleteFileFromS3Bucket(avatarIconLink)
		if err != nil {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
	}

	// Upload the avatar icon to s3 bucket and obtain the public link

	avatarIconLink, err := utils.PostFileHeaderToS3Bucket(avatarIcon, "avatar_icon")
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	// Assign the newly returned link to author dto
	author.AvatarIconLink = &avatarIconLink

	err = authorRepository.UpdateAuthor(author, authorID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (authorService *AuthorService) DeleteAuthorAvatarIconLink(authorID int) *dtos.Error {
	authorRepository := &repositories.AuthorRepository{DB: authorService.DB}
	author := new(dtos.AuthorDTO)
	// Replace these author fields with existing values
	author.Name = authorRepository.GetAuthorNameByAuthorID(authorID)
	author.Username = authorRepository.GetAuthorUsernameByAuthorID(authorID)
	email := authorRepository.GetAuthorEmailByAuthorID(authorID)
	author.Email = &email
	author.AvatarIconLink = nil

	// Check if existing icon link exists in db, and delete if it exists
	avatarIconLink := authorRepository.GetAvatarIconLinkByAuthorID(authorID)
	if avatarIconLink != "" {
		err := utils.DeleteFileFromS3Bucket(avatarIconLink)
		if err != nil {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
	}
	// Set the icon link in the db to null
	err := authorRepository.UpdateAuthor(author, authorID)
	if err != nil {
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
