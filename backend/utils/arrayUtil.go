package utils

func ArrayContains(values[]string, target string) bool {
	for _, value := range values {
		if value == target {
			return true
		}
	}
	return false
}