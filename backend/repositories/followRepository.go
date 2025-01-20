package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/lib/pq"
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

// Threads from followed topics and authors (duplicates removed)
func (followRepository *FollowRepository) GetFollowedThreadsByAuthorID(authorID int, sortIndex int) ([]*dtos.ThreadDTO, error) {
	sortOrder := []string{"thread.popularity DESC", "thread.popularity DESC", "thread.created_at DESC", "thread.created_at ASC"}
	rows, err := followRepository.DB.Query(`
		SELECT DISTINCT
			thread.thread_id, 
			thread.title, 
			thread.created_at, 
			thread.content, 
			thread.author_id, 
			thread_author.name,
			thread_author.username, 
			thread_author.avatar_icon_link,  
		
			thread.image_link,
	
			thread.video_link,
			thread.like_count,
			thread.comment_count,
			thread.popularity,
		CASE 
			WHEN thread_archive.thread_id IS NOT NULL AND thread_archive.author_id IS NOT NULL 
			THEN TRUE 
			ELSE FALSE 
    	END AS archive_status
		FROM follow
		LEFT JOIN threadTopicJunction ON threadTopicJunction.topic_id = follow.followee_topic_id
		LEFT JOIN thread ON thread.author_id = follow.followee_author_id OR thread.thread_id = threadTopicJunction.thread_id
		LEFT JOIN author AS thread_author ON thread.author_id = thread_author.author_id
		LEFT JOIN thread_archive ON thread_archive.thread_id = thread.thread_id AND thread_archive.author_id = follow.follower_author_id
		WHERE thread.thread_id IS NOT NULL AND follow.follower_author_id = $1 AND thread.visibility = 'public'
		ORDER BY 
	`+sortOrder[sortIndex], authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	followedThreads := make([]*dtos.ThreadDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a followed thread struct
		followedThread := new(dtos.ThreadDTO)
		followedThread.Author = new(dtos.AuthorDTO)

		// Scan the current row into the thread struct
		err := rows.Scan(
			&followedThread.ThreadID,
			&followedThread.Title,
			&followedThread.CreatedAt,
			&followedThread.Content,
			&followedThread.Author.AuthorID,
			&followedThread.Author.Name,
			&followedThread.Author.Username,
			&followedThread.Author.AvatarIconLink,

			pq.Array(&followedThread.ImageLink),
		
			pq.Array(&followedThread.VideoLink),
			&followedThread.LikeCount,
			&followedThread.CommentCount,
			&followedThread.Popularity,
			&followedThread.ArchiveStatus,
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

func (followRepository *FollowRepository) CountFollowersByAuthorID (authorID int) (int, error) {
	var followerCount int
	row := followRepository.DB.QueryRow("SELECT COUNT(*) FROM follow WHERE followee_author_id = $1", authorID)
	err := row.Scan(&followerCount)
	return followerCount, err
}
