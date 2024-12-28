package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
)

type TopicService struct {
	DB *sql.DB
}

func (topicService *TopicService) GetAllTopics() ([]*models.Topic, error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}

	return topicRepository.GetAllTopics()
}

func (topicService *TopicService) GetTopicsByThreadID(threadID string) ([]*models.Topic, error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	return topicRepository.GetTopicsByThreadID(threadID)
}

func (topicService *TopicService) GetAllTopicsWithThreads() ([]*dtos.TopicsWithThreads, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	threadRepository := &repositories.ThreadRepository{DB: topicService.DB}

	var topicsWithThreads dtos.TopicsWithThreads

	topics, err := topicRepository.GetAllTopics()

	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// Retrieve all topics from database
	for index := range topics {
		// Retrieve threads with that topic
		threads, err := threadRepository.GetThreadsByTopicID(topics[index].TopicID)
		
		topicWithThreads := &dtos.TopicWithThreads{
			TopicID: topics[index].TopicID,
			Name:    topics[index].Name,
		}
		topicsWithThreads = append(topicsWithThreads, topicWithThreads)
	}
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
