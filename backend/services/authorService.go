package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/models"
)

type AuthorService struct {
	DB *sql.DB
}

func (authorService *AuthorService) GetAllAuthors() ([]*models.Author, error) {
	rows, err := authorService.DB.Query("SELECT * FROM author")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var authors []*models.Author

	for rows.Next() {
		// Declare a pointer to a new instance of an author struct
		author := new(models.Author)

		// Scan the current row into the author struct
		err := rows.Scan(
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

		// Append the scanned thread to threads slice
		authors = append(authors, author)
	}

	return authors, err
}

func (authorService *AuthorService) GetAuthorByID(authorID string) (*models.Author, error) {

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

func (authorService *AuthorService) CreateAuthor(author *models.Author) (int64, error) {
	var authorID int64

	row := authorService.DB.QueryRow("INSERT INTO author (name, username, email, password_hash, avator_icon_link) VALUES ($1, $2, $3, $4, $5) RETURNING author_id", author.Name, author.Username, author.Email, author.PasswordHash, author.AvatarIconLink)

	// Check for constraint errors while returning author id
	err := row.Scan(&authorID)

	return authorID, err
}

func (authorService *AuthorService) DeleteAllAuthors() (error) {

	_, err := authorService.DB.Exec("DELETE FROM author")

	return err
}
