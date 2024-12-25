package models

import ("time"
"database/sql")

type Follow struct {
	FollowID         int       `json:"follow_id" db:"follow_id"`
	FollowerAuthorID int       `json:"follower_author_id" db:"follower_author_id"`
	FolloweeAuthorID        sql.NullInt64       `json:"followee_author_id" db:"followee_author_id"`
	FolloweeTopicID        sql.NullInt64       `json:"followee_topic_id" db:"followee_topic_id"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
}
