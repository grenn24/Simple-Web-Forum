package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/services"
)

func CommentRoutes(router *gin.RouterGroup, db *sql.DB) {
	commentRouter := router.Group("/comments")
	commentRouter.Use(middlewares.Authenticate)

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
	commentRouter.GET("/search", func(context *gin.Context) {
		commentController.SearchComments(context, db)
	})
	commentRouter.DELETE("", func(context *gin.Context) {
		commentController.DeleteAllComments(context, db)
	})
	commentRouter.DELETE("/:commentID", func(context *gin.Context) {
		commentController.DeleteCommentByID(context, db)
	})
}
