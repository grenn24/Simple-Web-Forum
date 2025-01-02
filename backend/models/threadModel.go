package models

import (
	_ "database/sql"
	"time"
)

type Thread struct {
	ThreadID  int       `json:"thread_id" db:"thread_id"`
	Title     string    `json:"title" db:"title"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	Content   string    `json:"content" db:"content"`
	AuthorID  int       `json:"author_id" db:"author_id"`
	LikeCount int       `json:"like_count" db:"like_count"`
	//Optional JSON Fields
	ImageTitle   *string   `json:"image_title,omitempty" db:"image_title"`
	ImageLink    *string   `json:"image_link,omitempty" db:"image_link"`
	TopicsTagged []string `json:"topics_tagged,omitempty"`
}
