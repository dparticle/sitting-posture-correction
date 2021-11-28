package core

import (
	"correction-server/global"
	"correction-server/initialize"
	"fmt"
	"time"
)

type server interface {
	ListenAndServe() error
}

func RunServer() {
	Router := initialize.Routers()

	address := fmt.Sprintf(":%d", global.SPC_CONFIG.System.Addr)
	s := initServer(address, Router)
	// 保证文本顺序输出
	// In order to ensure that the text order output can be deleted
	time.Sleep(10 * time.Microsecond)
	fmt.Println("server run success on address", address)

	fmt.Println(s.ListenAndServe().Error())
}
