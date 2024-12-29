package repositories

import (
	"database/sql"
	"fmt"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
)

type ThreadRepository struct {
	DB *sql.DB
}

func (threadRepository *ThreadRepository) GetAllThreads() ([]*models.Thread, error) {
	rows, err := threadRepository.DB.Query("SELECT * FROM thread")

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

func (threadRepository *ThreadRepository) GetThreadByID(threadID int) (*models.Thread, error) {
	row := threadRepository.DB.QueryRow("SELECT * FROM thread WHERE thread_id = $1", threadID)

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


func (threadRepository *ThreadRepository) GetThreadsByAuthorID(authorID int) ([]*models.Thread, error) {
	rows, err := threadRepository.DB.Query(fmt.Sprintf("SELECT * FROM thread WHERE author_id = %v", authorID))

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

func (threadRepository *ThreadRepository) GetThreadsByTopicID(topicID int) ([]*dtos.ThreadWithAuthorName, error) {
	rows, err := threadRepository.DB.Query(`
		SELECT
			thread.thread_id,
			thread.title,
			thread.created_at,
			thread.content,
			thread.author_id,
			author.name,
			author.avatar_icon_link,
			thread.image_title,
			thread.image_link
		FROM threadTopicJunction
		INNER JOIN thread ON threadTopicJunction.thread_id = thread.thread_id
		INNER JOIN author ON thread.author_id = author.author_id
		WHERE threadTopicJunction.topic_id = $1
	`, topicID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var threads []*dtos.ThreadWithAuthorName

	for rows.Next() {
		// Declare a pointer to a new instance of a thread with author name struct
		thread := new(dtos.ThreadWithAuthorName)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&thread.ThreadID,
			&thread.Title,
			&thread.CreatedAt,
			&thread.Content,
			&thread.AuthorID,
			&thread.AuthorName,
			&thread.AvatarIconLink,
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

func (threadRepository *ThreadRepository) CreateThread(thread *models.Thread) error {
	_, err := threadRepository.DB.Exec("INSERT INTO thread (title, content, author_id, image_title, image_link) VALUES ($1, $2, $3, $4, $5)", thread.Title, thread.Content, thread.AuthorID, thread.ImageTitle, thread.ImageLink)

	return err
}

func (threadRepository *ThreadRepository) DeleteAllThreads() error {
	_, err := threadRepository.DB.Exec("DELETE FROM Thread")

	return err
}

func (threadRepository *ThreadRepository) DeleteThreadByID(threadID int) (int, error) {
	result, err := threadRepository.DB.Exec("DELETE FROM thread WHERE thread_id = $1", threadID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}
