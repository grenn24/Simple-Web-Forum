package models

import (
	_ "database/sql"
)

type ThreadTopicJunction struct {
	ThreadTopicJunctionID int `json:"thread_topic_junction_id" db:"thread_topic_junction_id"`
	ThreadID              int `json:"thread_id" db:"thread_id"`
	TopicID               int `json:"topic_id" db:"topic_id"`
}
