package global

import (
	"correction-server/config"
	"github.com/spf13/viper"
	"gorm.io/gorm"
)

var (
	SPC_VP  *viper.Viper
	SPC_DB     *gorm.DB
	SPC_CONFIG config.Server
)
