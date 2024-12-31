package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/models"
)

type ThreadTopicJunctionRepository struct {
	DB *sql.DB
}

func (ThreadTopicJunctionRepository *ThreadTopicJunctionRepository) GetAllThreadTopicJunctions() ([]*models.ThreadTopicJunction, error) {
rows, err := ThreadTopicJunctionRepository.DB.Query("SELECT * FROM threadTopicJunction")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var threadTopicJunctions []*models.ThreadTopicJunction

	for rows.Next() {
		// Declare a pointer to a new instance of a threadTopicJunction struct
		threadTopicJunction := new(models.ThreadTopicJunction)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&threadTopicJunction.ThreadTopicJunctionID,
			&threadTopicJunction.ThreadID,
			&threadTopicJunction.TopicID,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned threadTopicJunction to the threadTopicJunctions slice
		threadTopicJunctions = append(threadTopicJunctions, threadTopicJunction)
	}

	return threadTopicJunctions, err
}

func (ThreadTopicJunctionRepository *ThreadTopicJunctionRepository) AddThreadToTopic(threadID int, topicID int) (error) {

	_, err := ThreadTopicJunctionRepository.DB.Exec("INSERT INTO threadTopicJunction (thread_id, topic_id) VALUES ($1, $2)", threadID, topicID)

	return err
}
