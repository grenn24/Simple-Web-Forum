package utils

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func setCookie(context *gin.Context, cookieName string, cookieValue string, maxAge int, path string, domain string, httpOnly bool, secure bool, sameSite string) {
	context.Writer.Header().Add("Set-Cookie", fmt.Sprintf("%v=%v; Max-Age=%v; Path=%v; Domain=%v; HttpOnly=%v; Secure=%v; SameSite=%v", cookieName, cookieValue, maxAge, path, domain, httpOnly, secure, sameSite))
}
