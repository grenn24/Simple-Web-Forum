package models

import "time"

type Author struct {
    AuthorID       int       `json:"author_id" db:"author_id"`           
    Name           string    `json:"name" db:"name"`                    
    Username       string    `json:"username" db:"username"`              
    Email          string    `json:"email" db:"email"`                    
    PasswordHash   string    `json:"-" db:"password_hash"`                
    AvatarIconLink string    `json:"avatar_icon_link,omitempty" db:"avator_icon_link"` 
    CreatedAt      time.Time `json:"created_at" db:"created_at"`         
}