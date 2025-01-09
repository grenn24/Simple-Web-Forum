package utils

import (
	"strings"
	"time"
)

// Converts a javascript date object represented as string into time.Time
func DateStringToTime(dateString string) time.Time {
	format := "Mon Jan 2 2006 15:04:05 GMT-0700"
	timeString := strings.Split(dateString, " (")[0]
	time, _ := time.Parse(format, timeString)
	return time
}
