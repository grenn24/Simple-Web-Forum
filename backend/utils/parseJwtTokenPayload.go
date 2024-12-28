package utils

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/grenn24/simple-web-forum/dtos"
)

func ParseJwtTokenPayload(context *gin.Context) map[string]any {
	authorisationHeader := context.GetHeader("Authorization")

	jwtToken := strings.TrimPrefix(authorisationHeader, "Bearer ")
	jwtTokenSlice := strings.Split(jwtToken, ".")

	payloadEncoded := jwtTokenSlice[1]
	payloadDecoded, err := (base64.URLEncoding.DecodeString(payloadEncoded))

	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		context.Abort()
		return nil
	}
	var payload map[string]any
	err = json.Unmarshal(payloadDecoded, &payload)

	return payload
}
