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

func (threadService *ThreadService) GetThreadExpandedByID(threadID int, userAuthorID int) (*dtos.ThreadExpanded, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	authorRepository := &repositories.AuthorRepository{DB: threadService.DB}
	likeRepository := &repositories.LikeRepository{DB: threadService.DB}
	commentRepository := &repositories.CommentRepository{DB: threadService.DB}
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: threadService.DB}
	archiveRepository := &repositories.ArchiveRepository{DB: threadService.DB}

	// Retrieve expanded thread information
	threadExpanded := new(dtos.ThreadExpanded)
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

	// Retrieve author information
	authorMinimised := new(dtos.AuthorMinimised)
	author := new(models.Author)
	author, err = authorRepository.GetAuthorByID(thread.AuthorID)
	authorMinimised.AuthorID = author.AuthorID
	authorMinimised.AuthorName = author.Name
	authorMinimised.AvatarIconLink = author.AvatarIconLink
	threadExpanded.Author = *authorMinimised
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Retrieve commentCount
	commentCount, err := commentRepository.CountCommentsByThreadID(threadID)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	threadExpanded.CommentCount = commentCount

	// Retrieve like, bookmark, archive status
	threadExpanded.LikeStatus = likeRepository.GetLikeStatusByThreadIDAuthorID(threadExpanded.ThreadID, userAuthorID)
	bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(threadExpanded.ThreadID, userAuthorID)
	threadExpanded.BookmarkStatus = &bookmarkStatus
	archiveStatus := archiveRepository.GetArchiveStatusByThreadIDAuthorID(threadExpanded.ThreadID, userAuthorID)
	threadExpanded.ArchiveStatus = &archiveStatus

	// Retrieve comments
	comments, err := commentRepository.GetCommentsByThreadID(threadID, "")
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

func (threadService *ThreadService) GetThreadsByAuthorID(authorID int) ([]*dtos.ThreadGridCard, *dtos.Error) {
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
	threadsWithTopics := make([]*dtos.ThreadGridCard, 0)
	for _, thread := range threads {
		threadWithTopics := new(dtos.ThreadGridCard)
		copier.Copy(threadWithTopics, thread)
		topics, err := topicRepository.GetTopicsByThreadID(thread.ThreadID)
		threadWithTopics.TopicsTagged = topics
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		threadWithTopics.ContentSummarised = utils.TruncateString(thread.Content, 10)
		threadWithTopics.AuthorName = authorRepository.GetAuthorNameByAuthorID(thread.AuthorID)
		threadsWithTopics = append(threadsWithTopics, threadWithTopics)
	}

	return threadsWithTopics, nil
}

func (threadService *ThreadService) GetThreadsByTopicID(topicID int) ([]*dtos.ThreadGridCard, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.GetThreadsByTopicID(topicID)
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

	// Create thread topic links (add thread to multiple topics)
	topicNames := thread.TopicsTagged
	for _, topicName := range topicNames {
		topic, err := topicRepository.GetTopicByName(topicName)
		// If there is no topic with matching name found
		if topic == nil || err == sql.ErrNoRows {
			// Create new topic
			topicRepository.CreateTopic(&models.Topic{Name: topicName})
		}
		topic, _ = topicRepository.GetTopicByName(topicName)
		// Create thread topic link
		responseErr := threadService.AddThreadToTopic(threadID, topic.TopicID)
		if responseErr != nil {
			return responseErr
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
