package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/services"
)

func CommentRoutes(router *gin.Engine, db *sql.DB) {
	commentRouter := router.Group("/comments")

	// Initialise controller handlers
	commentController := &controllers.CommentController{CommentService: &services.CommentService{
		DB: db,
	}}

	commentRouter.GET("", func(context *gin.Context) {
		commentController.GetAllComments(context, db)
	})
	commentRouter.GET("/count", func(context *gin.Context) {
		commentController.CountAllComments(context, db)
	})
	commentRouter.POST("", func(context *gin.Context) {
		commentController.CreateComment(context, db)
	})
	commentRouter.DELETE("/", func(context *gin.Context) {
		commentController.DeleteAllComments(context, db)
	})
}