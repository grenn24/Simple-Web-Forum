package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllAuthors(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM Author")

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var authors []models.Author

	for rows.Next() {
		// Declare a author struct instance
		var author models.Author

		// Scan the row and modify the author instance
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

	context.JSON(http.StatusOK, authors)
}

func GetAuthorByID(context *gin.Context, db *sql.DB) {
	id := context.Param("id")

	row := db.QueryRow("SELECT * FROM Author WHERE Author_id = $1", id)

	// Declare an author struct instance
	var author models.Author

	// Scan the row and modify the author instance
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
	// Declare an author struct instance
	var author models.Author

	err := context.ShouldBind(&author)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	_, err = db.Exec("INSERT INTO Author (name, username, email, password_hash) VALUES ($1, $2, $3, $4, $5)", author.Name, author.Username, author.Email, author.PasswordHash, author.AvatarIconLink)

	// Check for existing name
	if err.Error() == "pq: duplicate key value violates unique constraint \"author_name_key\"" {
		context.String(http.StatusBadRequest, "Name already exists")
		return
	}

	// Check for existing username
	if err.Error() == "pq: duplicate key value violates unique constraint \"author_username_key\"" {
		context.String(http.StatusBadRequest, "Username already exists")
		return
	}

	// Check for existing email
	if err.Error() == "pq: duplicate key value violates unique constraint \"author_email_key\"" {
		context.String(http.StatusBadRequest, "Email already exists")
		return
	}

	// Check for other sql insertion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Author added to database")
}
