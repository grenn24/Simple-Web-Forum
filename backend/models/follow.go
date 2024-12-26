package models

import (
	_ "database/sql"
	"time"
)

type Follow struct {
	FollowID         int       `json:"follow_id" db:"follow_id"`
	FollowerAuthorID int       `json:"follower_author_id" db:"follower_author_id"`
	FolloweeAuthorID *int      `json:"followee_author_id,omitempty" db:"followee_author_id"`
	FolloweeTopicID  *int      `json:"followee_topic_id,omitempty" db:"followee_topic_id"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
}
