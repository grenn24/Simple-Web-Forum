package dtos

type Error struct {
	Status       string `json:"status"`
	ErrorCode    string `json:"error_code"`
	Message string `json:"message"`
}

type Success struct {
	Status   string  `json:"status"`
	SuccessCode     any     `json:"successCode,omitempty"`
	Message  string  `json:"message"`
	Data     any     `json:"data,omitempty"`
}
