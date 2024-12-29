package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/services"
)

func TopicRoutes(router *gin.Engine, db *sql.DB) {
	topicRouter := router.Group("/topics")
	topicRouter.Use(middlewares.ValidateJwtToken)

	// Initialise controller handlers
	topicController := &controllers.TopicController{TopicService: &services.TopicService{
		DB: db,
	}}
	threadController := &controllers.ThreadController{ThreadService: &services.ThreadService{
		DB: db,
	}}

	topicRouter.GET("", func(context *gin.Context) {
		topicController.GetAllTopics(context, db)
	})
	topicRouter.GET("/topics/threads/:threadID", func(context *gin.Context) {
		topicController.GetTopicsByThreadID(context, db)
	})
	topicRouter.POST("", func(context *gin.Context) {
		topicController.CreateTopic(context, db)
	})
	topicRouter.GET("/:topicID/threads", func(context *gin.Context) {
		threadController.GetThreadsByTopicID(context, db)
	})
	topicRouter.GET("/threads", func(context *gin.Context) {
		topicController.GetAllTopicsWithThreads(context, db)
	})
	topicRouter.POST("/:topicID/threads/:threadID", func(context *gin.Context) {
		threadController.AddThreadToTopic(context, db)
	})
}
