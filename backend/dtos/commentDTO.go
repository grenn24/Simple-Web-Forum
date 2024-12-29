package dtos

import (
	"time"
)

type CommentWithAuthorName struct {
	CommentID      int       `json:"comment_id" db:"comment_id"`
	ThreadID       int       `json:"thread_id" db:"thread_id"`
	AuthorID       int       `json:"author_id" db:"author_id"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	Content        string    `json:"content" db:"content"`
	AuthorName       string       `json:"author_name" db:"author_name"`
	AvatarIconLink *string   `json:"avatar_icon_link,omitempty"`
}
