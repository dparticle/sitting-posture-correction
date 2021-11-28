package initialize

import (
	"correction-server/middleware"
	"correction-server/router"
	"github.com/gin-gonic/gin"
)

// Routers 初始化总路由
func Routers() *gin.Engine {
	var Router = gin.Default()

	// 跨域
	Router.Use(middleware.Cors())
	// 获取路由组实例
	statRouter := router.RouterGroupApp.StatRouter

	PublicGroup := Router.Group("")
	{
		statRouter.InitStatRouter(PublicGroup)
	}

	return Router
}
