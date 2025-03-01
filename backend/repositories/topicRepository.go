package repositories

import (
	"database/sql"
	"fmt"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
)

type TopicRepository struct {
	DB *sql.DB
}

// user author id used to retrieve follow status
func (topicRepository *TopicRepository) GetAllTopics(userAuthorID int) ([]*dtos.TopicDTO, error) {
	rows, err := topicRepository.DB.Query(`
	SELECT DISTINCT
		topic.topic_id,
		topic.name,
		topic.popularity,
		CASE 
			WHEN follow.follower_author_id = $1 THEN TRUE
			ELSE FALSE
		END AS follow_status
	FROM topic
	LEFT JOIN follow ON topic.topic_id = follow.followee_topic_id AND follow.follower_author_id = $1`, userAuthorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	topics := make([]*dtos.TopicDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a topic struct
		topic := new(dtos.TopicDTO)

		// Scan the current row into the topic struct
		err := rows.Scan(
			&topic.TopicID,
			&topic.Name,
			&topic.Popularity,
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

// user author id used to retrieve follow status
func (topicRepository *TopicRepository) GetTrendingTopics(userAuthorID int) ([]*dtos.TopicDTO, error) {
	rows, err := topicRepository.DB.Query(`
		SELECT
			topic.topic_id,
			topic.name,
			topic.popularity,
			CASE 
				WHEN follow.follower_author_id = $1 THEN TRUE
				ELSE FALSE
			END AS follow_status
		FROM topic
		LEFT JOIN follow ON topic.topic_id = follow.followee_topic_id AND follow.follower_author_id = $1
		WHERE topic.popularity != 0
		ORDER BY topic.popularity DESC
	`, userAuthorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	topics := make([]*dtos.TopicDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a topic struct
		topic := new(dtos.TopicDTO)

		// Scan the current row into the topic struct
		err := rows.Scan(
			&topic.TopicID,
			&topic.Name,
			&topic.Popularity,
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

// user author id used to retrieve follow status
func (topicRepository *TopicRepository) GetTopicByID(topicID int, userAuthorID int) (*dtos.TopicDTO, error) {
	row := topicRepository.DB.QueryRow(`
		SELECT
			topic.topic_id,
			topic.name,
			topic.popularity,
			CASE 
				WHEN follow.follower_author_id = $1 THEN TRUE
				ELSE FALSE
			END AS follow_status
		FROM topic
		LEFT JOIN follow ON topic.topic_id = follow.followee_topic_id AND follow.follower_author_id = $1
		WHERE topic.topic_id = $2
		`, userAuthorID, topicID)

	topic := new(dtos.TopicDTO)

	err := row.Scan(
		&topic.TopicID,
		&topic.Name,
		&topic.Popularity,
		&topic.FollowStatus,
	)

	return topic, err
}

func (topicRepository *TopicRepository) GetTopicsByThreadID(threadID int) ([]*models.Topic, error) {

	rows, err := topicRepository.DB.Query(`
		SELECT
			topic.topic_id,
			topic.name,
			topic.popularity
		FROM threadTopicJunction
		INNER JOIN topic ON threadTopicJunction.topic_id = topic.topic_id
		WHERE threadTopicJunction.thread_id = $1
	`, threadID)

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
			&topic.Popularity,
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

// case insensitive
func (topicRepository *TopicRepository) GetTopicByName(name string) (*models.Topic, error) {

	topic := new(models.Topic)

	err := topicRepository.DB.QueryRow("SELECT * FROM topic WHERE LOWER(name) = LOWER($1)", name).Scan(
		&topic.TopicID,
		&topic.Name,
		&topic.Popularity,
	)

	return topic, err
}

func (topicRepository *TopicRepository) SearchTopics(userAuthorID int, query string, page int, limit int, sortIndex int) ([]*dtos.TopicDTO, error) {
	sortOrder := []string{"topic.name ASC", "thread_count DESC", "thread_count ASC"}

	var limitOffset string
	if limit != 0 {
		limitOffset = fmt.Sprintf(" LIMIT %v", limit)
		if page != 0 {
			limitOffset += fmt.Sprintf(" OFFSET %v", (page-1)*limit)
		}
	}
	rows, err := topicRepository.DB.Query(`
		SELECT
			topic.topic_id,
			topic.name,
			topic.popularity,
			COUNT(thread.thread_id) AS thread_count,
			CASE 
				WHEN follow.follower_author_id = $1 THEN TRUE
				ELSE FALSE
			END AS follow_status
		FROM topic
		LEFT JOIN follow ON topic.topic_id = follow.followee_topic_id AND follow.follower_author_id = $1
		LEFT JOIN threadTopicJunction ON threadTopicJunction.topic_id = topic.topic_id
		LEFT JOIN thread ON threadTopicJunction.thread_id = thread.thread_id
		WHERE topic.name ILIKE $2 OR thread.title ILIKE $2 OR thread.content ILIKE $2
		GROUP BY topic.topic_id, follow.follower_author_id
		ORDER BY
		`+sortOrder[sortIndex]+limitOffset, userAuthorID, "%"+query+"%")

	if err != nil {
		return nil, err
	}
	//Close rows after finishing query
	defer rows.Close()

	topics := make([]*dtos.TopicDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a topic struct
		topic := new(dtos.TopicDTO)

		// Scan the current row into the topic struct
		err := rows.Scan(
			&topic.TopicID,
			&topic.Name,
			&topic.Popularity,
			&topic.ThreadCount,
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

func (topicRepository *TopicRepository) CreateTopic(topic *models.Topic) error {

	_, err := topicRepository.DB.Exec("INSERT INTO topic (name) VALUES ($1)", topic.Name)

	return err
}
