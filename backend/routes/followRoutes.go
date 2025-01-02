package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/services"
)

func FollowRoutes(router *gin.RouterGroup, db *sql.DB) {
	followRouter := router.Group("/follows")
	followRouter.Use(middlewares.ValidateJwtToken)

	// Initialise controller handlers
	followController := &controllers.FollowController{FollowService: &services.FollowService{
		DB: db,
	}}

	followRouter.GET("", func(context *gin.Context) {
		followController.GetAllFollows(context, db)
	})
	followRouter.POST("", func(context *gin.Context) {
		followController.CreateFollow(context, db)
	})
	followRouter.POST("/user", func(context *gin.Context) {
		followController.CreateUserFollow(context, db)
	})
	followRouter.DELETE("", func(context *gin.Context) {
		followController.DeleteFollow(context, db)
	})
	followRouter.DELETE("/user", func(context *gin.Context) {
		followController.DeleteUserFollow(context, db)
	})
}
