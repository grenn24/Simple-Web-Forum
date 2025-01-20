package services

import (
	"database/sql"
	"fmt"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type LikeService struct {
	DB *sql.DB
}

func (likeService *LikeService) GetAllLikes() ([]*models.Like, *dtos.Error) {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	likes, err := likeRepository.GetAllLikes()
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return likes, nil
}

// Retrieve liked threads for a specific author id
func (likeService *LikeService) GetLikesByAuthorID(authorID int, sortIndex int) ([]*dtos.LikeDTO, *dtos.Error) {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	topicRepository := &repositories.TopicRepository{DB: likeService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: likeService.DB}

	likedThreads, err := likeRepository.GetLikesByAuthorID(authorID, sortIndex)

	// Check for internal server errors
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	for _, likedThread := range likedThreads {
		// Retrieve like, bookmark and isUser status
		likeStatus := true
		likedThread.Thread.LikeStatus = &likeStatus
		bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(likedThread.Thread.ThreadID, likedThread.Author.AuthorID)
		likedThread.Thread.BookmarkStatus = &bookmarkStatus
		threadAuthorIsUser := likedThread.Thread.Author.AuthorID == authorID
		likedThread.Thread.Author.IsUser = &threadAuthorIsUser

		// Retrieve topics tagged
		topics, err := topicRepository.GetTopicsByThreadID(likedThread.Thread.ThreadID)
		likedThread.Thread.TopicsTagged = topics
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
	}
	return likedThreads, nil
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

func (likeService *LikeService) CountLikesByThreadID(threadID int) int {
	threadRepository := &repositories.ThreadRepository{DB: likeService.DB}
	return threadRepository.GetLikeCountByThreadID(threadID)
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

func (likeService *LikeService) CreateLike(like *models.Like) *dtos.Error {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	threadRepository := &repositories.ThreadRepository{DB: likeService.DB}
	err := threadRepository.IncrementLikeCountByThreadID(like.ThreadID)
	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}
	err = likeRepository.CreateLike(like)

	if err != nil {
		// Check for existing likes errors
		if err.Error() == "pq: duplicate key value violates unique constraint \"like_thread_id_author_id_key\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "LIKE_ALREADY_EXISTS",
				Message:   fmt.Sprintf("Thread has already been liked for author id %v", like.AuthorID),
			}
		}
		// Internal server errors
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return nil
}

func (likeService *LikeService) DeleteLikeByThreadAuthorID(threadID int, authorID int) *dtos.Error {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	threadRepository := &repositories.ThreadRepository{DB: likeService.DB}
	rowsDeleted, err := likeRepository.DeleteLikeByThreadAuthorID(threadID, authorID)

	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}

	// Check for like not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No likes found for the thread and author ids provided ",
		}
	}
	err = threadRepository.DecrementLikeCountByThreadID(threadID)
	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}
	return nil
}

func (likeService *LikeService) DeleteLikeByID(likeID int) *dtos.Error {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	threadRepository := &repositories.ThreadRepository{DB: likeService.DB}

	like, err := likeRepository.GetLikeByID(likeID)
	if err != nil {
		// Check for thread not found error
		if err == sql.ErrNoRows {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No like found for like id: %v", likeID),
			}
		}
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	rowsDeleted, err := likeRepository.DeleteLikeByID(likeID)

	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}

	// Check for like not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No likes found for like id: " + utils.ConvertIntToString(likeID),
		}
	}
	err = threadRepository.DecrementLikeCountByThreadID(like.ThreadID)
	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}
	return nil
}

func (likeService *LikeService) DeleteAllLikes() *dtos.Error {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	threadRepository := &repositories.ThreadRepository{DB: likeService.DB}
	err := likeRepository.DeleteAllLikes()
	if err != nil {
		// Check for internal server errors
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	err = threadRepository.ResetAllLikeCount()
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
