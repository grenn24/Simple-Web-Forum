package repositories

import (
	"database/sql"
)

type FollowRepository struct {
	DB *sql.DB
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
