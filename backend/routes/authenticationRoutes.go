package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/services"
)

func AuthenticationRoutes(router *gin.Engine, db *sql.DB) {
	authenticationRouter := router.Group("/authentication")

	// Initialise controller handlers
	authenticationController := &controllers.AuthenticationController{AuthenticationService: &services.AuthenticationService{
		DB: db,
	}}

	authenticationRouter.POST("/log-in", func(context *gin.Context) {
		authenticationController.LogIn(context, db)
	})

	authenticationRouter.POST("/sign-up", func(context *gin.Context) {
		authenticationController.SignUp(context, db)
	})
}
