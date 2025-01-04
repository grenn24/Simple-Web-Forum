package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
)

type AuthorRepository struct {
	DB *sql.DB
}

func (authorRepository *AuthorRepository) GetAllAuthors() ([]*models.Author, error) {
	rows, err := authorRepository.DB.Query("SELECT author_id, name, username, email, avatar_icon_link, created_at FROM author")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	authors := make([]*models.Author, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of an author struct
		author := new(models.Author)

		// Scan the current row into the author struct
		err := rows.Scan(
			&author.AuthorID,
			&author.Name,
			&author.Username,
			&author.Email,
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

func (authorRepository *AuthorRepository) GetAuthorByUsername(username string) *models.Author {
	author := new(models.Author)
	row := authorRepository.DB.QueryRow("SELECT author_id, name, username, email, avatar_icon_link, created_at FROM author WHERE LOWER(username) = LOWER($1)", username)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return nil
	}
	return author
}

func (authorRepository *AuthorRepository) GetAuthorByEmail(email string) *models.Author {
	author := new(models.Author)
	row := authorRepository.DB.QueryRow("SELECT author_id, name, username, email, avatar_icon_link, created_at FROM author WHERE LOWER(email) = LOWER($1)", email)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return nil
	}
	return author
}

func (authorRepository *AuthorRepository) GetAuthorByPasswordHash(passwordHash string) *models.Author {
	author := new(models.Author)
	row := authorRepository.DB.QueryRow("SELECT author_id, name, username, email, avatar_icon_link, created_at FROM author WHERE password_hash = $1", passwordHash)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return nil
	}
	return author
}

func (authorRepository *AuthorRepository) GetAuthorByID(authorID int) (*dtos.AuthorDTO, error) {
	author := new(dtos.AuthorDTO)
	row := authorRepository.DB.QueryRow("SELECT author_id, name, username, email, avatar_icon_link, created_at FROM author WHERE author_id = $1", authorID)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt)

	// No authors found
	if err != nil {

		return nil, err
	}
	return author, err
}

func (authorRepository *AuthorRepository) GetPasswordHashByAuthorID(authorID int) string {
	var password string
	row := authorRepository.DB.QueryRow("SELECT password_hash FROM author WHERE author_id = $1", authorID)
	err := row.Scan(&password)

	// No passwords found
	if err != nil || err == sql.ErrNoRows {

		return ""
	}
	return password
}

func (authorRepository *AuthorRepository) GetAuthorNameByAuthorID(authorID int) string {
	var name string
	row := authorRepository.DB.QueryRow("SELECT name FROM author WHERE author_id = $1", authorID)
	err := row.Scan(&name)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return ""
	}
	return name
}

func (authorRepository *AuthorRepository) CreateAuthor(author *models.Author) (int, error) {
	var authorID int64

	row := authorRepository.DB.QueryRow("INSERT INTO author (name, username, email, password_hash, avatar_icon_link) VALUES ($1, $2, $3, $4, $5) RETURNING author_id", author.Name, author.Username, author.Email, author.PasswordHash, author.AvatarIconLink)
	// Check for errors while returning author id
	err := row.Scan(&authorID)

	return int(authorID), err
}

func (authorRepository *AuthorRepository) UpdateAuthor(author *models.Author, authorID int) error {
	if author.Name != "" {
		_, err := authorRepository.DB.Exec("UPDATE author SET name = $1 WHERE author_id = $2", author.Name, authorID)
		if err != nil {
			return err
		}
	}
	if author.Username != "" {
		_, err := authorRepository.DB.Exec("UPDATE author SET username = $1 WHERE author_id = $2", author.Username, authorID)
		if err != nil {
			return err
		}
	}
	if author.AvatarIconLink != nil {
		_, err := authorRepository.DB.Exec("UPDATE author SET avatar_icon_link = $1 WHERE author_id = $2", author.AvatarIconLink, authorID)
		if err != nil {
			return err
		}
	}
	return nil

}

func (authorRepository *AuthorRepository) DeleteAuthorByID(authorID int) (int, error) {
	result, err := authorRepository.DB.Exec("DELETE FROM author WHERE author_id = $1", authorID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}

func (authorRepository *AuthorRepository) DeleteAllAuthors() error {

	_, err := authorRepository.DB.Exec("DELETE FROM author")

	// Check for any deletion errors
	if err != nil {
		return err
	}

	return err

}
