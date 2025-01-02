package services

import (
	"database/sql"
	"fmt"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
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

func (likeService *LikeService) GetLikedThreadsByAuthorID(authorID int, sortIndex int) ([]*dtos.ThreadCard, *dtos.Error) {
	likeRepository := &repositories.LikeRepository{DB: likeService.DB}
	commentRepository := &repositories.CommentRepository{DB: likeService.DB}
	topicRepository := &repositories.TopicRepository{DB: likeService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: likeService.DB}

	likedThreads, err := likeRepository.GetLikedThreadsByAuthorID(authorID, sortIndex)

	// Check for internal server errors
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	for _, likedThread := range likedThreads {
		// Retrieve comment count
		commentCount, err := commentRepository.CountCommentsByThreadID(likedThread.ThreadID)
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		likedThread.CommentCount = commentCount

		// Retrieve like and bookmark status
		likedThread.LikeStatus = true
		bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(likedThread.ThreadID, likedThread.AuthorID)
		likedThread.BookmarkStatus = &bookmarkStatus

		// Retrieve topics tagged
		topics, err := topicRepository.GetTopicsByThreadID(likedThread.ThreadID)
		likedThread.TopicsTagged = topics
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
	err := threadRepository.DecrementLikeCountByThreadID(threadID)
	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}
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
