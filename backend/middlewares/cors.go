package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORS(context *gin.Context) {
	// Specify allowed cross origins, methods, headers
	secureOrigins := []string{
		"http://localhost:5173",
		"https://simple-web-forum.web.app",
	}

	context.Header("Access-Control-Allow-Origin", secureOrigins[0])
	context.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	context.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
	context.Header("Access-Control-Expose-Headers", "Authorization")
	context.Header("Access-Control-Allow-Credentials", "true")

	// If http request is a preflight (options) request, respond with 200 status code
	if context.Request.Method == http.MethodOptions {
		context.AbortWithStatus(http.StatusOK)
		return
	}

	// Delegate request to next controller handler
	context.Next()
}
