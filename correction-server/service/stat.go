package service

import (
	"correction-server/global"
	"correction-server/model/response"
	"correction-server/utils"
	"fmt"
)

type StatService struct {
}

func (s *StatService) GetTotal() (interface{}, error) {
	var time uint
	var result response.TotalStat
	row := global.SPC_DB.Raw("SELECT SUM(duration) time, COUNT(CASE WHEN success = 1 THEN 1 END) ok_num, COUNT(CASE WHEN success = 0 THEN 1 END) fail_num " +
		" FROM record").Row()
	if err := row.Err() ; err != nil {
		return nil, err
	}
	row.Scan(&time, &result.OkNum, &result.FailNum)
	fmt.Println("time", time)
	result.Time = utils.ToHour(time)
	return &result, nil
}

func (s *StatService) GetToday() (interface{}, error) {
	var result response.TodayStat
	if err := global.SPC_DB.Raw("SELECT SUM(duration) time, COUNT(CASE WHEN success = 1 THEN 1 END) ok_num, COUNT(CASE WHEN success = 0 THEN 1 END) fail_num " +
		" FROM record " +
		" WHERE TO_DAYS(create_time) = TO_DAYS(NOW())").Scan(&result).Error; err != nil {
		return nil, err
	}
	result.Time = utils.ToMin(result.Time)
	return &result, nil
}

func (s *StatService) GetSevenTime() (interface{}, error) {
	var (
		days          string
		totalDuration uint
	)
	items := make([]*response.SevenTimeStat, 0)
	rows, err := global.SPC_DB.Raw("SELECT DATE_FORMAT(create_time,'%m-%d') days, SUM(duration) total_duration " +
		" FROM ( SELECT * FROM record WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time)) seven " +
		" GROUP BY days;").Rows()
	defer rows.Close()
	if err != nil {
		return nil, err
	}
	offset := -6
	for rows.Next() {
		rows.Scan(&days, &totalDuration)
		for offset <= 0 {
			d := utils.GetDateWithMonthAndDay(offset)
			offset++
			if days == d {
				items = append(items, &response.SevenTimeStat{
					Date: days,
					Min: utils.ToMin(totalDuration),
				})
				break
			} else {
				items = append(items, &response.SevenTimeStat{
					Date: d,
					Min: 0,
				})
			}
		}
	}
	return items, nil
}

func (s *StatService) GetSevenNum() (interface{}, error) {
	var (
		days    string
		okNum   uint
		failNum uint
	)
	items := make([]*response.SevenNumStat, 0)
	rows, err := global.SPC_DB.Raw("SELECT DATE_FORMAT(create_time,'%m-%d') days, COUNT(CASE WHEN success = 1 THEN 1 END) ok_num, COUNT(CASE WHEN success = 0 THEN 1 END) fail_num " +
		" FROM (SELECT * FROM record WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time)) seven " +
		" GROUP BY days;").Rows()
	defer rows.Close()
	if err != nil {
		return nil, err
	}
	offset := -6
	for rows.Next() {
		rows.Scan(&days, &okNum, &failNum)
		for offset <= 0 {
			d := utils.GetDateWithMonthAndDay(offset)
			offset++
			if days == d {
				items = append(items, &response.SevenNumStat{
					Date: days,
					Num:  okNum,
					Type: "成功",
				})
				items = append(items, &response.SevenNumStat{
					Date: days,
					Num:  failNum,
					Type: "失败",
				})
				break
			} else {
				items = append(items, &response.SevenNumStat{
					Date: d,
					Num:  0,
					Type: "成功",
				})
				items = append(items, &response.SevenNumStat{
					Date: d,
					Num:  0,
					Type: "失败",
				})
			}
		}
	}
	return items, nil
}
