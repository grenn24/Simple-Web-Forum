package dtos

type Error struct {
	Status       string `json:"status"`
	ErrorCode    string `json:"errorCode"`
	Message string `json:"message"`
}

type Success struct {
	Status   string  `json:"status"`
	Message  string  `json:"message,omitempty"`
	Data     any     `json:"data,omitempty"`
}
