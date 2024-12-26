package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllThreads(context *gin.Context, db *sql.DB) {

	rows, err := db.Query("SELECT * FROM Thread")

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var threads []*models.Thread

	for rows.Next() {
		// Declare a pointer to a new instance of a thread struct
		thread := new(models.Thread)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&thread.ThreadID,
			&thread.Title,
			&thread.CreatedAt,
			&thread.Content,
			&thread.AuthorID,
			&thread.ImageTitle,
			&thread.ImageLink,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned thread to threads slice
		threads = append(threads, thread)
	}

	// Check for empty table
	if len(threads) == 0 {
		context.String(http.StatusNotFound, "No threads in database")
		return
	}

	context.JSON(http.StatusOK, threads)
}

func GetThreadByID(context *gin.Context, db *sql.DB) {
	id := context.Param("id")

	row := db.QueryRow("SELECT * FROM Thread WHERE thread_id = $1", id)

	// Declare a pointer to a new instance of a thread struct
	thread := new(models.Thread)

	// Scan the current row into the thread struct
	err := row.Scan(
		&thread.ThreadID,
		&thread.Title,
		&thread.CreatedAt,
		&thread.Content,
		&thread.AuthorID,
		&thread.ImageTitle,
		&thread.ImageLink,
	)

	// Check for any scanning errors
	if err != nil {
		// Check for thread not found error
		if err == sql.ErrNoRows {
			context.String(http.StatusNotFound, "Thread not found")
			return
		}
		// Other errors
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.JSON(http.StatusOK, thread)
}

func CreateThread(context *gin.Context, db *sql.DB) {
	// Declare a pointer to a new instance of a thread struct
	thread := new(models.Thread)

	err := context.ShouldBind(&thread)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusBadRequest, err.Error())
		return
	}

	// Check if the binded struct contains necessary fields
	if thread.Title == "" || thread.Content == "" || thread.AuthorID == 0 {
		context.String(http.StatusBadRequest, "Missing required fields")
		return
	}

	_, err = db.Exec("INSERT INTO Thread (title, content, author_id, image_title, image_link) VALUES ($1, $2, $3, $4, $5)", thread.Title, thread.Content, thread.AuthorID, thread.ImageTitle, thread.ImageLink)

	// Check for sql insertion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Thread added to database")
}

func DeleteAllThreads(context *gin.Context, db *sql.DB) {

	_, err := db.Exec("DELETE FROM Thread")

	// Check for any deletion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Deleted all threads")
}

func DeleteThreadByID(context *gin.Context, db *sql.DB) {
	id := context.Param("id")

	result, err := db.Exec("DELETE FROM Thread WHERE thread_id = $1", id)

	// Check for any deletion errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	rowsDeleted, _ := result.RowsAffected()

	// Check for thread not found error
	if rowsDeleted == 0 {
		context.String(http.StatusNotFound, "Thread not found")
		return
	}

	context.String(http.StatusOK, "Thread deleted successfully")
}
