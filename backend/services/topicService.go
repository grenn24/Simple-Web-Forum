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

func (topicService *TopicService) GetTopicsByThreadID(threadID string) ([]*models.Topic, error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	return topicRepository.GetTopicsByThreadID(threadID)
}

func (topicService *TopicService) GetAllTopicsWithThreads(authorID int) (dtos.TopicsWithThreads, *dtos.Error) {
	topicRepository := &repositories.TopicRepository{DB: topicService.DB}
	threadRepository := &repositories.ThreadRepository{DB: topicService.DB}

	var topicsWithThreads dtos.TopicsWithThreads

	// Retrieve all topics
	topics, err := topicRepository.GetAllTopicsWithFollowStatus(authorID)

	if err != nil {
		return nil, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}

	// For each topic, retrieve the threads associated with it
	for index := range topics {

		threads, err := threadRepository.GetThreadsByTopicID(topics[index].TopicID)

		if err != nil {
			return nil, &dtos.Error{
				Status:    "error",
				ErrorCode: "INTERNAL_SERVER_ERROR",
				Message:   err.Error(),
			}
		}

		var threadsDTO []*dtos.Thread

		// Copy the threads to the thread dto
		for _, thread := range threads {
			threadDTO := &dtos.Thread{}
			err = copier.Copy(threadDTO, thread)

			// Assign the remaining fields
			threadDTO.ContentSummarised = utils.TruncateString(thread.Content, 10)


			threadsDTO = append(threadsDTO, threadDTO)

			if err != nil {
				return nil, &dtos.Error{
					Status:    "error",
					ErrorCode: "INTERNAL_SERVER_ERROR",
					Message:   err.Error(),
				}
			}
		}

		topicWithThreads := &dtos.TopicWithThreads{
			TopicID: topics[index].TopicID,
			Name:    topics[index].Name,
			FollowStatus: topics[index].FollowStatus,
			Threads: threadsDTO,
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
