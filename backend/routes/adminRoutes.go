package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/services"
)

func AdminRoutes(router *gin.Engine, db *sql.DB) {
	// Initialise controller handlers
	threadTopicJunctionController := &controllers.ThreadTopicJunctionController{ThreadTopicJunctionService: &services.ThreadTopicJunctionService{
		DB: db,
	}}
	adminController := &controllers.AdminController{AdminService: &services.AdminService{
		DB: db,
	}}

	router.GET("/thread-topic-junctions", func(context *gin.Context) {
		threadTopicJunctionController.GetAllThreadTopicJunctions(context, db)
	})
	router.DELETE("/reset-database", func(context *gin.Context) {
		adminController.ResetDatabase(context, db)
	})
	router.POST("/initialise-database", func(context *gin.Context) {
		adminController.InitialiseDatabase(context, db)
	})
}
