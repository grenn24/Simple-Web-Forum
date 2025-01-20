package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type BookmarkService struct {
	DB *sql.DB
}

func (bookmarkService *BookmarkService) CreateBookmark(bookmark *models.Bookmark) *dtos.Error {
	bookmarkRepository := &repositories.BookmarkRepository{DB: bookmarkService.DB}
	err := bookmarkRepository.CreateBookmark(bookmark)

	if err != nil {
		// Check for existing bookmarks with same thread id and author id
		if err.Error() == "pq: duplicate key value violates unique constraint \"bookmark_thread_id_author_id_key\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "BOOKMARK_ALREADY_EXISTS",
				Message:   "Bookmark already exists",
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

func (bookmarkService *BookmarkService) DeleteBookmarkByID(bookmarkID int) *dtos.Error {
	bookmarkRepository := &repositories.BookmarkRepository{DB: bookmarkService.DB}
	rowsDeleted, err := bookmarkRepository.DeleteBookmarkByID(bookmarkID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Check for thread not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No bookmarks found with bookmark id: " + utils.ConvertIntToString(bookmarkID),
		}
	}
	return nil
}

func (bookmarkService *BookmarkService) DeleteBookmarkByThreadIDAuthorID(threadID int, authorID int) *dtos.Error {
	bookmarkRepository := &repositories.BookmarkRepository{DB: bookmarkService.DB}
	rowsDeleted, err := bookmarkRepository.DeleteBookmarkByThreadIDAuthorID(threadID, authorID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Check for thread not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No bookmarks found with the thread and author ids provided",
		}
	}
	return nil
}

func (bookmarkService *BookmarkService) GetBookmarkedThreadsByAuthorID(authorID int, sortIndex int) ([]*dtos.ThreadDTO, *dtos.Error) {
	bookmarkRepository := &repositories.BookmarkRepository{DB: bookmarkService.DB}
	topicRepository := &repositories.TopicRepository{DB: bookmarkService.DB}
	likeRepository := &repositories.LikeRepository{DB: bookmarkService.DB}

	bookmarkedThreads, err := bookmarkRepository.GetBookmarkedThreadsByAuthorID(authorID, sortIndex)

	// Check for internal server errors
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	for _, bookmarkedThread := range bookmarkedThreads {

		// Retrieve like, bookmark and isUser status
		likeStatus := likeRepository.GetLikeStatusByThreadIDAuthorID(bookmarkedThread.ThreadID, bookmarkedThread.Author.AuthorID)
		bookmarkedThread.LikeStatus = &likeStatus
		bookmarkStatus := true
		bookmarkedThread.BookmarkStatus = &bookmarkStatus
		threadAuthorIsUser := bookmarkedThread.Author.AuthorID == authorID
		bookmarkedThread.Author.IsUser = &threadAuthorIsUser

		// Retrieve topics tagged
		topics, err := topicRepository.GetTopicsByThreadID(bookmarkedThread.ThreadID)
		bookmarkedThread.TopicsTagged = topics
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
	}

	return bookmarkedThreads, nil
}
