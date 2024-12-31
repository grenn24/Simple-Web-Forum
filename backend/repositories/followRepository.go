package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
)

type FollowRepository struct {
	DB *sql.DB
}

func (followRepository *FollowRepository) CreateFollow(follow *models.Follow) error {
	_, err := followRepository.DB.Exec("INSERT INTO follow (follower_author_id, followee_author_id, followee_topic_id) VALUES ($1, $2, $3)", follow.FollowerAuthorID, follow.FolloweeAuthorID, follow.FolloweeTopicID)
	return err
}

func (followRepository *FollowRepository) DeleteFollowByFollowerFolloweeID(follower_author_id int, followee_topic_id *int, followee_author_id *int) (int, error) {
	var result sql.Result
	var err error
	if followee_topic_id == nil {
		result, err = followRepository.DB.Exec("DELETE FROM follow WHERE follower_author_id = $1 AND followee_author_id = $2", follower_author_id, followee_author_id)
	} else {
		result, err = followRepository.DB.Exec("DELETE FROM follow WHERE follower_author_id = $1 AND followee_topic_id = $2", follower_author_id, followee_topic_id)
	}

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}

func (followRepository *FollowRepository) GetFollowedThreadsByAuthorID(authorID int) ([]*dtos.ThreadCard, error) {
	rows, err := followRepository.DB.Query(`
		SELECT 
			thread.thread_id, 
			thread.title, 
			thread.created_at, 
			thread.content, 
			thread.author_id, 
			author.name, 
			thread.image_title, 
			thread.image_link
		FROM follow
		LEFT JOIN threadTopicJunction 
			ON threadTopicJunction.topic_id = follow.followee_topic_id
		LEFT JOIN thread 
			ON thread.author_id = follow.followee_author_id 
			OR thread.thread_id = threadTopicJunction.thread_id
		LEFT JOIN author 
			ON thread.author_id = author.author_id
		WHERE thread.thread_id IS NOT NULL 
			AND follow.follower_author_id = $1
	`, authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	followedThreads := make([]*dtos.ThreadCard, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a followed thread struct
		followedThread := new(dtos.ThreadCard)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&followedThread.ThreadID,
			&followedThread.Title,
			&followedThread.CreatedAt,
			&followedThread.ContentSummarised,
			&followedThread.AuthorID,
			&followedThread.AuthorName,
			&followedThread.ImageTitle,
			&followedThread.ImageLink,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned follow to follows slice
		followedThreads = append(followedThreads, followedThread)
	}

	return followedThreads, err
}
