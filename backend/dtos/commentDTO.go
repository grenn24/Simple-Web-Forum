package dtos

import (
	"time"

	_ "github.com/grenn24/simple-web-forum/models"
)

type CommentDTO struct {
	CommentID int `json:"comment_id"`
	CreatedAt time.Time `json:"created_at"`
	Content   string    `json:"content"`

	// Optional JSON Fields
	Thread *ThreadDTO `json:"thread,omitempty"`
	Author *AuthorDTO        `json:"author,omitempty" `
}
