package dtos

import (
	"time"

	_ "github.com/grenn24/simple-web-forum/models"
)

type LikeDTO struct {
	LikeID    int       `json:"like_id"`
	CreatedAt time.Time `json:"created_at"`
	// Optional JSON Fields
	Thread *ThreadDTO `json:"thread,omitempty"`
	Author *AuthorDTO `json:"author,omitempty" `
}
