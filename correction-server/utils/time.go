package utils

import "time"

func GetDateWithMonthAndDay(offset int) string {
	today := time.Now()
	offsetTime := today.AddDate(0, 0, offset)
	return offsetTime.Format("01-02")
}
