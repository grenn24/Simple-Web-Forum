package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/services"
)

func FollowRoutes(router *gin.Engine, db *sql.DB) {
	followRouter := router.Group("/follows")

	// Initialise controller handlers
	followController := controllers.FollowController{FollowService: &services.FollowService{
		DB: db,
	}}

	followRouter.GET("", func(context *gin.Context) {
		followController.GetAllFollows(context, db)
	})
	followRouter.POST("", func(context *gin.Context) {
		followController.CreateFollow(context, db)
	})
}
