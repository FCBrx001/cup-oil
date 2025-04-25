/**
 * 用于处理OilbatchTrack 的逻辑路由
 * 数据库为mm-ss
 */

//引入Router
const {Router} = require('express')
// 创建一个Router示例
let realmonitor_router = new Router()

//引入查询cube
const vis_cube = require('../database/dao/cubes')

realmonitor_router.get('/paramdata',function(req,res){
    var stationname = req.query.stationname
    // console.log('站名',stationname+'1')

    class paramcube extends vis_cube{
        constructor(){
            super(`${stationname}`,`${stationname+'1'}`)
        }
    }
    var cube = new paramcube;
    cube.vis_findtablename().then(ret=>{
        var tablename = []
        for(var i=8;i<ret.length;i++){
            tablename[i-8]=ret[i]
        }
        // console.log('站名',stationname+'1')
        // console.log('表名',tablename)
        res.send(tablename)
    })
})



realmonitor_router.get('/data',function(req,res){
    //res.send('realmonitor_router数据返回')

    var stationname = req.query.stationname
    // console.log('站名',stationname+'1')

    var timespan = req.query.timespan
    //原始时间值
    var start_value = req.query.start_value
    var over_value = req.query.over_value

    var obj = req.query.obj
    // console.log("已选参数 ",obj)
    var objlength = obj.length //参数长度，用于返回时的数据变化

    obj.push('time')
    // console.log('timespan',timespan)
    
    var start_year = start_value.split("-")
    var start_day = parseInt(start_year[2].split(" ")[0])
    var syear = parseInt(start_year[0])
    var smonth = parseInt(start_year[1])
    var startdate =[]
    startdate.push(syear)
    startdate.push(smonth)
    startdate.push(start_day)


    var over_year = over_value.split("-")
    var over_day = parseInt(over_year[2].split(" ")[0]) 
    var oyear = parseInt(over_year[0])
    var omonth = parseInt(over_year[1])
    var overdate = []
    overdate.push(oyear)
    overdate.push(omonth)
    overdate.push(over_day)
    
    class paramcube extends vis_cube{
        constructor(){
            super(`${stationname}`,`${stationname+'1'}`)
        }
    }
    var cube1 = new paramcube;
    
    cube1.vis_oilfindBy_timeandobj(start_value,over_value,obj).then(ret=>{
        //返回数据
        var linevalue = []
        // console.log('返回结果',ret)
        var length = ret.length
        var time = []  //时间值  返回的x轴
        var series = new Array(objlength)   //参数值   返回的多个y值
        for(let i=0;i<objlength;i++)
        {
            series[i] = []
        }
        // console.log('objlength',objlength)

        for(let i=0;i<length;i++)
        {
            time.push(ret[i].time)
            
            for(let j=0;j<objlength;j++)
            { 
                series[j].push(parseFloat(ret[i][obj[j]]))
            }

        }
        // console.log('时间值：',time)
        // console.log('参数值：',series)
        linevalue.push(time)
        linevalue.push(series)
        // console.log('linevalue值得：',linevalue)
        res.send(linevalue)

    })
    
})

module.exports = realmonitor_router;

