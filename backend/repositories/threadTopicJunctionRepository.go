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

func (ThreadTopicJunctionRepository *ThreadTopicJunctionRepository) RemoveThreadFromTopic(threadID int, topicID int) (int, error) {
		result, err := ThreadTopicJunctionRepository.DB.Exec("DELETE FROM threadTopicJunction WHERE thread_id = $1 AND topic_id = $2", threadID, topicID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}

func (ThreadTopicJunctionRepository *ThreadTopicJunctionRepository) RemoveThreadFromAllTopics(threadID int) (int, error) {
		result, err := ThreadTopicJunctionRepository.DB.Exec("DELETE FROM threadTopicJunction WHERE thread_id = $1", threadID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}
