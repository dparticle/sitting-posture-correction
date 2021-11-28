package utils

import (
	"fmt"
	"strconv"
	"time"
)

func GetDateWithMonthAndDay(offset int) string {
	today := time.Now()
	offsetTime := today.AddDate(0, 0, offset)
	return offsetTime.Format("01-02")
}

func ToMin(time uint) uint {
	return time / 60 / 1000
}

func ToHour(time uint) float64 {
	value, _ := strconv.ParseFloat(fmt.Sprintf("%.1f", float64(time) / 60 / 60 / 1000), 64)
	return value
}