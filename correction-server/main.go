package main

import (
	"correction-server/core"
	"correction-server/global"
	"correction-server/initialize"
)

func main() {
	global.SPC_VP = core.Viper()      // 初始化 viper 配置管理
	global.SPC_DB = initialize.Gorm() // 连接 mysql
	if global.SPC_DB != nil {
		db, _ := global.SPC_DB.DB()
		defer db.Close()
	}
	core.RunServer()
}
