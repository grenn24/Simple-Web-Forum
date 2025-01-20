package models

type Topic struct {
	TopicID    int     `json:"topic_id" db:"topic_id"`
	Name       string  `json:"name" db:"name"`
	Popularity float64 `json:"popularity" db:"popularity"`
}
