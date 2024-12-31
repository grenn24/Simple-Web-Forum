package models

import "time"

type Bookmark struct {
	BookmarkID int       `json:"bookmark_id" db:"bookmark_id"`
	ThreadID   int       `json:"thread_id" db:"thread_id"`
	AuthorID   int       `json:"author_id" db:"author_id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}
