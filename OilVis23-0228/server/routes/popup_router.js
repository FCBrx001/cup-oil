/**
 * 用于处理弹窗的逻辑路由
 */

//引入Router
const {Router} = require('express')
// 创建一个Router示例
let popup_router = new Router()

station_name_dic = {'茂名': ['time', 'STN02_00_PI001', 'STN02_00_PI012', 'STN02_00_PI301','STN02_00_PI009',],
                    '阳江': ['time','STN03_00_PI001', 'STN03_00_PI008', 'STN03_00_PIC004','STN03_00_PI005'],
                    '恩平': ['time',  'STN04_00_PI001', 'STN04_00_PI007'],
                    '鹤山': ['time',  'STN05_00_PI001', 'STN05_00_PI011', 'STN05_00_PIC007','STN05_00_PI008'],
                    '江门': ['time', 'STN06_00_PI001', 'STN06_00_PI007',],
                    '高明': ['time', 'STN19_00_PI001', 'STN19_00_PI027', 'STN19_00_PI022A','STN19_00_PI036A'],
                    '三水': ['time','STN20_00_PI001', 'STN20_00_PI007'],
                    '花都': ['time',  'STN22_00_PI001', 'STN22_00_PIC005'],
                    '南海': ['time',  'STN21_00_PI001', 'STN21_00_PIC005']}

//引入查询cube
const vis_cube = require('../database/dao/cubes')
// class work_warn_cube extends vis_cube{
//     constructor() {
//         super('pipeline','work_warn')
//     }
// }
class work_warn_cube extends vis_cube{
    constructor(stationname,collectionname) {
        super(`${stationname}`,`${collectionname}`)
    }
}
var cube1 = new work_warn_cube()
//新增
popup_router.get('/warn_zql',function(req,res){
    var stationname =  req.query.stationname
    var collectionname = req.query.collectionname
    var gkname = req.query.gkname
    var createcube = new work_warn_cube(stationname,collectionname)
    
    createcube.vis_findzql(gkname).then(data=>{
        res.send(data)
    })

})
popup_router.get('/warn_zql_sure',function(req,res){
    var stationname =  req.query.stationname
    var collectionname = req.query.collectionname
    var gkname = req.query.gkname
    var createcube = new work_warn_cube(stationname,collectionname)
    
    createcube.vis_sure_zql(gkname).then(data=>{
        
        res.send(data)
    })

})
popup_router.get('/warn_zql_error',function(req,res){
    var stationname =  req.query.stationname
    var collectionname = req.query.collectionname
    var gkname = req.query.gkname
    var createcube = new work_warn_cube(stationname,collectionname)
    createcube.vis_error_zql(gkname).then(data=>{
        res.send(data)
    })
})

//新增
popup_router.get('/warn_gkstatis',function(req,res){
    var stationname =  req.query.stationname
    var collectionname = req.query.collectionname
    var createcube = new work_warn_cube(stationname,collectionname,1)
    createcube.vis_gkstatis().then(data=>{
        res.send(data)
    })

})
//新增websocket
const ws = require("nodejs-websocket");

const server = ws.createServer(function(conn){
    console.log('new connection for pcgz...')
    conn.on("text",function(e){
        switch(e){
            case 'close':
                console.log("当前链接已断开")
                conn.close()
                break;
            default:
                break;
        }
//服务端打印接收到的数据
// console.log("News:" + str);
//接收到的数据打上标记“Server-”，再发送回客户端
// conn.sendText("Server-"+str);
    });

    conn.on("close",function(code,reason) {
        console.log("pcgz Disconnected.");
    });

    conn.on("error",function(code,reason) {
        console.log("Error."+reason)
    });
}).listen(3010);

console.log("pcgz server running ...");
var mm_cube = new work_warn_cube('茂名','label')
var yj_cube = new work_warn_cube('阳江','label')
var ep_cube = new work_warn_cube('恩平','label')
var hs_cube = new work_warn_cube('鹤山','label')
var jm_cube = new work_warn_cube('江门','label')
var gm_cube = new work_warn_cube('高明','label')
var ss_cube = new work_warn_cube('三水','label')
var hd_cube = new work_warn_cube('花都','label')
var nh_cube = new work_warn_cube('南海','label')
setInterval(()=>{
    server.connections.forEach((conn)=>{
        var result = new Array(9);
        mm_cube.vis_findlastonetest().then(data0=>{
            result[0] = data0
            yj_cube.vis_findlastonetest().then(data1=>{
                result[1] = data1
                ep_cube.vis_findlastonetest().then(data2=>{
                    result[2] = data2
                    hs_cube.vis_findlastonetest().then(data3=>{
                        result[3] = data3
                        jm_cube.vis_findlastonetest().then(data4=>{
                            result[4] = data4
                            gm_cube.vis_findlastonetest().then(data5=>{
                                result[5] = data5
                                ss_cube.vis_findlastonetest().then(data6=>{
                                    result[6] = data6
                                    hd_cube.vis_findlastonetest().then(data7=>{
                                        result[7] = data7
                                        nh_cube.vis_findlastonetest().then(data8=>{
                                            result[8] = data8
                                            conn.sendText(JSON.stringify(result))
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })         
    })
},60000)
//新增结束

//获取最近一条工况信息

popup_router.get('/warn_check',function(req,res){
    var stationname =  req.query.stationname
    var collectionname = req.query.collectionname
    var createcube = new work_warn_cube(stationname,collectionname)
    createcube.vis_findlastonetest().then(data=>{
        res.send(data)
    })
})
//获取历史工况表单
popup_router.get('/warn_page',function(req,res){
    let pagenum = req.query.pagenum
    let pagesize = req.query.pagesize
    var stationname =  req.query.stationname
    var collectionname = req.query.collectionname
    var createcube = new work_warn_cube(stationname,collectionname)
    var resdata = []
    createcube.vis_findByPage(pagenum,pagesize).then(data=>{
        // resdata.push(length)
        resdata.push(data)
    })
    createcube.vis_oilfinddatalen().then(data=>{
        // console.log('警告数据条数',data.length)
        resdata.push(data.length)
    
        res.send(resdata)
    })
})
//警告确认
popup_router.get('/warn_sure',function(req,res){
    //修改状态值
    var rowid = parseInt(req.query.uuid)
    var stationname =  req.query.stationname
    var collectionname = req.query.collectionname
    var createcube = new work_warn_cube(stationname,collectionname)
    // console.log('uuid',rowid)
    createcube.vis_sureupdate(rowid).then(data=>{
        res.send('success')
    })

    //新增，修改确认准确率值
    var gkname;
    var obj = {}
    obj['valve_state'] = req.query.valve_state
    obj['valve_leakage'] = req.query.valve_leakage
    obj['pig_state'] = req.query.pig_state
    obj['pump_state'] = req.query.pump_state

    if(req.query.pig_state!='---'){
        gkname = '清管'
    }
    if(req.query.pump_state!='---'){
        gkname = '甩泵'
    }
    if(req.query.valve_leakage!='---'){
        gkname = '阀门内漏'
    }
    if(req.query.valve_state!='---'){
        gkname = '开关阀'
    }
    
    // console.log('工况名：',gkname)  
    // createcube.setdbAndcolName(stationname,'gkzql')
    var zqlcube = new work_warn_cube(stationname,'gkzql')
    zqlcube.vis_sure_zql(gkname).then(data=>{
        // console.log('正确准确率',data)
    })
    
})
popup_router.get('/warn_correct', function(req,res){
    // console.log('warn_correct测试')
    //修改新库
    var obj = {}
    var stationname =  req.query.stationname
    
    obj['valve_state'] = req.query.new_valve_state
    obj['valve_leakage'] = req.query.new_valve_leakage
    obj['pig_state'] = req.query.new_pig_state
    obj['pump_state'] = req.query.new_pump_state
    obj['other_state']= req.query.other_state

    

    var datatime = req.query.datetime
    
    var findcube = new work_warn_cube(stationname,`${stationname}1`)

    let params = station_name_dic[stationname]
    // console.log('各站参数：',params)
    //【1】、查找最近20条数据
    findcube.findlabeldataBydatatime(datatime,20,params).then(data=>{
        var stationname =  req.query.stationname
        for(let key in obj){
            if(obj[key]!=''){
                var insertcube = new work_warn_cube('工况',key)
                //方案1
                // insertcube.vis_insert(key,data)
                //方案2
                insertcube.vis_insert2(key,data,obj[key],stationname,1)
            }
        }
        //【2】、新增，修改状态值
        var rowid = parseInt(req.query.uuid)
        var stationname =  req.query.stationname
        var statecube = new work_warn_cube(stationname,'label')
        statecube.vis_sureupdate(rowid).then(data2=>{
            //【3】、新增，修改错误准确率值
            var gkname;
            if(req.query.pig_state!='---'){
                gkname = '清管'
            }
            if(req.query.pump_state!='---'){
                gkname = '甩泵'
            }
            if(req.query.valve_leakage!='---'){
                gkname = '阀门内漏'
            }
            if(req.query.valve_state!='---'){
                gkname = '开关阀'
            }
            var zqlcube = new work_warn_cube(stationname,'gkzql')
            zqlcube.vis_error_zql(gkname).then(data3=>{
                //【4】、处理结束返回success
                res.send('success')
            })
        })
    })
});
popup_router.get('/warn_inserone',function(req,res){
    var uuid = req.query.uuid
    var obj = {}
    obj['station'] = req.query.station
    obj['uuid'] =req.query.uuid
    obj['valve_state'] = req.query.valve_state
    obj['valve_leakage'] = req.query.valve_leakage
    obj['pig_state'] = req.query.pig_state
    obj['pump_state'] = req.query.pump_state
    obj['state'] = req.query.state
    var stationname = req.query.stationname
    var collectionname = req.query.collectionname
    var createcube = new work_warn_cube(stationname,collectionname)
    createcube.vis_insert(collectionname,obj).then(data=>{
        res.send('success')
    })

})
//获取最近n条工况
popup_router.get('/warn_init',function(req,res){
    
    
    var stationname = req.query.stationname
    var collectionname = req.query.collectionname
    // console.log('站名、表名',stationname,collectionname)
    var number = parseInt(req.query.number) 
    var createcube = new work_warn_cube(stationname,collectionname)
    createcube.vis_findlastone(number).then(data=>{
        // console.log('最近n条数据：',data)
        res.send(data)
    })

})


popup_router.get('/qxgk',function(req,res){
    
    var mm_cube_zql = new work_warn_cube('茂名','gkzql')
    var yj_cube_zql = new work_warn_cube('阳江','gkzql')
    var ep_cube_zql = new work_warn_cube('恩平','gkzql')
    var hs_cube_zql = new work_warn_cube('鹤山','gkzql')
    var jm_cube_zql = new work_warn_cube('江门','gkzql')
    var gm_cube_zql = new work_warn_cube('高明','gkzql')
    var ss_cube_zql = new work_warn_cube('三水','gkzql')
    var hd_cube_zql = new work_warn_cube('花都','gkzql')
    var nh_cube_zql = new work_warn_cube('南海','gkzql')

    var gk = new Array(4)
    for(var i=0;i<4;i++){
        gk[i] = new Array(9)
    }

    var result = new Array(9);
        mm_cube_zql.find_all().then(data0=>{
            result[0] = data0
            yj_cube_zql.find_all().then(data1=>{
                result[1] = data1
                ep_cube_zql.find_all().then(data2=>{
                    result[2] = data2
                    hs_cube_zql.find_all().then(data3=>{
                        result[3] = data3
                        jm_cube_zql.find_all().then(data4=>{
                            result[4] = data4
                            gm_cube_zql.find_all().then(data5=>{
                                result[5] = data5
                                ss_cube_zql.find_all().then(data6=>{
                                    result[6] = data6
                                    hd_cube_zql.find_all().then(data7=>{
                                        result[7] = data7
                                        nh_cube_zql.find_all().then(data8=>{
                                            result[8] = data8
                                            // console.log('工况准确率：',result)
                                            for(var i=0;i<9;i++){
                                                let s_gk = Object.values(result[i])
                                                // console.log(s_gk)
                                                for(var j=1;j<5;j++){
                                                    gk[j-1][i] = s_gk[j].datatime
                                                }
                                            }
                                            // console.log('工况准确率：',gk)
                                            res.send(gk)
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })         

})

module.exports = popup_router;