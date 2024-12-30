package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/services"
)

func LikeRoutes(router *gin.Engine, db *sql.DB) {
	likeRouter := router.Group("/likes")
	likeRouter.Use(middlewares.ValidateJwtToken)

	// Initialise controller handlers
	likeController := &controllers.LikeController{LikeService: &services.LikeService{
		DB: db,
	}}

	likeRouter.GET("", func(context *gin.Context) {
		likeController.GetAllLikes(context, db)
	})
	likeRouter.GET("/count", func(context *gin.Context) {
		likeController.CountAllLikes(context, db)
	})
	likeRouter.POST("", func(context *gin.Context) {
		likeController.CreateLike(context, db)
	})
	likeRouter.POST("/user", func(context *gin.Context) {
		likeController.CreateUserLike(context, db)
	})
	likeRouter.DELETE("/user", func(context *gin.Context) {
		likeController.DeleteUserLike(context, db)
	})
}