package dtos

type TopicDTO struct {
	TopicID      int          `json:"topic_id"`
	Name         string       `json:"name"`
	FollowStatus bool         `json:"follow_status"`
	Threads      []*ThreadDTO `json:"threads"`
	ThreadCount  *int         `json:"thread_count,omitempty"`
	Popularity   *float64         `json:"popularity,omitempty"`
}
