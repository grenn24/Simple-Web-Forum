package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
)

func SetupRoutes(router *gin.Engine) {
	router.GET("/threads", func(context *gin.Context) {
		controllers.GetAllThreads(context)
	})
}
