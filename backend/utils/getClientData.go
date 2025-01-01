package utils

import (
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
)

func GetClientDomainName(context *gin.Context) string {
	origin := context.GetHeader("Origin")
	parsedOrigin, err := url.Parse(origin)
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		context.Abort()
		return ""
	}
	return parsedOrigin.Hostname()
}

func GetClientDomainNameWithPort(context *gin.Context) string {
	origin := context.GetHeader("Origin")
	parsedOrigin, err := url.Parse(origin)
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		context.Abort()
		return ""
	}
	return parsedOrigin.Hostname() + ":" + parsedOrigin.Port()
}

func GetClientProtocol(context *gin.Context) string {
	origin := context.GetHeader("Origin")
	parsedOrigin, err := url.Parse(origin)
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		context.Abort()
		return ""
	}
	return parsedOrigin.Scheme
}
