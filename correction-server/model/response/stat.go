package response

type GridStat struct {
	Time    uint `json:"time"`
	OkNum   uint `json:"okNum"`
	FailNum uint `json:"failNum"`
}

type SevenTimeStat struct {
	Date string `json:"date"`
	Time uint   `json:"time"`
}

type SevenNumStat struct {
	Date string `json:"date"`
	Num  uint   `json:"num"`
	Type string `json:"type"`
}
