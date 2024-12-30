package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
)

type LikeService struct {
	DB *sql.DB
}

func (likeService *LikeService) GetAllLikes() ([]*models.Like, error) {
	rows, err := likeService.DB.Query("SELECT * FROM \"like\"")

	if err != nil {
		return nil, err
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
			return nil, err
		}

		// Append the scanned like to likes slice
		likes = append(likes, like)
	}

	return likes, err
}

func (likeService *LikeService) GetLikesByAuthorID(authorID string) ([]*models.Like, error) {

	rows, err := likeService.DB.Query("SELECT * FROM \"like\" WHERE author_id = " + authorID)

	if err != nil {
		return nil, err
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
			return nil, err
		}

		// Append the scanned like to likes slice
		likes = append(likes, like)
	}

	return likes, err
}

func (likeService *LikeService) GetLikesByThreadID(threadID string) ([]*models.Like, error) {

	rows, err := likeService.DB.Query("SELECT * FROM \"like\" WHERE thread_id = " + threadID)

	if err != nil {
		return nil, err
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
			return nil, err
		}

		// Append the scanned like to likes slice
		likes = append(likes, like)
	}

	return likes, err
}

func (likeService *LikeService) GetLikeByThreadAuthorID(threadID int, authorID int) (*models.Like, *dtos.Error) {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	like, err := likeRepository.GetLikeByThreadAuthorID(threadID, authorID)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   "No likes found for the thread and author ids provided",
			}
		}
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   "Internal server error",
		}
	}

	return like, nil
}

func (likeService *LikeService) CountAllLikes() (int, error) {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	return likeRepository.CountAllLikes()
}

func (likeService *LikeService) CountLikesByThreadID(threadID int) (int, error) {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	return likeRepository.CountLikesByThreadID(threadID)
}

func (likeService *LikeService) CountLikesByAuthorID(authorID string) (int, error) {

	row := likeService.DB.QueryRow("SELECT COUNT(*) FROM \"like\" WHERE author_id = " + authorID)

	var likeCount int

	err := row.Scan(&likeCount)

	// Check for any scanning errors
	if err != nil {
		return 0, err
	}

	return likeCount, err
}

func (likeService *LikeService) CreateLike(like *models.Like) error {

	_, err := likeService.DB.Exec("INSERT INTO \"like\" (thread_id, author_id) VALUES ($1, $2)", like.ThreadID, like.AuthorID)

	return err
}

func (likeService *LikeService) DeleteLikeByThreadAuthorID(threadID int, authorID int) *dtos.Error {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	rowsDeleted, err := likeRepository.DeleteLikeByThreadAuthorID(threadID, authorID)

	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}

	// Check for follow not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No likes found for the thread and author ids provided ",
		}
	}

	return nil
}
