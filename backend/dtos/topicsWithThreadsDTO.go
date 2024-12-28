package dtos

type TopicsWithThreads []*TopicWithThreads
type TopicWithThreads struct {
	TopicID      int      `json:"topic_id"`
	Name    string   `json:"name"`
	FollowStatus bool     `json:"follow_status"`
	Threads      []*Thread `json:"threads"`
}

type Thread struct {
	ThreadID          int    `json:"thread_id"`
	Title             string `json:"title"`
	ContentSummarised string `json:"content_summarised"`
	Author            string `json:"author"`
	AuthorID          int    `json:"author_id"`
	AvatarIconLink    string `json:"avatar_icon_link"`
	CreatedAt         string `json:"created_at"`
	BookmarkStatus    bool   `json:"bookmark_status"`
}
