package services

import (
	"database/sql"
	"fmt"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
)

type TopicService struct {
	DB *sql.DB
}

func (topicService *TopicService) GetTopicsByThreadID(threadID int) ([]*models.Topic, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	topics, err := topicRepository.GetTopicsByThreadID(threadID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return topics, nil
}

func (topicService *TopicService) GetTopicByName(name string) (*models.Topic, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	topic, err := topicRepository.GetTopicByName(name)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "NOT_FOUND",
				Message:   fmt.Sprintf("No topics found with name: %v", name),
			}
		}
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return topic, nil
}

// Get all topics with threads tagged to it (author id used to retrieve follow, bookmark, archive status)
func (topicService *TopicService) GetAllTopics(userAuthorID int) ([]*dtos.TopicDTO, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	threadRepository := &repositories.ThreadRepository{DB: topicService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: topicService.DB}
	archiveRepository := &repositories.ArchiveRepository{DB: topicService.DB}
	commentRepository := &repositories.CommentRepository{DB: topicService.DB}

	// Retrieve all topics
	topics, err := topicRepository.GetAllTopics(userAuthorID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// For each topic, retrieve the threads associated with it
	for _, topic := range topics {

		threads, err := threadRepository.GetThreadsByTopicID(topic.TopicID)

		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}

		// For each thread, retrieve other necessary fields
		for _, thread := range threads {
			// Truncate content
			
			// Get bookmark and archive status
			bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
			thread.BookmarkStatus = &bookmarkStatus
			archiveStatus := archiveRepository.GetArchiveStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
			thread.ArchiveStatus = &archiveStatus
			// Get comment count
			commentCount, err := commentRepository.CountCommentsByThreadID(thread.ThreadID)
			if err != nil {
				return nil, &dtos.Error{
					Status:    "error",
					ErrorCode: "INTERNAL_SERVER_ERROR",
					Message:   err.Error(),
				}

			}
			thread.CommentCount = &commentCount
		}
		topic.Threads = threads
	}

	return topics, nil
}

func (topicService *TopicService) GetTrendingTopics(userAuthorID int) ([]*dtos.TopicDTO, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	threadRepository := &repositories.ThreadRepository{DB: topicService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: topicService.DB}
	archiveRepository := &repositories.ArchiveRepository{DB: topicService.DB}
	commentRepository := &repositories.CommentRepository{DB: topicService.DB}

	// Retrieve all topics
	topics, err := topicRepository.GetTrendingTopics(userAuthorID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// For each topic, retrieve the threads associated with it
	for _, topic := range topics {

		threads, err := threadRepository.GetThreadsByTopicID(topic.TopicID)

		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}

		// For each thread, retrieve other necessary fields
		for _, thread := range threads {
			// Truncate content
	
			// Get bookmark and archive status
			bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
			thread.BookmarkStatus = &bookmarkStatus
			archiveStatus := archiveRepository.GetArchiveStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
			thread.ArchiveStatus = &archiveStatus
			// Get comment count
			commentCount, err := commentRepository.CountCommentsByThreadID(thread.ThreadID)
			if err != nil {
				return nil, &dtos.Error{
					Status:    "error",
					ErrorCode: "INTERNAL_SERVER_ERROR",
					Message:   err.Error(),
				}

			}
			thread.CommentCount = &commentCount
		}
		topic.Threads = threads
	}

	return topics, nil
}


func (topicService *TopicService) SearchTopics(userAuthorID int, query string, page int, limit int, sortIndex int) ([]*dtos.TopicDTO, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	threadRepository := &repositories.ThreadRepository{DB: topicService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: topicService.DB}
	archiveRepository := &repositories.ArchiveRepository{DB: topicService.DB}

	topics, err := topicRepository.SearchTopics(userAuthorID, query, page, limit, sortIndex)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// For each topic, retrieve the threads associated with it
	for _, topic := range topics {

		threads, err := threadRepository.GetThreadsByTopicID(topic.TopicID)

		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}

		// For each thread, retrieve other necessary fields
		for _, thread := range threads {
			// Truncate content

			// Get bookmark and archive status
			bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
			thread.BookmarkStatus = &bookmarkStatus
			archiveStatus := archiveRepository.GetArchiveStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
			thread.ArchiveStatus = &archiveStatus
		}

		topic.Threads = threads
	}
	return topics, nil
}

func (topicService *TopicService) CreateTopic(topic *models.Topic) *dtos.Error {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	err := topicRepository.CreateTopic(topic)
	// Check for sql insertion errors
	if err != nil {
		// Check for existing topic name
		if err.Error() == "pq: duplicate key value violates unique constraint \"topic_name_lowercase\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "NAME_ALREADY_EXISTS",
				Message:   "The topic name provided has already been used. (case insensitive)",
			}
		}
		// Internal server error
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil
}

func (topicService *TopicService) CreateMultipleTopics(topics []*models.Topic) *dtos.Error {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	for _, topic := range topics {
		err := topicRepository.CreateTopic(topic)
		// Check for sql insertion errors
		if err != nil {
			// Check for existing topic name
			if err.Error() == "pq: duplicate key value violates unique constraint \"topic_name_lowercase\"" {
				return &dtos.Error{
					Status:    "error",
					ErrorCode: "NAME_ALREADY_EXISTS",
					Message:   "The topic name provided has already been used. (case insensitive)",
				}
			}
			// Internal server error
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
	}
	return nil
}

func (topicService *TopicService) GetAllThreadTopicJunctions() ([]*models.ThreadTopicJunction, error) {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: topicService.DB}
	return threadTopicJunctionRepository.GetAllThreadTopicJunctions()
}

func (topicService *TopicService) AddThreadToTopic(threadID int, topicID int) *dtos.Error {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: topicService.DB}
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
