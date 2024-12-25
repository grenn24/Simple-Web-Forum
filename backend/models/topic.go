package models

type Topic struct {
    TopicID  int    `json:"topic_id" db:"topic_id"`    
    Name     string `json:"name" db:"name"`             
    ThreadID int    `json:"thread_id" db:"thread_id"`  
}