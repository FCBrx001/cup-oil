/**
 * 用于处理OilbatchTrack 的逻辑路由
 * 数据库为my_files   vis_files
 */

//引入Router
const {Router} = require('express')
// 创建一个Router示例
let OilBatchTrack_router = new Router()

//引入查询cube
const vis_cube = require('../database/dao/vis_cube')

class testcube1 extends vis_cube{
    constructor() {
        // super('enping','testpc')
        // super('my_files','vis_files')
        super('my_files','newvar_files',0)
    }
}
var cube1 = new testcube1()

class testcube2 extends vis_cube{
    constructor() {
        super('Cube','压力1',0)
    }
}
var cube2 = new testcube1()

const ws = require("nodejs-websocket");
const position=['茂名','阳江','恩平','鹤山','江门','高明','花都','南海','顺德','南沙']
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
        console.log("pcgz Error."+reason)
    });
}).listen(3001);
setInterval(()=>{
    server.connections.forEach((conn)=>{
        cube1.vis_newoilfind().then(result=>{
            // var data = Object.values(result[0])
            // console.log(data)
            let pc_result=[]
            for(let i=0;i<position.length;i++){
                // let inj_time=Object.values(data[2].Inject_time[position[i]])
                // let inj_oil=Object.values(data[2].Inject_oil[position[i]])
                // let pre_time = Object.values(data[2].Pre_arrival_time[position[i]])
                // let location = Object.values(data[2].Batch_location[position[i]])
                // let batch_v = Object.values(data[2].Batch_volume[position[i]])
                // let mix_v = Object.values(data[2].Mix_oil_volume[position[i]])
                let inj_time=Object.values(result[12].data[position[i]]) //注入时间
                let inj_oil=Object.values(result[13].data[position[i]]) //注入油品
                let pre_time = Object.values(result[16].data[position[i]]) //预计到站时间
                let location = Object.values(result[19].data[position[i]]) //批次位置
                let batch_v = Object.values(result[0].data[position[i]]) //批次量
                let hy_v = Object.values(result[18].data[position[i]]) //混油量
                let mix_v = Object.values(result[17].data[position[i]]) //混油位置

                pc_result[i]={
                    time: inj_time,
                    inj_pc: i,
                    name:inj_oil,
                    pretime:pre_time,
                    data:location,
                    batch_v:batch_v,
                    mix_v:mix_v,
                    hy_v:hy_v
                }
            }
            conn.sendText(JSON.stringify(pc_result))
        })
    })
},1000)

console.log("pcgz server running ...");


OilBatchTrack_router.get('/test',function(req,res){
    cube1.vis_oilfind().then(result=>{
        var inj_time=Object.values(result[5].inject_time)
        var inj_oil=Object.values(result[5].inject_oil)
        var pre_time = Object.values(result[7].pre_arrival_time)
        var location = Object.values(result[3].data)
        var batch_v = Object.values(result[4].data)
        var pc_result=[]
        for(let i=0;i<inj_time.length-1;i++){
            var xx=Object.values(inj_time[i])
            
            for(let j in xx){
                if(xx[j]!=0){
                    pc_result[i]={
                        time: inj_time[i][j],
                        inj_pc: j,
                        name:inj_oil[i][j],
                        pretime:pre_time[i][j],
                        data:location[j][i],
                        batch_v:batch_v[j][i]   
                    }
                    break;
                }
            }
            if(xx.time==null){
                pc_result[i]={
                    time: '',
                    inj_pc: 0,
                    name:'',
                    pretime:'',
                    data:0,
                    batch_v:0    
                }
            }
        }
        // console.log(typeof(pc_result[0].batch_v))
        
        // for(let i in inj_time){
        //     for(let j in inj_time){
        //         if(inj_time!=0){
                    
        //         }
        //     }
        // }
        
        res.send(pc_result)
    })
    
})

OilBatchTrack_router.get('/data',function(req,res){
    //res.send('OilBatchTrack数据返回')
    var table = req.query.table
    var pre_table = `Pre-${table}`
    

    getdata0(table).then(data0=>{
        getdata1(pre_table).then(data1=>{
            //barvalueparent.push(data1[2]);
            if(data1!=null){
                data0.push(data1)
            }
            res.send(data0)
        })
    })
})

function inputdata(tablename,data){
    class OilBatch_cube extends vis_cube{
        constructor() {
            super('sys_data',`${tablename}`,0)
        }
    }
    var cube1 = new OilBatch_cube()
    cube1.vis_insert(tablename,data)
}

function getdata0(tablename){
    class OilBatch_cube extends vis_cube{
        constructor() {
            super('sys_data',`${tablename}`,0)
        }
    }
    var cube1 = new OilBatch_cube()

    return new Promise((resolve,reject)=>{

        cube1.vis_oilfind().then(ret=>{
            //返回数据
            var barvalue=[];
            var columnName=[];
            var time=[];
            var ydata=[];
            var frequent = 1;

            var columnLen= Object.getOwnPropertyNames(ret[0]).length;
            var key=Object.keys(ret[0]);
            var t='';
            for(let j=0;j<columnLen;j++)
            {   
                if(j==columnLen-1){
                    t=key[j];
                }
                if(j<columnLen-2)
                {
                    ydata[j]=new Array();
                    columnName.push(key[j]);
                }
            }
            for(let i=0;i<ret.length;i+=frequent){
                var value=Object.values(ret[i]);
                if(time==null||ret[i][t]!=time[time.length-1])
                { 
                    time.push(ret[i][t]);
                    for(let k=0;k<columnLen-2;k++){
                        ydata[k].push(parseFloat(value[k]))
                    }        
                }
            }
            barvalue.push(columnName);
            barvalue.push(time);
            barvalue.push(ydata);
            console.log(`【FINIFHED】-- ${tablename}--OilbatchTrack 数据处理完毕`)
            resolve(barvalue)
        })

    })
}

function getdata1(tablename){
    class OilBatch_cube extends vis_cube{
        constructor() {
            super('sys_data',`${tablename}`,0)
        }
    }
    var cube1 = new OilBatch_cube()


    return new Promise((resolve,reject)=>{
        cube1.vis_oilfind().then(ret=>{
            //返回数据
            var barvalue=[];
            var columnName=[];
            var time=[];
            var pretime=[];
            var frequent = 1;

            var columnLen= Object.getOwnPropertyNames(ret[0]).length;
            var key=Object.keys(ret[0]);
            var t='';
            for(let j=0;j<columnLen;j++){
                if(j==columnLen-1){
                    t=key[j];
                }
                if(j<columnLen-2){
                    pretime[j]=new Array();
                    // columnName.push(key[j]);
                }
            }
            for(let i=0;i<ret.length;i+=frequent){
                var value=Object.values(ret[i]);
                for(let k=0;k<columnLen-2;k++){
                    pretime[k].push(value[k])
                }
            }
            barvalue.push(columnName);
            barvalue.push(time);
            barvalue.push(pretime);
            console.log(`【FINIFHED】-- ${tablename}--OilbatchTrack 数据处理完毕`)
            resolve(pretime)
        })
    })
}
var stations=['茂名','阳江','恩平','鹤山','江门','高明','花都','南海']
OilBatchTrack_router.get('/input',function(req,res){
    var obj={}
    var station = stations[req.query.station]
/**
 * 修改后续
 */
    obj['station'] = station
    obj['index'] = req.query.index
    obj['data'] = req.query.data
    cube1.vis_update(obj).then(res=>{

    })
})

module.exports = OilBatchTrack_router;

