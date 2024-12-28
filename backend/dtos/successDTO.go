package dtos

type Success struct {
	Status   string  `json:"status"`
	Message  string  `json:"message,omitempty"`
	Data     any     `json:"data,omitempty"`
}
