package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/services"
)

func AuthenticationRoutes(router *gin.RouterGroup, db *sql.DB) {
	authenticationRouter := router.Group("/authentication")

	// Initialise controller handlers
	authenticationController := &controllers.AuthenticationController{AuthenticationService: &services.AuthenticationService{
		DB: db,
	}}

	// GET for sending auth token
	authenticationRouter.GET("/oauth", func(context *gin.Context) {
		authenticationController.OAuth(context, db)
	})
	// POST for sending auth code
	authenticationRouter.POST("/oauth", func(context *gin.Context) {
		authenticationController.OAuth(context, db)
	})

	authenticationRouter.POST("/log-in", func(context *gin.Context) {
		authenticationController.LogIn(context, db)
	})

	

	authenticationRouter.POST("/sign-up/check-availability", func(context *gin.Context) {
		authenticationController.SignUpCheckAvailability(context, db)
	})

	authenticationRouter.POST("/sign-up", func(context *gin.Context) {
		authenticationController.SignUp(context, db)
	})

	authenticationRouter.GET("/refresh-jwt-token", func(context *gin.Context) {
		authenticationController.RefreshJwtToken(context, db)
	})

	authenticationRouter.GET("/validate-jwt-token", func(context *gin.Context) {
		authenticationController.ValidateJwtToken(context, db)
	})

	authenticationRouter.GET("/log-out", func(context *gin.Context) {
		authenticationController.LogOut(context, db)
	})
}
