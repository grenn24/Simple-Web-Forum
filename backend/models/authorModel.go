package models

import (
	_ "database/sql"
	"time"
)

type Author struct {
	AuthorID     int       `json:"author_id" db:"author_id"`
	Name         string    `json:"name" db:"name"`
	Username     string    `json:"username" db:"username"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"password_hash" db:"password_hash"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	// Optional JSON Fields
	AvatarIconLink *string `json:"avatar_icon_link,omitempty" db:"avator_icon_link"`
	IsUser         *bool   `json:"is_user,omitempty"`
}
