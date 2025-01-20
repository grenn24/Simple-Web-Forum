package dtos

import (
	"mime/multipart"
	"time"
)

type DiscussionDTO struct {
	DiscussionID int          `json:"discussion_id"`
	Name         string       `json:"name"`
	Description  string       `json:"description"`
	CreatedAt    *time.Time   `json:"created_at"`
	Threads      []*ThreadDTO `json:"threads"`
	// Optional JSON Fields
	DiscussionIconLink *string               `json:"discussion_icon_link,omitempty"`
	DiscussionIcon     *multipart.FileHeader `json:"discussion_icon,omitempty"`
}
