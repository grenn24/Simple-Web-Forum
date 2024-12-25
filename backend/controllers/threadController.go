package controllers

import (
	"github.com/gin-gonic/gin"
)

func GetAllThreads(context *gin.Context) {
	context.JSON(200, gin.H{"title":"gren"})
}