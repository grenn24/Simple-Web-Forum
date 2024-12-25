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
