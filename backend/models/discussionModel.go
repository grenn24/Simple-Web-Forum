package models

import (
	"mime/multipart"
	"time"
)

type Discussion struct {
	DiscussionID       int                   `json:"discussion_id" db:"discussion_id"`
	Name               string                `json:"name" db:"name"`
	Description        string                `json:"description" db:"description"`
	CreatorAuthorID    int                   `json:"creator_author_id" db:"creator_author_id"`
	BackgroundImageLink *string               `json:"background_image_link,omitempty" db:"background_image_linkk"`
	BackgroundImage     *multipart.FileHeader `json:"background_image,omitempty" db:"background_image"`
}

type DiscussionJoinRequest struct {
	RequestID    int       `json:"request_id" db:"request_id"`
	DiscussionID int       `json:"discussion_id" db:"discussion_id"`
	AuthorID     int       `json:"author_id" db:"author_id"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}
