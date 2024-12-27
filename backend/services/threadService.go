package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/models"
)

type ThreadService struct {
	DB *sql.DB
}

func (threadService *ThreadService) GetAllThreads() ([]*models.Thread, error) {

	rows, err := threadService.DB.Query("SELECT * FROM thread")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var threads []*models.Thread

	for rows.Next() {
		// Declare a pointer to a new instance of a thread struct
		thread := new(models.Thread)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&thread.ThreadID,
			&thread.Title,
			&thread.CreatedAt,
			&thread.Content,
			&thread.AuthorID,
			&thread.ImageTitle,
			&thread.ImageLink,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned thread to threads slice
		threads = append(threads, thread)
	}

	return threads, err

}

func (threadService *ThreadService) GetThreadByID(threadID string) (*models.Thread, error) {

	row := threadService.DB.QueryRow("SELECT * FROM thread WHERE thread_id = $1", threadID)

	// Declare a pointer to a new instance of a thread struct
	thread := new(models.Thread)

	// Scan the current row into the thread struct
	err := row.Scan(
		&thread.ThreadID,
		&thread.Title,
		&thread.CreatedAt,
		&thread.Content,
		&thread.AuthorID,
		&thread.ImageTitle,
		&thread.ImageLink,
	)

	return thread, err
}

func (threadService *ThreadService) GetThreadsByAuthorID(authorID string) ([]*models.Thread, error) {

	rows, err := threadService.DB.Query("SELECT * FROM thread WHERE author_id = " + authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var threads []*models.Thread

	for rows.Next() {
		// Declare a pointer to a new instance of a thread struct
		thread := new(models.Thread)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&thread.ThreadID,
			&thread.Title,
			&thread.CreatedAt,
			&thread.Content,
			&thread.AuthorID,
			&thread.ImageTitle,
			&thread.ImageLink,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned thread to threads slice
		threads = append(threads, thread)
	}

	return threads, err
}

func (threadService *ThreadService) GetThreadsByTopicID(topicID string) ([]*models.Thread, error) {
	rows, err := threadService.DB.Query(`
		SELECT
			thread.thread_id,
			thread.title,
			thread.created_at,
			thread.content,
			thread.author_id,
			thread.image_title,
			thread.image_link
		FROM threadTopicJunction
		INNER JOIN thread ON threadTopicJunction.thread_id = thread.thread_id
		WHERE threadTopicJunction.topic_id = $1
	`, topicID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var threads []*models.Thread

	for rows.Next() {
		// Declare a pointer to a new instance of a thread struct
		thread := new(models.Thread)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&thread.ThreadID,
			&thread.Title,
			&thread.CreatedAt,
			&thread.Content,
			&thread.AuthorID,
			&thread.ImageTitle,
			&thread.ImageLink,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned thread to threads slice
		threads = append(threads, thread)
	}

	return threads, err
}

func (threadService *ThreadService) CreateThread(thread *models.Thread) error {

	_, err := threadService.DB.Exec("INSERT INTO thread (title, content, author_id, image_title, image_link) VALUES ($1, $2, $3, $4, $5)", thread.Title, thread.Content, thread.AuthorID, thread.ImageTitle, thread.ImageLink)

	return err
}

func (threadService *ThreadService) DeleteAllThreads() error {

	_, err := threadService.DB.Exec("DELETE FROM Thread")

	return err
}

func (threadService *ThreadService) DeleteThreadByID(threadID string) (int64, error) {

	result, err := threadService.DB.Exec("DELETE FROM thread WHERE thread_id = $1", threadID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return rowsDeleted, err

}
