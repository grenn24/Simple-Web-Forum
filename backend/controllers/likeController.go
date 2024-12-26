package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
)

func GetAllLikes(context *gin.Context, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM \"Like\"")

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var likes []*models.Like

	for rows.Next() {
		// Declare a pointer to a new instance of a like struct
		like := new(models.Like)

		// Scan the current row into the like struct
		err := rows.Scan(
			&like.LikeID,
			&like.ThreadID,
			&like.AuthorID,
			&like.CreatedAt,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned like to likes slice
		likes = append(likes, like)
	}

	// Check for empty table
	if len(likes) == 0 {
		context.String(http.StatusNotFound, "No likes in database")
		return
	}

	context.JSON(http.StatusOK, likes)
}

func GetLikesByAuthorID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	rows, err := db.Query("SELECT * FROM \"like\" WHERE author_id = " + authorID)

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var likes []*models.Like

	for rows.Next() {
		// Declare a pointer to a new instance of a like struct
		like := new(models.Like)

		// Scan the current row into the like struct
		err := rows.Scan(
			&like.LikeID,
			&like.ThreadID,
			&like.AuthorID,
			&like.CreatedAt,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned like to likes slice
		likes = append(likes, like)
	}

	// Check for empty table
	if len(likes) == 0 {
		context.String(http.StatusNotFound, "No likes found for this author")
		return
	}

	context.JSON(http.StatusOK, likes)
}

func GetLikesByThreadID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	rows, err := db.Query("SELECT * FROM \"like\" WHERE thread_id = " +threadID)

	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	//Close rows after finishing query
	defer rows.Close()

	var likes []*models.Like

	for rows.Next() {
		// Declare a pointer to a new instance of a like struct
		like := new(models.Like)

		// Scan the current row into the like struct
		err := rows.Scan(
			&like.LikeID,
			&like.ThreadID,
			&like.AuthorID,
			&like.CreatedAt,
		)

		// Check for any scanning errors
		if err != nil {
			context.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Append the scanned like to likes slice
		likes = append(likes, like)
	}

	// Check for empty table
	if len(likes) == 0 {
		context.String(http.StatusNotFound, "No likes found for this thread")
		return
	}

	context.JSON(http.StatusOK, likes)
}

func CountAllLikes(context *gin.Context, db *sql.DB) {
	row := db.QueryRow("SELECT COUNT(*) FROM \"like\"")

	var likeCount int

	err := row.Scan(&likeCount)

	// Check for any scanning errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.JSON(http.StatusOK, gin.H{"likeCount": likeCount})
}

func CountLikesByThreadID(context *gin.Context, db *sql.DB) {
	threadID := context.Param("threadID")

	row := db.QueryRow("SELECT COUNT(*) FROM \"like\" WHERE thread_id = " + threadID)

	var likeCount int

	err := row.Scan(&likeCount)

	// Check for any scanning errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.JSON(http.StatusOK, gin.H{"likeCount": likeCount})
}

func CountLikesByAuthorID(context *gin.Context, db *sql.DB) {
	authorID := context.Param("authorID")

	row := db.QueryRow("SELECT COUNT(*) FROM \"like\" WHERE author_id = " + authorID)

	var likeCount int

	err := row.Scan(&likeCount)

	// Check for any scanning errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.JSON(http.StatusOK, gin.H{"likeCount": likeCount})
}

func CreateLike(context *gin.Context, db *sql.DB) {
	// Declare a pointer to a new instance of a like struct
	like := new(models.Like)

	err := context.ShouldBind(&like)

	// Check for JSON binding errors
	if err != nil {
		context.String(http.StatusBadRequest, err.Error())
		return
	}

	// Check if the binded struct contains necessary fields
	if like.AuthorID == 0 || like.ThreadID == 0 {
		context.String(http.StatusBadRequest, "Missing required fields")
		return
	}

	_, err = db.Exec("INSERT INTO \"like\" (thread_id, author_id) VALUES ($1, $2)", like.ThreadID, like.AuthorID)

	// Check for sql insertion errors
	if err != nil {
		// Check for existing thread-author combination
		if err.Error() == "pq: duplicate key value violates unique constraint \"Like_thread_id_author_id_key\"" {
			context.String(http.StatusBadRequest, "Thread has already been liked by author")
			return
		}
		// Other Errors
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Like added to database")
}
