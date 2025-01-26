package services

import (
	"database/sql"
	"fmt"
	"sync"

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
	discussionRepository := &repositories.DiscussionRepository{DB: threadService.DB}

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

	// Retrieve discussion
	discussion, err := discussionRepository.GetDiscussionByThreadID(thread.ThreadID, userAuthorID)
	if err != nil {
		if err == sql.ErrNoRows {
			threadExpanded.Discussion = nil
		}
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	} else {
		threadExpanded.Discussion = discussion
	}

	return threadExpanded, nil
}

func (threadService *ThreadService) GetThreadsByAuthorID(authorID int, userAuthorID int) ([]*dtos.ThreadDTO, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	authorRepository := &repositories.AuthorRepository{DB: threadService.DB}

	threads, err := threadRepository.GetThreadsByAuthorID(authorID, userAuthorID)
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

		thread.Author.Name = authorRepository.GetAuthorNameByAuthorID(thread.Author.AuthorID)
		thread.Author.Username = authorRepository.GetAuthorUsernameByAuthorID(thread.Author.AuthorID)
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

		// Get bookmark and archive status
		bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
		thread.BookmarkStatus = &bookmarkStatus
		archiveStatus := archiveRepository.GetArchiveStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
		thread.ArchiveStatus = &archiveStatus
	}

	topic.Threads = threads
	return topic, nil
}

// User's author id used to retrieve like, bookmark, isUser status
func (threadService *ThreadService) GetTrendingThreads(userAuthorID int, page int, limit int) ([]*dtos.ThreadDTO, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}
	likeRepository := &repositories.LikeRepository{DB: threadService.DB}
	bookmarkRepository := &repositories.BookmarkRepository{DB: threadService.DB}

	threads, err := threadRepository.GetTrendingThreads(userAuthorID, page, limit)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	for _, thread := range threads {
		// Retrieve topics for each thread
		topics, err := topicRepository.GetTopicsByThreadID(thread.ThreadID)
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		thread.TopicsTagged = topics
		// Retrieve like, bookmark, isUser status
		threadAuthorIsUser := thread.Author.AuthorID == userAuthorID
		thread.Author.IsUser = &threadAuthorIsUser
		likeStatus := likeRepository.GetLikeStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
		thread.LikeStatus = &likeStatus
		bookmarkStatus := bookmarkRepository.GetBookmarkStatusByThreadIDAuthorID(thread.ThreadID, userAuthorID)
		thread.BookmarkStatus = &bookmarkStatus
	}
	return threads, nil
}

func (threadService *ThreadService) SearchThreads(userAuthorID int, query string, page int, limit int, sortIndex int) ([]*dtos.ThreadDTO, *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}

	threads, err := threadRepository.SearchThreads(userAuthorID, query, page, limit, sortIndex)
	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	for _, thread := range threads {
		// Truncate image links slice to max 1 element
		if len(thread.ImageLink) != 0 {
			thread.ImageLink = thread.ImageLink[:1]
		}
		// Retrieve topics for each thread
		topics, err := topicRepository.GetTopicsByThreadID(thread.ThreadID)
		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}
		thread.TopicsTagged = topics
	}
	return threads, nil
}

// Create a new thread and add it to the topics tagged (if any)
func (threadService *ThreadService) CreateThread(thread *models.Thread, progressChannel chan float64, errorChannel chan *dtos.Error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}

	// Create an instance of the s3 bucket utility struct
	awsS3Bucket := &utils.AwsS3Bucket{
		ProgressChannel: progressChannel,
		ErrorChannel:    errorChannel,
	}

	progressChannel <- 0
	fmt.Println("progress channel 0")

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		videoUrls := awsS3Bucket.PostFileHeadersToS3Bucket(thread.Video, "thread_video")
		thread.VideoLink = videoUrls
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		imageUrls := awsS3Bucket.PostFileHeadersToS3Bucket(thread.Image, "thread_image")
		thread.ImageLink = imageUrls
	}()

	wg.Wait()
	threadID, err := threadRepository.CreateThread(thread)

	// Check for internal server errors
	if err != nil {
		fmt.Println(err)
		errorChannel <- &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	fmt.Println("thread created")

	progressChannel <- 95

	// For each topic listed, check if it exists in the db and then match it to the thread being created
	topicNames := thread.TopicsTagged
	for _, topicName := range topicNames {

		topic, err := topicRepository.GetTopicByName(topicName)
		// If there is no topic with matching name found, create it, and retrieve it again
		if err == sql.ErrNoRows {
			topicRepository.CreateTopic(&models.Topic{Name: topicName})
			topic, _ = topicRepository.GetTopicByName(topicName)
		}

		// Link the topic to the thread created
		responseErr := threadService.AddThreadToTopic(threadID, topic.TopicID)
		if responseErr != nil {
			fmt.Println(responseErr)
			errorChannel <- responseErr
		}

	}

	progressChannel <- 100
	fmt.Println("progress channel 100")

}

func (threadService *ThreadService) UpdateThread(thread *models.Thread, threadID int) *dtos.Error {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	topicRepository := &repositories.TopicRepository{DB: threadService.DB}

	threadService.RemoveThreadFromAllTopics(threadID)

	for _, topicName := range thread.TopicsTagged {
		topic, err := topicRepository.GetTopicByName(topicName)
		if err == sql.ErrNoRows {
			topicRepository.CreateTopic(&models.Topic{Name: topicName})
			topic, _ = topicRepository.GetTopicByName(topicName)
		}
		// Link the topic to the thread created
		responseErr := threadService.AddThreadToTopic(threadID, topic.TopicID)
		if responseErr != nil {
			return responseErr
		}
	}

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

func (threadService *ThreadService) DeleteThreadByID(threadID int) *dtos.Error {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}

	// Create an errors channel
	var wg sync.WaitGroup
	errsChannel := make(chan *dtos.Error)
	responseErrs := make([]*dtos.Error, 0)

	// Continuously collect the errors from the error channel into responseErrs slice
	go func(errsChannel chan *dtos.Error, responseErrs []*dtos.Error) {
		for err := range errsChannel {
			responseErrs = append(responseErrs, err)
		}
	}(errsChannel, responseErrs)

	// Check if thread to be deleted has image link(s) and video link(s), and delete if them from s3 if exist(s)
	thread, err := threadRepository.GetThreadByID(threadID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	// For each imagelink, create a goroutine
	for _, imageLink := range thread.ImageLink {
		//Add a goroutine to the waitgroup
		wg.Add(1)
		go func(imageLink string, errChannel chan *dtos.Error) {
			defer wg.Done()
			err := utils.DeleteFileFromS3Bucket(imageLink)
			if err != nil {
				errsChannel <- &dtos.Error{
					Status:    "error",
					ErrorCode: "INTERNAL_SERVER_ERROR",
					Message:   err.Error(),
				}
			}
		}(imageLink, errsChannel)
	}
	for _, videoLink := range thread.VideoLink {
		//Add a goroutine to the waitgroup
		wg.Add(1)
		go func(imageLink string, errChannel chan *dtos.Error) {
			defer wg.Done()
			err := utils.DeleteFileFromS3Bucket(videoLink)
			if err != nil {
				errsChannel <- &dtos.Error{
					Status:    "error",
					ErrorCode: "INTERNAL_SERVER_ERROR",
					Message:   err.Error(),
				}
			}
		}(videoLink, errsChannel)
	}

	// Wait for all goroutines to finish before closing the channel and executing the rest
	wg.Wait()
	close(errsChannel)

	if len(responseErrs) != 0 {
		return responseErrs[0]
	}

	rowsDeleted, err := threadRepository.DeleteThreadByID(threadID)
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
			Message:   fmt.Sprintf("No threads found with thread id: %v", threadID),
		}
	}
	return nil
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

func (threadService *ThreadService) RemoveThreadFromTopic(threadID int, topicID int) *dtos.Error {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: threadService.DB}
	rowsDeleted, err := threadTopicJunctionRepository.RemoveThreadFromTopic(threadID, topicID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   fmt.Sprintf("No threads with thread id %v is currently added to topic with topic id %v", threadID, topicID),
		}
	}
	return nil
}

func (threadService *ThreadService) RemoveThreadFromAllTopics(threadID int) *dtos.Error {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: threadService.DB}
	_, err := threadTopicJunctionRepository.RemoveThreadFromAllTopics(threadID)
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	return nil
}
