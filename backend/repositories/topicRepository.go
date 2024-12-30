package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
)

type TopicRepository struct {
	DB *sql.DB
}

func (topicRepository *TopicRepository) GetAllTopics() ([]*models.Topic, error) {
	rows, err := topicRepository.DB.Query("SELECT * FROM topic")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	topics := make([]*models.Topic, 0)

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

func (topicRepository *TopicRepository) GetAllTopicsWithFollowStatus(authorID int) ([]*dtos.TopicWithFollowStatus, error) {
	rows, err := topicRepository.DB.Query(`SELECT DISTINCT topic.topic_id, topic.name,
	CASE 
        WHEN follow.follower_author_id = $1 THEN TRUE
        ELSE FALSE
    END AS follow_status
	FROM topic
	LEFT JOIN follow ON topic.topic_id = follow.followee_topic_id AND follow.follower_author_id = $1`, authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	topics := make([]*dtos.TopicWithFollowStatus, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a topic struct
		topic := new(dtos.TopicWithFollowStatus)

		// Scan the current row into the topic struct
		err := rows.Scan(
			&topic.TopicID,
			&topic.Name,
			&topic.FollowStatus,
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

func (topicRepository *TopicRepository) GetTopicsByThreadID(threadID string) ([]*models.Topic, error) {

	rows, err := topicRepository.DB.Query(`
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

func (topicRepository *TopicRepository) CreateTopic(topic *models.Topic) error {

	_, err := topicRepository.DB.Exec("INSERT INTO topic (name) VALUES ($1)", topic.Name)

	return err
}
