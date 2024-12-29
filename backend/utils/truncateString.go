package utils

import (
	"strings"
)

func TruncateString(content string, wordLimit int) string {
	// Split content into words
	words := strings.Fields(content)

	// If there are more words than the limit, truncate and add "..."
	if len(words) > wordLimit {
		return strings.Join(words[:wordLimit], " ") + "..."
	}
	return content
}
