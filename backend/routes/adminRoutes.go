package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/services"
)

func AdminRoutes(router *gin.RouterGroup, db *sql.DB) {
	// Declare api router group
	adminRouter := router.Group("/admin")
	// Initialise controller handlers
	topicController := &controllers.TopicController{TopicService: &services.TopicService{
		DB: db,
	}}
	adminController := &controllers.AdminController{AdminService: &services.AdminService{
		DB: db,
	}}

	adminRouter.GET("/thread-topic-junctions", func(context *gin.Context) {
		topicController.GetAllThreadTopicJunctions(context, db)
	})
	adminRouter.DELETE("/reset-database", func(context *gin.Context) {
		adminController.ResetDatabase(context, db)
	})
	adminRouter.POST("/initialise-database", func(context *gin.Context) {
		adminController.InitialiseDatabase(context, db)
	})
}
