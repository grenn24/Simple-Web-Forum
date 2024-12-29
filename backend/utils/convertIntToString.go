package utils

import (
	"strconv"


)

func ConvertIntToString(value int) string {
	valueConverted := strconv.Itoa(value)
	return valueConverted
}
