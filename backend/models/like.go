package models

import "time"

type Like struct {
    LikeID    int       `json:"like_id" db:"like_id"`       
    ThreadID  int       `json:"thread_id" db:"thread_id"`     
    AuthorID  int       `json:"author_id" db:"author_id"`     
    CreatedAt time.Time `json:"created_at" db:"created_at"`   
}