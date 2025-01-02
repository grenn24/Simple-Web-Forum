package models

import "time"

type Archive struct {
	ArchiveID int       `json:"archive_id" Sdb:"archive_id"`
	ThreadID  int       `json:"thread_id" db:"thread_id"`
	AuthorID  int       `json:"author_id" db:"author_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
