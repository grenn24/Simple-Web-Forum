package utils

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
)

func ConvertStringToInt(value string, context *gin.Context) int {
	valueConverted, err := strconv.Atoi(value)
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		context.Abort()
		return 0
	}
	return valueConverted
}
