package services

import (
	"database/sql"
	"fmt"

	"github.com/jinzhu/copier"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
)

type ThreadService struct {
	DB *sql.DB
}

func (threadService *ThreadService) GetAllThreads() ([]*models.Thread, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.GetAllThreads()
}

func (threadService *ThreadService) GetThreadByID(threadID int) (*models.Thread, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	thread, err := threadRepository.GetThreadByID(threadID)
	if err != nil {
		// Check for thread not found error
		if err == sql.ErrNoRows {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No thread found for thread id: %v", threadID),
			}
		}
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return thread, nil
}

// Will retrieve like, bookmark and archive status accordingly based on author id given
func (threadService *ThreadService) GetThreadExpandedByID(threadID int, userAuthorID int, commentSortIndex int) (*dtos.ThreadDTO, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	authorRepository := &repositories.AuthorRepository{DB: threadService.DB}
	likeRepository := &repositories.LikeRepository{DB: threadService.DB}
	commentRepository := &repositories.CommentRepository{DB: threadService.DB}
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: threadService.DB}
	archiveRepository := &repositories.ArchiveRepository{DB: threadService.DB}

	// Retrieve expanded thread information
	threadExpanded := new(dtos.ThreadDTO)
	thread, err := threadRepository.GetThreadByID(threadID)
	copier.Copy(threadExpanded, thread)

	if err != nil {
		// Check for thread not found error
		if err == sql.ErrNoRows {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No thread found for thread id: %v", threadID),
			}
		}
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Retrieve author information (check if thread author is user)
	author, err := authorRepository.GetAuthorByID(thread.AuthorID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	isUser := thread.AuthorID == userAuthorID
	author.IsUser = &isUser
	threadExpanded.Author = author

	// Retrieve commentCount
	commentCount, err := commentRepository.CountCommentsByThreadID(threadID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	threadExpanded.CommentCount = &commentCount

	// Retrieve like, bookmark, archive status
	likeStatus := likeRepository.GetLikeStatusByThreadIDAuthorID(threadExpanded.ThreadID, userAuthorID)
	threadExpanded.LikeStatus = &likeStatus
	bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(threadExpanded.ThreadID, userAuthorID)
	threadExpanded.BookmarkStatus = &bookmarkStatus
	archiveStatus := archiveRepository.GetArchiveStatusByThreadIDAuthorID(threadExpanded.ThreadID, userAuthorID)
	threadExpanded.ArchiveStatus = &archiveStatus

	// Retrieve comments
	comments, err := commentRepository.GetCommentsByThreadID(threadID, commentSortIndex)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	threadExpanded.Comments = comments

	// Retrieve topics tagged
	topics, err := topicRepository.GetTopicsByThreadID(threadID)
	threadExpanded.TopicsTagged = topics
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return threadExpanded, nil
}

func (threadService *ThreadService) GetThreadsByAuthorID(authorID int) ([]*dtos.ThreadDTO, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	authorRepository := &repositories.AuthorRepository{DB: threadService.DB}

	threads, err := threadRepository.GetThreadsByAuthorID(authorID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Retrieve the topics array for each thread
	threadsWithTopics := make([]*dtos.ThreadDTO, 0)
	for _, thread := range threads {
		topics, err := topicRepository.GetTopicsByThreadID(thread.ThreadID)
		thread.TopicsTagged = topics
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		thread.Content = utils.TruncateString(thread.Content, 10)
		thread.Author.Name = authorRepository.GetAuthorNameByAuthorID(thread.Author.AuthorID)
		threadsWithTopics = append(threadsWithTopics, thread)
	}

	return threadsWithTopics, nil
}

func (threadService *ThreadService) GetThreadsByTopicID(topicID int, userAuthorID int) (*dtos.TopicDTO, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: threadService.DB}
	archiveRepository := &repositories.ArchiveRepository{DB: threadService.DB}
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}

	topic, err := topicRepository.GetTopicByID(topicID, userAuthorID)
	if err != nil || err == sql.ErrNoRows {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "TOPIC_DOES_NOT_EXIST",
			Message:   fmt.Sprintf("No topics found with topic id: %v", topicID),
		}
	}

	threads, err := threadRepository.GetThreadsByTopicID(topicID)

	// Check for internal server errors
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	for _, thread := range threads {
		// Truncate content
		thread.Content = utils.TruncateString(thread.Content, 10)
		// Get bookmark and archive status
		bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
		thread.BookmarkStatus = &bookmarkStatus
		archiveStatus := archiveRepository.GetArchiveStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
		thread.ArchiveStatus = &archiveStatus
	}

	topic.Threads = threads
	return topic, nil

}

// Create a new thread and add it to the topics tagged (if any)
func (threadService *ThreadService) CreateThread(thread *models.Thread) *dtos.Error {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}

	threadID, err := threadRepository.CreateThread(thread)

	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// For each topic listed, check if it exists in the db and then match it to the thread being created
	topicNames := thread.TopicsTagged
	for _, topicName := range topicNames {
		topic, err := topicRepository.GetTopicByName(topicName)
		// If there is no topic with matching name found, create it
		if topic == nil || err == sql.ErrNoRows {
			topicRepository.CreateTopic(&models.Topic{Name: topicName})
		}
		topic, _ = topicRepository.GetTopicByName(topicName)
		// Link the topic to the thread created
		responseErr := threadService.AddThreadToTopic(threadID, topic.TopicID)
		if responseErr != nil {
			return responseErr
		}
	}
	return nil
}

func (threadService *ThreadService) UpdateThread(thread *models.Thread, threadID int) *dtos.Error {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}

	err := threadRepository.UpdateThread(thread, threadID)

	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (threadService *ThreadService) DeleteAllThreads() error {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.DeleteAllThreads()
}

func (threadService *ThreadService) DeleteThreadByID(threadID int) (int, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.DeleteThreadByID(threadID)
}

func (threadService *ThreadService) GetAllThreadTopicJunctions() ([]*models.ThreadTopicJunction, error) {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: threadService.DB}
	return threadTopicJunctionRepository.GetAllThreadTopicJunctions()
}

func (threadService *ThreadService) AddThreadToTopic(threadID int, topicID int) *dtos.Error {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: threadService.DB}
	err := threadTopicJunctionRepository.AddThreadToTopic(threadID, topicID)
	if err != nil {
		// Thread-Topic Combination already exists
		if err.Error() == "pq: duplicate key value violates unique constraint \"threadtopicjunction_thread_id_topic_id_key\"" {

			return &dtos.Error{
				Status:    "error",
				ErrorCode: "THREADTOPICJUNCTION_ALREADY_EXISTS",
				Message:   fmt.Sprintf("Thread of thread id: %v is already added to topic id %v", threadID, topicID),
			}
		}
		// Thread does not exist
		if err.Error() == "pq: insert or update on table \"threadtopicjunction\" violates foreign key constraint \"threadtopicjunction_thread_id_fkey\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "THREAD_DOES_NOT_EXIST",
				Message:   fmt.Sprintf("Error associating thread with topic, thread of thread id: %v does not exist", threadID),
			}
		}
		// Topic does not exist
		if err.Error() == "pq: insert or update on table \"threadtopicjunction\" violates foreign key constraint \"threadtopicjunction_topic_id_fkey\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "TOPIC_DOES_NOT_EXIST",
				Message:   fmt.Sprintf("Error associating thread with topic, topic of topic id: %v does not exist", topicID),
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
