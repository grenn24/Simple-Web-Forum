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
	rows, err := threadRepository.DB.Query(`
		SELECT
			thread_id,
			title,
			created_at,
			content,
			author_id,
			image_link,
			video_link,
			like_count,
			popularity,
			visibility,
			comment_count
		FROM thread
	`)

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
			pq.Array(&thread.ImageLink),
			pq.Array(&thread.VideoLink),
			&thread.LikeCount,
			&thread.Popularity,
			&thread.Visiblity,
			&thread.CommentCount,
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
	row := threadRepository.DB.QueryRow(`
		SELECT 
			thread_id,
			title,
			created_at,
			content,
			author_id,
			image_link,
			video_link,
			like_count,
			popularity,
			visibility,
			comment_count
		FROM thread
		WHERE thread_id = $1
	 `, threadID)

	// Declare a pointer to a new instance of a thread struct
	thread := new(models.Thread)

	// Scan the current row into the thread struct
	err := row.Scan(
		&thread.ThreadID,
		&thread.Title,
		&thread.CreatedAt,
		&thread.Content,
		&thread.AuthorID,
		pq.Array(&thread.ImageLink),
		pq.Array(&thread.VideoLink),
		&thread.LikeCount,
		&thread.Popularity,
		&thread.Visiblity,
		&thread.CommentCount,
	)

	return thread, err
}

func (threadRepository *ThreadRepository) GetThreadsByAuthorID(authorID int, userAuthorID int) ([]*dtos.ThreadDTO, error) {
	rows, err := threadRepository.DB.Query(fmt.Sprintf(`
		SELECT
			thread.thread_id,
			thread.title,
			thread.created_at,
			thread.content,
			thread.author_id,
			thread.image_link,
			thread.video_link,
			thread.like_count,
			thread.comment_count,
			thread.popularity,
			thread.visibility,
		CASE 
			WHEN thread_archive.thread_id IS NOT NULL AND thread_archive.author_id IS NOT NULL 
			THEN TRUE 
			ELSE FALSE 
		END AS archive_status
		FROM thread
		LEFT JOIN thread_archive ON thread_archive.thread_id = thread.thread_id AND thread_archive.author_id = %v
		WHERE thread.author_id = %v
		ORDER BY thread.created_at DESC
	`, userAuthorID ,authorID))

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
			pq.Array(&thread.ImageLink),
			pq.Array(&thread.VideoLink),
			&thread.LikeCount,
			&thread.CommentCount,
			&thread.Popularity,
			&thread.Visiblity,
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

func (threadRepository *ThreadRepository) GetThreadsByDiscussionID(userAuthorID int, discussionID int, sortIndex int) ([]*dtos.ThreadDTO, error) {
	sortOrder := []string{"thread.popularity DESC","thread.created_at DESC", "thread.created_at ASC"}
	rows, err := threadRepository.DB.Query(fmt.Sprintf(`
		SELECT
			thread.thread_id,
			thread.title,
			thread.created_at,
			thread.content,
			thread.author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			thread.image_link,
			thread.video_link,
			thread.like_count,
			thread.comment_count,
			thread.popularity,
			thread.visibility,
		CASE 
			WHEN thread_archive.thread_id IS NOT NULL AND thread_archive.author_id IS NOT NULL 
			THEN TRUE 
			ELSE FALSE 
		END AS archive_status
		FROM thread
		INNER JOIN author ON author.author_id = thread.author_id
		LEFT JOIN thread_archive ON thread_archive.thread_id = thread.thread_id AND thread_archive.author_id = %v
		WHERE thread.discussion_id = %v
		ORDER BY 
	` + sortOrder[sortIndex], userAuthorID,discussionID))

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
			&thread.Author.Name,
			&thread.Author.Username,
			&thread.Author.AvatarIconLink,
			pq.Array(&thread.ImageLink),
			pq.Array(&thread.VideoLink),
			&thread.LikeCount,
			&thread.CommentCount,
			&thread.Popularity,
			&thread.Visiblity,
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
			thread.like_count,
			thread.comment_count,
			thread.author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			thread.image_link,
			thread.video_link,
			thread.popularity,
			thread.visibility
		FROM threadTopicJunction
		INNER JOIN thread ON threadTopicJunction.thread_id = thread.thread_id
		INNER JOIN author ON thread.author_id = author.author_id
		WHERE threadTopicJunction.topic_id = $1
		ORDER BY thread.created_at DESC
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
			&thread.LikeCount,
			&thread.CommentCount,
			&thread.Author.AuthorID,
			&thread.Author.Name,
			&thread.Author.Username,
			&thread.Author.AvatarIconLink,
			pq.Array(&thread.ImageLink),
			pq.Array(&thread.VideoLink),
			&thread.Popularity,
			&thread.Visiblity,
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

func (threadRepository *ThreadRepository) IncrementCommentCountByThreadID(threadID int) error {
	_, err := threadRepository.DB.Exec(`
		UPDATE thread
		SET comment_count = comment_count + 1
		WHERE thread_id = $1
	`, threadID)

	return err
}

func (threadRepository *ThreadRepository) DecrementCommentCountByThreadID(threadID int) error {
	_, err := threadRepository.DB.Exec(`
		UPDATE thread
		SET comment_count = comment_count - 1
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

func (threadRepository *ThreadRepository) GetVideoLinkByThreadID(threadID int) []string {
	var videoLink []string
	row := threadRepository.DB.QueryRow("SELECT video_link FROM thread WHERE thread_id = $1", threadID)
	err := row.Scan(pq.Array(&videoLink))

	// No video links found
	if err != nil || err == sql.ErrNoRows {

		return []string{}
	}
	return videoLink
}

// User author id needed to acquire archive status
// Page and limit can be specified to return threads for a particular page
func (threadRepository *ThreadRepository) SearchThreads(userAuthorID int, query string, page int, limit int, sortIndex int) ([]*dtos.ThreadDTO, error) {
	sortOrder := []string{"thread.popularity DESC", "thread.created_at DESC", "thread.created_at ASC"}

	var limitOffset string
	if limit != 0 {
		limitOffset = fmt.Sprintf(" LIMIT %v", limit)
		if page != 0 {
			limitOffset += fmt.Sprintf(" OFFSET %v", (page-1)*limit)
		}
	}

	rows, err := threadRepository.DB.Query(`
		SELECT DISTINCT
			thread.thread_id,
			thread.title,
			thread.created_at,
			thread.content,
			thread.author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			thread.image_link,
			thread.video_link,
			thread.like_count,
			thread.comment_count,
			thread.popularity,
			thread.visibility,
			CASE 
				WHEN thread_archive.thread_id IS NOT NULL AND thread_archive.author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE 
			END AS archive_status
		FROM thread
		INNER JOIN author ON thread.author_id = author.author_id
		LEFT JOIN thread_archive ON thread_archive.thread_id = thread.thread_id AND thread_archive.author_id = $1
		LEFT JOIN threadTopicJunction ON threadTopicJunction.thread_id = thread.thread_id
		LEFT JOIN topic ON threadTopicJunction.topic_id = topic.topic_id
		WHERE (thread.title ILIKE $2 OR thread.content ILIKE $2 OR topic.name ILIKE $2)
		ORDER BY 
	`+sortOrder[sortIndex]+limitOffset, userAuthorID, "%"+query+"%")

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
			&thread.Author.Name,
			&thread.Author.Username,
			&thread.Author.AvatarIconLink,
			pq.Array(&thread.ImageLink),
			pq.Array(&thread.VideoLink),
			&thread.LikeCount,
			&thread.CommentCount,
			&thread.Popularity,
			&thread.Visiblity,
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

func (threadRepository *ThreadRepository) GetTrendingThreads(userAuthorID int, page int, limit int) ([]*dtos.ThreadDTO, error) {

	var limitOffset string
	if page != 0 && limit != 0 {
		limitOffset = fmt.Sprintf(" LIMIT %v OFFSET %v", limit, (page-1)*limit)
	}

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
			thread.image_link,
			thread.video_link,
			thread.like_count,
			thread.comment_count,
			thread.popularity,
			thread.visibility,
			CASE 
				WHEN thread_archive.thread_id IS NOT NULL AND thread_archive.author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE 
		END AS archive_status
		FROM thread
		INNER JOIN author ON thread.author_id = author.author_id
		LEFT JOIN thread_archive ON thread_archive.thread_id = thread.thread_id AND thread_archive.author_id = $1
		ORDER BY thread.popularity DESC
	`+limitOffset, userAuthorID)

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
			&thread.Author.Name,
			&thread.Author.Username,
			&thread.Author.AvatarIconLink,
			pq.Array(&thread.ImageLink),
			pq.Array(&thread.VideoLink),
			&thread.LikeCount,
			&thread.CommentCount,
			&thread.Popularity,
			&thread.Visiblity,
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

func (threadRepository *ThreadRepository) CreateThread(thread *models.Thread) (int, error) {
	var threadID int64
	row := threadRepository.DB.QueryRow(`
		INSERT INTO thread
		(title, content, author_id, image_link, video_link, visibility)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING thread_id
	`, thread.Title, thread.Content, thread.AuthorID, pq.Array(thread.ImageLink), pq.Array(thread.VideoLink), "public")

	// Check for errors while returning thread id
	err := row.Scan(&threadID)
	return int(threadID), err
}

func (threadRepository *ThreadRepository) CreateDiscussionThread(thread *models.Thread, discussionID int) error {
	_, err := threadRepository.DB.Exec(`
		INSERT INTO thread
		(title, content, author_id, image_link, video_link, discussion_id, visibility)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, thread.Title, thread.Content, thread.AuthorID, pq.Array(thread.ImageLink), pq.Array(thread.VideoLink), discussionID, "private")

	return err
}

// Update fields in thread model (for non null db columns check if the field is empty first)
func (threadRepository *ThreadRepository) UpdateThread(thread *models.Thread, threadID int) error {
	if thread.Title != "" {
		_, err := threadRepository.DB.Exec(`UPDATE thread SET title = $1 WHERE thread_id = $2`, thread.Title, threadID)
		if err != nil {
			return err
		}
	}
	_, err := threadRepository.DB.Exec(`UPDATE thread SET content = $1 WHERE thread_id = $2`, thread.Content, threadID)
	if err != nil {
		return err
	}
	return nil
}

func (threadRepository *ThreadRepository) ResetAllCommentCount() error {
	_, err := threadRepository.DB.Exec("UPDATE thread SET comment_count = 0")

	return err
}

func (threadRepository *ThreadRepository) ResetAllLikeCount() error {
	_, err := threadRepository.DB.Exec("UPDATE thread SET like_count = 0")

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
