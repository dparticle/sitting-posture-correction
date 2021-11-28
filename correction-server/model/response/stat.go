package response

type TodayStat struct {
	Time    uint `json:"time"`
	OkNum   uint `json:"okNum"`
	FailNum uint `json:"failNum"`
}

type TotalStat struct {
	Time    float64 `json:"time"`
	OkNum   uint    `json:"okNum"`
	FailNum uint    `json:"failNum"`
}

type SevenTimeStat struct {
	Date string `json:"date"`
	Min  uint   `json:"min"`
}

type SevenNumStat struct {
	Date string `json:"date"`
	Num  uint   `json:"num"`
	Type string `json:"type"`
}
