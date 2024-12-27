package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func CORS (context *gin.Context) {
		// Specify allowed cross origins, methods, headers
		context.Header("Access-Control-Allow-Origin", "*")
		context.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		context.Header("Access-Control-Allow-Headers", "Content-Type")

		// If http request is a preflight (options) request, respond with 200 status code
		if context.Request.Method == http.MethodOptions {
			context.AbortWithStatus(http.StatusOK)
			return
		}

		context.Next()
	}