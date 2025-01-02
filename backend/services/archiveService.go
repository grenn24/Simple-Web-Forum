package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type ArchiveService struct {
	DB *sql.DB
}

func (archiveService *ArchiveService) CreateArchive(archive *models.Archive) *dtos.Error {
	archiveRepository := repositories.ArchiveRepository{DB: archiveService.DB}

	err := archiveRepository.CreateArchive(archive)

	if err != nil {
		// Check for existing archives with same thread id and author id
		if err.Error() == "pq: duplicate key value violates unique constraint \"thread_archive_thread_id_author_id_key\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "ARCHIVE_ALREADY_EXISTS",
				Message:   "ARCHIVE already exists",
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

func (archiveService *ArchiveService) GetArchivedThreadsByAuthorID(authorID int) ([]*dtos.ThreadCard, *dtos.Error) {
	archiveRepository := &repositories.ArchiveRepository{DB: archiveService.DB}
	likeRepository := &repositories.LikeRepository{DB: archiveService.DB}
	commentRepository := &repositories.CommentRepository{DB: archiveService.DB}
	topicRepository := &repositories.TopicRepository{DB: archiveService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: archiveService.DB}

	archivedThreads, err := archiveRepository.GetArchivedThreadsByAuthorID(authorID)

	// Check for internal server errors
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	for _, archivedThread := range archivedThreads {
		// Retrieve like count
		likeCount, err := likeRepository.CountLikesByThreadID(archivedThread.ThreadID)
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		archivedThread.LikeCount = likeCount

		// Retrieve comment count
		commentCount, err := commentRepository.CountCommentsByThreadID(archivedThread.ThreadID)
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		archivedThread.CommentCount = commentCount

		// Retrieve archive and bookmark status
		archiveStatus := true
		archivedThread.ArchiveStatus = &archiveStatus
		bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(archivedThread.ThreadID, archivedThread.AuthorID)
		archivedThread.BookmarkStatus = &bookmarkStatus

		// Retrieve topics tagged
		topics, err := topicRepository.GetTopicsByThreadID(archivedThread.ThreadID)
		archivedThread.TopicsTagged = topics
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
	}
	return archivedThreads, nil
}

func (archiveService *ArchiveService) DeleteArchiveByID(archiveID int) *dtos.Error {
	archiveRepository := &repositories.ArchiveRepository{DB: archiveService.DB}
	rowsDeleted, err := archiveRepository.DeleteArchiveByID(archiveID)
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
			Message:   "No archives found with archive id: " + utils.ConvertIntToString(archiveID),
		}
	}
return nil
}

func (archiveService *ArchiveService) DeleteArchiveByThreadIDAuthorID(threadID int, authorID int) *dtos.Error {
	archiveRepository := &repositories.ArchiveRepository{DB: archiveService.DB}
	rowsDeleted, err := archiveRepository.DeleteArchiveByThreadIDAuthorID(threadID, authorID)
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
			Message:   "No archives found with the thread and author ids provided",
		}
	}
	return nil
}
