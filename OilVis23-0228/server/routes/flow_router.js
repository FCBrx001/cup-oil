/**
 * 用于处理200s数据的逻辑路由
 */

//引入Router
const {Router} = require('express')
// 创建一个Router示例
let flow_router = new Router()

//引入查询cube
const vis_cube = require('../database/dao/vis_cube')

//表3的cube结构
class testcube4 extends vis_cube{
    constructor() {
        super('计算结果','南沙全线',0)
    }
}
var cube4 = new testcube4()

class testcube5 extends vis_cube{
    constructor() {
        super('计算结果','表格数据',0)
    }
}
var cube5 = new testcube5()

class testcube6 extends vis_cube{
    constructor() {
        super('计算结果','南沙-茂名全线',0)
    }
}
var cube_time = new testcube6()

var datalength = 241
const ws = require("nodejs-websocket");
const server = ws.createServer(function(conn){
    console.log('new connection for sljs...')
    conn.on("text",function(e){
        //服务端打印接收到的数据
        console.log("News:" + e);
        if(e==='南海'||e==='花都'){
            console.log("南海")
            datalength = 241
            cube4.setcollectionName('南沙全线')
        }else {
            datalength = 261
            cube4.setcollectionName('茂名-江门')
        }  
        //接收到的数据打上标记“Server-”，再发送回客户端
        // conn.sendText("Server-"+str);
    });

    conn.on("close",function(code,reason) {
        console.log("sljs Disconnected.");
    });

    conn.on("error",function(code,reason) {
        console.log("sljsError."+reason)
    });
}).listen(3011);

const server2 = ws.createServer(function(conn){
    console.log('new connection for time...')
    conn.on("text",function(e){
        //服务端打印接收到的数据
        // console.log(e)
        //接收到的数据打上标记“Server-”，再发送回客户端
        // conn.sendText("Server-"+str);
        // if(e==='南海'||e==='花都'){
        //     console.log("南海")
        //     datalength = 241
        //     cube_time.setcollectionName('南沙全线')
        // }else {
        //     datalength = 261
        //     cube_time.setcollectionName('南沙-茂名全线')
        // } 
    });

    conn.on("close",function(code,reason) {
        console.log("time Disconnected.");
    });

    conn.on("error",function(code,reason) {
        console.log("timesql Error."+reason)
    });
}).listen(3002);

const server_time = ws.createServer(function(conn){
    console.log('new connection for data_time...')
    conn.on("text",function(e){
        //服务端打印接收到的数据
        // console.log(e)
        //接收到的数据打上标记“Server-”，再发送回客户端
        // conn.sendText("Server-"+str);
    });

    conn.on("close",function(code,reason) {
        console.log("time Disconnected.");
    });

    conn.on("error",function(code,reason) {
        console.log("data_time Error."+reason)
    });
}).listen(3022);

setInterval(()=>{
    server.connections.forEach((conn)=>{
        cube4.vissl_findlastone().then(result=>{
            var ydata=Object.values(result[0])
            var value1=[]
            var value2=[]
            var value3=[]
            var value4=[]
            var value5=[]
            var linevalue=[]
            for(let i=0;i<datalength;i++){
                value1.push(parseFloat(ydata[i]['里程（km）']).toFixed(2))
                value2.push(parseFloat(ydata[i]['扬程（m）']).toFixed(1))
                value3.push(parseFloat(ydata[i]['压力（MPa）']).toFixed(2))
                value4.push(parseFloat(ydata[i]['流量（m3/h）']).toFixed(1))
                value5.push(parseFloat(ydata[i]['高程（m）']).toFixed(2))
            }
            linevalue.push(value1)
            linevalue.push(value2)
            linevalue.push(value3)
            linevalue.push(value4)
            linevalue.push(value5)
            // console.log(result)
            conn.sendText(JSON.stringify(linevalue))
        })
        
    })
    server2.connections.forEach(conn=>{
        cube5.vis_findlast().then(result=>{
            value={}
            value['阳江']=result[0][0]
            value['恩平']=result[0][1]
            value['鹤山']=result[0][2]
            value['高明']=result[0][4]
            value['江门']=result[0][3]
            value['三水']=result[0][5]
            value['花都']=result[0][6]
            value['南海']=result[0][7]
            // console.log(value)
            conn.sendText(JSON.stringify(value))
        })
    })
    server_time.connections.forEach(conn=>{
        cube_time.time_find().then(result=>{
            // console.log("result")
            var linevalue=[]
            var position=[]
            var lines_yl=[]
            var lines_ll=[]
            var value2=[]
            var value3=[]
            var value4=[]
            var ydata=Object.values(result[0])
            for(let i in ydata){
                position.push(parseFloat(ydata[i]['里程（km）']).toFixed(2))
                value2.push(parseFloat(ydata[i]['高程（m）']).toFixed(2))
                value3.push(parseFloat(ydata[i]['压力（MPa）']).toFixed(2))
                value4.push(parseFloat(ydata[i]['流量（m3/h）']).toFixed(2))
            }
            
            lines_ll.push(value4)
            lines_yl.push(value3)
            for(let i=1;i<result.length;i++){
                ydata=Object.values(result[i])
                value3=[]
                value4=[]
                for(let i in ydata){
                    value2.push(parseFloat(ydata[i]['高程（m）']).toFixed(2))
                    value3.push(parseFloat(ydata[i]['压力（MPa）']).toFixed(2))
                    value4.push(parseFloat(ydata[i]['流量（m3/h）']).toFixed(2))
                }
                lines_ll.push(value4)
                lines_yl.push(value3)
            }
            linevalue.push(position)
            linevalue.push(lines_yl)
            linevalue.push(lines_ll)
            linevalue.push(value2)
            // console.log("正在发送数据")
            conn.sendText(JSON.stringify(linevalue))
        })
    })
},5000)

console.log("sljs server running ...");
console.log("time server running ...");

module.exports = flow_router;
