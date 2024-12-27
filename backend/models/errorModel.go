package models

type Error struct {
	Status       string `json:"status"`
	ErrorCode    string `json:"errorCode"`
	Message string `json:"message"`
}
