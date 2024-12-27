package services

import (
	"database/sql"
	"github.com/grenn24/simple-web-forum/models"
)

type TopicService struct {
	DB *sql.DB
}

func (topicService *TopicService) GetAllTopics() ([]*models.Topic, error) {
	rows, err := topicService.DB.Query("SELECT * FROM topic")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var topics []*models.Topic

	for rows.Next() {
		// Declare a pointer to a new instance of a topic struct
		topic := new(models.Topic)

		// Scan the current row into the topic struct
		err := rows.Scan(
			&topic.TopicID,
			&topic.Name,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned topic to topics slice
		topics = append(topics, topic)
	}

	return topics, err
}

func (topicService *TopicService) GetTopicsByThreadID(threadID string) ([]*models.Topic, error) {

	rows, err := topicService.DB.Query(`
		SELECT topic.topic_id, topic.name
		FROM threadTopicJunction
		INNER JOIN topic ON threadTopicJunction.topic_id = topic.topic_id
		WHERE threadTopicJunction.thread_id = $1
	`, threadID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var topics []*models.Topic

	for rows.Next() {
		// Declare a pointer to a new instance of a topic struct
		topic := new(models.Topic)

		// Scan the current row into the topic struct
		err := rows.Scan(
			&topic.TopicID,
			&topic.Name,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned topic to topics slice
		topics = append(topics, topic)
	}

	return topics, err
}

func (topicService *TopicService) CreateTopic(topic *models.Topic) (error)  {

	_, err := topicService.DB.Exec("INSERT INTO topic (name) VALUES ($1)", topic.Name)

	return err
}
