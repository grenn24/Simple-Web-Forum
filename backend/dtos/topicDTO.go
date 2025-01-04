package dtos

import (
)

type TopicDTO struct {
	TopicID      int       `json:"topic_id"`
	Name         string    `json:"name"`
	FollowStatus bool      `json:"follow_status"`
	Threads      []*ThreadDTO `json:"threads"`
}

