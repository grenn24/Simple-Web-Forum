package repositories

import (
	"database/sql"
	"fmt"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/lib/pq"
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

	threads := make([]*models.Thread, 0)

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
			pq.Array(&thread.ImageLink),
			&thread.LikeCount,
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
		pq.Array(&thread.ImageLink),
		&thread.LikeCount,
	)

	return thread, err
}

func (threadRepository *ThreadRepository) GetThreadsByAuthorID(authorID int) ([]*dtos.ThreadDTO, error) {
	rows, err := threadRepository.DB.Query(fmt.Sprintf(`
		SELECT thread.thread_id, thread.title, thread.created_at, thread.content, thread.author_id, thread.image_title, thread.image_link, thread.like_count,
		CASE 
			WHEN thread_archive.thread_id IS NOT NULL AND thread_archive.author_id IS NOT NULL 
			THEN TRUE 
			ELSE FALSE 
		END AS archive_status
		FROM thread
		LEFT JOIN thread_archive ON thread_archive.thread_id = thread.thread_id AND thread_archive.author_id = thread.author_id
		WHERE thread.author_id = %v
		ORDER BY thread.created_at DESC
	`, authorID))

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	threads := make([]*dtos.ThreadDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a thread struct
		thread := new(dtos.ThreadDTO)

		thread.Author = new(dtos.AuthorDTO)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&thread.ThreadID,
			&thread.Title,
			&thread.CreatedAt,
			&thread.Content,
			&thread.Author.AuthorID,
			&thread.ImageTitle,
			pq.Array(&thread.ImageLink),
			&thread.LikeCount,
			&thread.ArchiveStatus,
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

func (threadRepository *ThreadRepository) GetThreadsByTopicID(topicID int) ([]*dtos.ThreadDTO, error) {
	rows, err := threadRepository.DB.Query(`
		SELECT
			thread.thread_id,
			thread.title,
			thread.created_at,
			thread.content,
			thread.author_id,
			author.name,
			author.username,
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

	threads := make([]*dtos.ThreadDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a thread with author name struct
		thread := new(dtos.ThreadDTO)

		thread.Author = new(dtos.AuthorDTO)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&thread.ThreadID,
			&thread.Title,
			&thread.CreatedAt,
			&thread.Content,
			&thread.Author.AuthorID,
			&thread.Author.Name,
			&thread.Author.Username,
			&thread.Author.AvatarIconLink,
			&thread.ImageTitle,
			pq.Array(&thread.ImageLink),
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

func (threadRepository *ThreadRepository) IncrementLikeCountByThreadID(threadID int) error {
	_, err := threadRepository.DB.Exec(`
		UPDATE thread
		SET like_count = like_count + 1
		WHERE thread_id = $1
	`, threadID)

	return err
}

func (threadRepository *ThreadRepository) DecrementLikeCountByThreadID(threadID int) error {
	_, err := threadRepository.DB.Exec(`
		UPDATE thread
		SET like_count = like_count - 1
		WHERE thread_id = $1
	`, threadID)

	return err
}

func (threadRepository *ThreadRepository) GetLikeCountByThreadID(threadID int) int {
	var likeCount int
	row := threadRepository.DB.QueryRow("SELECT like_count FROM thread WHERE thread_id = $1", threadID)
	row.Scan(&likeCount)
	return likeCount
}

func (threadRepository *ThreadRepository) GetImageLinkByThreadID(threadID int) []string {
	var imageLink []string
	row := threadRepository.DB.QueryRow("SELECT image_link FROM thread WHERE thread_id = $1", threadID)
	err := row.Scan(pq.Array(&imageLink))

	// No image links found
	if err != nil || err == sql.ErrNoRows {

		return []string{}
	}
	return imageLink
}

func (threadRepository *ThreadRepository) CreateThread(thread *models.Thread) (int, error) {
	var threadID int64
	row := threadRepository.DB.QueryRow("INSERT INTO thread (title, content, author_id, image_title, image_link) VALUES ($1, $2, $3, $4, $5) RETURNING thread_id", thread.Title, thread.Content, thread.AuthorID, thread.ImageTitle, pq.Array(thread.ImageLink))

	// Check for errors while returning thread id
	err := row.Scan(&threadID)
	return int(threadID), err
}

func (threadRepository *ThreadRepository) UpdateThread(thread *models.Thread, threadID int) error {
	_, err := threadRepository.DB.Exec(`
		UPDATE thread
		SET title = $1, content = $2
		WHERE thread_id = $3
	`, thread.Title, thread.Content, threadID)
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
