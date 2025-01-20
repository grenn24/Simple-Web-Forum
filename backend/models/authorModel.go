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
	Biography    string    `json:"biography,omitempty" db:"biography"`
	// Optional JSON Fields
	AvatarIconLink *string    `json:"avatar_icon_link,omitempty" db:"avator_icon_link"`
	Faculty        *string    `json:"faculty,omitempty" db:"faculty"`
	Birthday       *time.Time `json:"birthday,omitempty" db:"birthday"`
	Gender         *string    `json:"gender,omitempty" db:"gender"`
}
