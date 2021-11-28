package initialize

import (
	"correction-server/global"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Gorm() *gorm.DB {
	m := global.SPC_CONFIG.Mysql
	if m.Dbname == "" {
		return nil
	}
	mysqlConfig := mysql.Config{
		DSN:                       m.Dsn(),   // DSN data source name
		DefaultStringSize:         255,   // string 类型字段的默认长度
		// TODO other config see gva
	}
	fmt.Println("1111", m)
	// TODO zap gormConfig see gva
	if db, err := gorm.Open(mysql.New(mysqlConfig), &gorm.Config{}); err != nil {
		return nil
	} else {
		sqlDB, _ := db.DB()
		sqlDB.SetMaxIdleConns(m.MaxIdleConns)
		sqlDB.SetMaxOpenConns(m.MaxOpenConns)
		return db
	}
}
