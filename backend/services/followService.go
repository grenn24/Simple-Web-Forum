package services

import (
	"database/sql"
	"fmt"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
)

type FollowService struct {
	DB *sql.DB
}

func (followService *FollowService) GetAllFollows() ([]*models.Follow, error) {
	rows, err := followService.DB.Query("SELECT * FROM follow")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	var follows []*models.Follow

	for rows.Next() {
		// Declare a pointer to a new instance of a follow struct
		follow := new(models.Follow)

		// Scan the current row into the follow struct
		err := rows.Scan(
			&follow.FollowID,
			&follow.FollowerAuthorID,
			&follow.FolloweeAuthorID,
			&follow.FolloweeTopicID,
			&follow.CreatedAt,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned follow to follows slice
		follows = append(follows, follow)
	}

	return follows, err
}

func (followService *FollowService) GetFollowedThreadsByAuthorID(authorID string) ([]*models.Thread, error) {

	rows, err := followService.DB.Query(`
		SELECT DISTINCT 
			thread.thread_id, 
			thread.title, 
			thread.created_at, 
			thread.content, 
			thread.author_id, 
			thread.image_title, 
			thread.image_link
		FROM follow
		LEFT JOIN threadTopicJunction ON threadTopicJunction.topic_id = follow.followee_topic_id
		LEFT JOIN thread ON thread.author_id = follow.followee_author_id 
			OR thread.thread_id = threadTopicJunction.thread_id
		WHERE follower_author_id = $1
	`, authorID)

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

		// Append the scanned follow to follows slice
		threads = append(threads, thread)
	}

	return threads, err
}

func (followService *FollowService) CreateFollow(follow *models.Follow) *dtos.Error {

	_, err := followService.DB.Exec("INSERT INTO follow (follower_author_id, followee_author_id, followee_topic_id) VALUES ($1, $2, $3)", follow.FollowerAuthorID, follow.FolloweeAuthorID, follow.FolloweeTopicID)

	if err != nil {
		// Check for existing follower_author-followee_author combination
		if err.Error() == "pq: duplicate key value violates unique constraint \"follow_follower_author_id_followee_author_id_key\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "FOLLOW_ALREADY_EXISTS",
				Message:   fmt.Sprintf("Author of author id %v is already following author of author id %v", follow.FollowerAuthorID, *follow.FolloweeAuthorID),
			}
		}
		// Check for existing follower_author-followee_topic combination
		if err.Error() == "pq: duplicate key value violates unique constraint \"follow_follower_author_id_followee_topic_id_key\"" {
			return &dtos.Error{
				Status:    "error",
				ErrorCode: "FOLLOW_ALREADY_EXISTS",
				Message:   fmt.Sprintf("Author of author id %v is already following topic of topic id %v", follow.FollowerAuthorID, *follow.FolloweeTopicID),
			}
		}
		// Internal server errors
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}
	}
	return nil

}

func (followService *FollowService) DeleteFollowByFollowerFolloweeID(follower_author_id int, followee_topic_id *int, followee_author_id *int) *dtos.Error {
	followRepository := &repositories.FollowRepository{DB: followService.DB}
	rowsDeleted, err := followRepository.DeleteFollowByFollowerFolloweeID(follower_author_id, followee_topic_id, followee_author_id)

	// Check for internal server errors
	if err != nil {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		}

	}

	// Check for follow not found error
	if rowsDeleted == 0 {
		return &dtos.Error{
			Status:    "error",
			ErrorCode: "NOT_FOUND",
			Message:   "No follows found for the follower and followee ids provided ",
		}
	}

	return nil
}
