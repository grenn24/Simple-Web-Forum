package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/services"
)


func DiscussionRoutes(router *gin.RouterGroup, db *sql.DB) {
	discussionRouter := router.Group("/discussions")
	discussionRouter.Use(middlewares.Authenticate)

	// Initialise controller handlers
	discussionController := &controllers.DiscussionController{DiscussionService: &services.DiscussionService{
		DB: db,
	}}

	discussionRouter.POST("", func(context *gin.Context) {
		discussionController.CreateDiscussion(context, db)
	})

	discussionRouter.POST("/:discussionID/threads", func(context *gin.Context) {
		discussionController.CreateDiscussionThread(context, db, progressChannels, errorChannels, &mutex)
	})
}