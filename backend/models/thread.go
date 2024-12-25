package models

import ("time"
"database/sql")

type Thread struct {
    ThreadID   int       `json:"thread_id" db:"thread_id"`          
    Title      string    `json:"title" db:"title"`                
    CreatedAt  time.Time `json:"created_at" db:"created_at"`       
    Content    string    `json:"content" db:"content"`         
    AuthorID   int       `json:"author_id" db:"author_id"`        
    ImageTitle sql.NullString    `json:"image_title,omitempty" db:"image_title"` 
    ImageLink  sql.NullString    `json:"image_link,omitempty" db:"image_link"`   
}