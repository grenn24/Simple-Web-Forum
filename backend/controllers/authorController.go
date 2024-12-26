package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllAuthors(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM author")

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
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
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned thread to threads slice
		authors = append(authors, author)
	}

	// Check for empty table
	if len(authors) == 0 {
		context.String(http.StatusNotFound, "No authors in database")
		return
	}

	context.JSON(http.StatusOK, authors)
}

func GetAuthorByID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	row := db.QueryRow("SELECT * FROM author WHERE author_id = $1", authorID)

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
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.JSON(http.StatusOK, author)
}

func CreateAuthor(context *gin.Context, db *sql.DB) {
	// Declare a pointer to a new instance of an author struct
	author := new(models.Author)

	err := context.ShouldBind(&author)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusBadRequest, err.Error())
		return
	}

	// Check if the binded struct contains necessary fields
	if author.Email == "" || author.Name == "" || author.PasswordHash == "" || author.Username == "" {
		context.String(http.StatusBadRequest, "Missing required fields")
		return
	}

	_, err = db.Exec("INSERT INTO author (name, username, email, password_hash, avator_icon_link) VALUES ($1, $2, $3, $4, $5)", author.Name, author.Username, author.Email, author.PasswordHash, author.AvatarIconLink)

	// Check for sql insertion errors
	if err != nil {
		// Check for existing name
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_name_lowercase\"" {
			context.String(http.StatusBadRequest, "Name already exists (case insensitive)")
			return
		}
		// Check for existing username
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_username_lowercase\"" {
			context.String(http.StatusBadRequest, "Username already exists (case insensitive)")
			return
		}
		// Check for existing email
		if err.Error() == "pq: duplicate key value violates unique constraint \"author_email_lowercase\"" {
			context.String(http.StatusBadRequest, "Email already exists (case insensitive)")
			return
		}
		// Other errors
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Author added to database")
}

func DeleteAllAuthors(context *gin.Context, db *sql.DB) {

	_, err := db.Exec("DELETE FROM author")

	// Check for any deletion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Deleted all authors")
}
