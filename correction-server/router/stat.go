package router

import (
	v1 "correction-server/api/v1"
	"github.com/gin-gonic/gin"
)

type StatRouter struct {
}

func (s StatRouter) InitStatRouter(Router *gin.RouterGroup) {
	customerRouter := Router.Group("/v1/stat")
	var statApi = v1.ApiGroupApp.StatApi
	{
		customerRouter.POST("get_today", statApi.GetToday)
		customerRouter.POST("get_total", statApi.GetTotal)
		customerRouter.POST("get_seven_time", statApi.GetSevenTime)
		customerRouter.POST("get_seven_num", statApi.GetSevenNum)
	}
}
