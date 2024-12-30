package dtos

import (
)

type TopicWithThreads struct {
	TopicID      int       `json:"topic_id"`
	Name         string    `json:"name"`
	FollowStatus bool      `json:"follow_status"`
	Threads      []*ThreadGridCard `json:"threads"`
}


type TopicWithFollowStatus struct {
	TopicID      int    `json:"topic_id"   `
	Name         string `json:"name"`
	FollowStatus bool   `json:"follow_status"`
}
