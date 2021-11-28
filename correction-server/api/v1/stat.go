package v1

import (
	"correction-server/service"
	"fmt"
	"github.com/gin-gonic/gin"
)

var statService = service.ServiceGroupApp.StatService

type StatApi struct {

}

func (s *StatApi) GetTotal(c *gin.Context) {
	if res, err := statService.GetTotal(); err != nil {
		fmt.Println("获取总状况错误", err)
		c.JSON(500, err)
	} else {
		c.JSON(200, res)
	}
}

func (s *StatApi) GetToday(c *gin.Context) {
	if res, err := statService.GetToday(); err != nil {
		fmt.Println("获取今日状况错误", err)
		c.JSON(500, err)
	} else {
		c.JSON(200, res)
	}
}

func (s *StatApi) GetSevenTime(c *gin.Context) {
	if items, err := statService.GetSevenTime(); err != nil {
		fmt.Println("获取近 7 日总时长数据错误", err)
		c.JSON(500, err)
	} else {
		c.JSON(200, items)
	}
}

func (s *StatApi) GetSevenNum(c *gin.Context) {
	if items, err := statService.GetSevenNum(); err != nil {
		fmt.Println("获取近 7 日成功 / 失败次数数据错误", err)
		c.JSON(500, err)
	} else {
		c.JSON(200, items)
	}
}