package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
	"github.com/grenn24/simple-web-forum/utils"
	"github.com/jinzhu/copier"
)

type TopicService struct {
	DB *sql.DB
}

func (topicService *TopicService) GetAllTopics() ([]*models.Topic, error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}

	return topicRepository.GetAllTopics()
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

func (topicService *TopicService) GetAllTopicsWithThreads(authorID int) ([]*dtos.TopicWithThreads, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	threadRepository := &repositories.ThreadRepository{DB: topicService.DB}

	topicsWithThreads := make([]*dtos.TopicWithThreads, 0)

	// Retrieve all topics with follow status
	topics, err := topicRepository.GetAllTopicsWithFollowStatus(authorID)

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

		threadGridCards := make([]*dtos.ThreadGridCard, 0)

		// Copy the threads to the thread grid card dto
		for _, thread := range threads {
			threadGridCard := new(dtos.ThreadGridCard)
			err = copier.Copy(threadGridCard, thread)

			// Assign the remaining fields
			threadGridCard.ContentSummarised = utils.TruncateString(thread.ContentSummarised, 10)

			threadGridCards = append(threadGridCards, threadGridCard)

			if err != nil {
				return nil, &dtos.Error{
					Status:    "error",
					ErrorCode: "INTERNAL_SERVER_ERROR",
					Message:   err.Error(),
				}
			}
		}

		topicWithThreads := &dtos.TopicWithThreads{
			TopicID:      topic.TopicID,
			Name:         topic.Name,
			FollowStatus: topic.FollowStatus,
			Threads:      threadGridCards,
		}
		topicsWithThreads = append(topicsWithThreads, topicWithThreads)
	}

	return topicsWithThreads, nil
}

func (topicService *TopicService) GetAllTopicsWithFollowStatus(authorID int) ([]*dtos.TopicWithFollowStatus, error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	return topicRepository.GetAllTopicsWithFollowStatus(authorID)
}

func (topicService *TopicService) CreateTopic(topic *models.Topic) error {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	return topicRepository.CreateTopic(topic)
}

func (topicService *TopicService) GetAllThreadTopicJunctions() ([]*models.ThreadTopicJunction, error) {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: topicService.DB}
	return threadTopicJunctionRepository.GetAllThreadTopicJunctions()
}

func (topicService *TopicService) AddThreadToTopic(threadID string, topicID string) error {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: topicService.DB}
	return threadTopicJunctionRepository.AddThreadToTopic(threadID, topicID)
}
