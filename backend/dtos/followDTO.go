package dtos

import "time"

type FollowDTO struct {
	FollowID         int        `json:"follow_id" db:"follow_id"`
	FollowerAuthor AuthorDTO  `json:"follower_author" db:"follower_author"`
	FolloweeAuthor   *AuthorDTO `json:"followee_author,omitempty" db:"followee_author"`
	FolloweeTopic    *TopicDTO  `json:"followee_topic,omitempty" db:"followee_topic"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
}
