package models

import (
	_ "database/sql"
	"mime/multipart"
	"time"
)

type Thread struct {
	ThreadID     int       `json:"thread_id" db:"thread_id"`
	Title        string    `json:"title" db:"title"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	Content      string    `json:"content" db:"content"`
	AuthorID     int       `json:"author_id" db:"author_id"`
	LikeCount    int       `json:"like_count" db:"like_count"`
	CommentCount int       `json:"comment_count" db:"comment_count"`
	Popularity   float64   `json:"popularity" db:"popularity"`
	Visiblity    string    `json:"visibility" db:"visibility"`
	//Optional JSON Fields

	Image     []*multipart.FileHeader `json:"image,omitempty"`
	ImageLink []string                `json:"image_link,omitempty" db:"image_link"`

	Video        []*multipart.FileHeader `json:"video,omitempty"`
	VideoLink    []string                `json:"video_link,omitempty" db:"video_link"`
	TopicsTagged []string                `json:"topics_tagged,omitempty"`
}
