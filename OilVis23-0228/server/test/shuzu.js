var obj = [
    {
      itemID: '茂名.下载.下载1',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 174.14065551757812
    },
    {
      itemID: '茂名.下载.下载2',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 258.1632080078125
    },
    {
      itemID: '茂名.压力表.进站压力',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 0.9360643625259399
    },
    {
      itemID: '茂名.压力表.出站压力',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 0.9587550163269043
    },
    {
      itemID: '茂名.压力表.出口压力',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 0.08339100331068039
    },
    {
      itemID: '茂名.压力表.减压阀后压力',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 0.18485400080680847
    },
    {
      itemID: '茂名.流量计.出站流量',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 0
    },
    {
      itemID: '茂名.流量计.出站1',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 0
    },
    {
      itemID: '茂名.流量计.出站2',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 0
    },
    {
      itemID: '茂名.温度计.进站温度',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 29.159103393554688
    },
    {
      itemID: '茂名.温度计.出站温度',
      year: 2021,
      month: 12,
      day: 15,
      hour: 21,
      value: 34.03874206542969
    }
  ]

function asd (obj){
    console.log(obj.length)
    var num =[]
    var year = {year:obj[0].year}
    var month = {month:obj[0].month}
    var day = {day:obj[0].day}
    var hour = {hour:obj[0].hour}
    num.push(year)
    num.push(month)
    num.push(day)
    num.push(hour)
    for(var i=0;i<obj.length;i++)
    {
        var key = `${obj[i].itemID}`
        var canshu = {}
        canshu[key]=obj[i].value
        console.log(canshu)
        num.push(canshu)
    }
    console.log(num)
}

asd(obj)