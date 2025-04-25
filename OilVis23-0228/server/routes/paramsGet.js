const {Router} = require('express')
// 创建一个Router示例
let paramsGet = new Router()

//引入查询cube
const vis_cube = require('../database/dao/vis_cube')
//表1的cube结构

class params_cube extends vis_cube{
    constructor(stationname,collectionname) {
        super(`${stationname}`,`${collectionname}`,0)
    }
}
var mm_cube = new params_cube('茂名','茂名1',0)
var yj_cube = new params_cube('阳江','阳江1',0)
var ep_cube = new params_cube('恩平','恩平1',0)
var hs_cube = new params_cube('鹤山','鹤山1',0)
var jm_cube = new params_cube('江门','江门1',0)
var gm_cube = new params_cube('高明','高明1',0)
var ss_cube = new params_cube('三水','三水1',0)
var hd_cube = new params_cube('花都','花都1',0)
var nh_cube = new params_cube('南海','南海1',0)

const ws = require("nodejs-websocket");
const server = ws.createServer(function(conn){
    console.log('new connection for params...')
    conn.on("text",function(e){
        switch(e){
            case 'close':
                console.log("当前链接已断开")
                conn.close()
                break;
            default:
                break;
        }
    });

    conn.on("close",function(code,reason) {
        console.log("params Disconnected.");
    });

    conn.on("error",function(code,reason) {
        console.log("params get Error."+reason)
    });
}).listen(3091)

var name={
    茂名:[
        "STN02_00_PI001A","STN02_00_PI001","STN02_00_PI012","STN02_00_PI012A","STN02_00_PI013A",
        "STN02_00_DI001A",
        "STN02_00_FI022B","STN02_00_FI021B",
    ],
    阳江:[
        "STN03_00_PI001A","STN03_00_PI001","STN03_00_PI008","STN03_00_PI008A","STN03_00_PI009A",
        "STN03_00_DI001A",
        "STN03_00_FI003","STN03_00_FI004","STN03_02_FIQ201","STN03_02_FIQ202",
    ],
    恩平:[
        "STN04_00_PI001A","STN04_00_PI001","STN04_00_PI007",
        "STN04_00_DI001A",
        "STN04_00_FI003","STN04_02_FIC201","STN04_02_FIC202",
    ],
    鹤山:[
        "STN05_00_PI001A","STN05_00_PI001","STN05_00_PI012B","STN05_00_PI011","STN05_00_PI011A",
        "STN05_00_DI001A",
        "STN05_00_FI004","STN05_00_FI003","STN05_02_FIC201","STN05_02_FIC202",
    ],
    江门:[
        "STN06_00_PI001A","STN06_00_PI001","STN06_00_PI007A","STN06_00_PI007",
        "STN06_00_DI001A",
        "STN06_00_FI003","STN06_00_FI3301","STN06_00_FI3302",
    ],
    高明:[
        "STN19_00_PI001A","STN19_00_PI001","STN19_00_PI027","STN19_00_PI027A",
        "STN19_00_DI001A",
        "STN19_00_FI003","STN19_02_FIC201","STN19_02_FIC202","STN19_02_FIC202A",
    ],
    三水:[
        "STN20_00_PI001A","STN20_00_PI001","STN20_00_PI001B","STN20_00_PI001C","STN20_00_PI007","STN20_00_PI008",
        "STN20_00_DI001A",
        "STN20_00_FI004","STN20_02_FIC201","STN20_02_FIC202",
    ],
    花都:[
        "STN22_00_PI001A","STN22_00_PI001",
        "STN22_00_DI001A",
        "STN22_00_FI003","STN22_02_FIC201","STN22_02_FIC202",
    ],
    南海:[
        "STN21_00_PI001A","STN21_00_PI001",
        "STN21_00_DI001A",
        "STN21_00_FI001","STN21_02_FIC201","STN21_02_FIC202",
    ],
}


setInterval(()=>{
    server.connections.forEach((conn)=>{
        var result = {}
        mm_cube.vissl_findlastone().then(result_mm=>{
            for(let i =0 ;i<name["茂名"].length;i++){
                result[name["茂名"][i]] = result_mm[0][name["茂名"][i]]
                // console.log(result)
            }
            yj_cube.vissl_findlastone().then(result_yj=>{
                for(let i=0; i< name["阳江"].length;i++){
                    result[name["阳江"][i]] = result_yj[0][name["阳江"][i]]
                }
                ep_cube.vissl_findlastone().then(result_ep=>{
                    for(let i=0; i< name["恩平"].length;i++){
                        result[name["恩平"][i]] = result_ep[0][name["恩平"][i]]
                    }
                    hs_cube.vissl_findlastone().then(result_hs=>{
                        for(let i=0; i< name["鹤山"].length;i++){
                            result[name["鹤山"][i]] = result_hs[0][name["鹤山"][i]]
                        }
                        jm_cube.vissl_findlastone().then(result_jm=>{
                            for(let i=0; i< name["江门"].length;i++){
                                result[name["江门"][i]] = result_jm[0][name["江门"][i]]
                            }
                            gm_cube.vissl_findlastone().then(result_gm=>{
                                for(let i=0; i< name["高明"].length;i++){
                                    result[name["高明"][i]] = result_gm[0][name["高明"][i]]
                                }
                                ss_cube.vissl_findlastone().then(result_ss=>{
                                    for(let i =0;i< name["三水"].length;i++){
                                        result[name["三水"][i]] = result_ss[0][name["三水"][i]]
                                    }
                                    hd_cube.vissl_findlastone().then(result_hd=>{
                                        for(let i=0; i< name["花都"].length;i++){
                                            result[name["花都"][i]] = result_hd[0][name["花都"][i]]
                                            // console.log(name["花都"][i])
                                            // console.log(result_hd[0][name["花都"][i]])
                                        }
                                        
                                        nh_cube.vissl_findlastone().then(result_nh=>{
                                            for(let i=0; i< name["南海"].length;i++){
                                                result[name["南海"][i]] = result_nh[0][name["南海"][i]]
                                            }
                                            
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
},5000)


// //表3的cube结构
// class testcube1 extends vis_cube{
//     constructor() {
//         super('Cube','压力1')
//     }
// }
// var cube1 = new testcube1()
// var name={
//     压力1:[
//         "STN02_00_PI001A","STN02_00_PI001","STN02_00_PI012","STN02_00_PI012A","STN02_00_PI013A",
//         "STN03_00_PI001A","STN03_00_PI001","STN03_00_PI008","STN03_00_PI008A","STN03_00_PI009A",
//         "STN04_00_PI001A","STN04_00_PI001","STN04_00_PI007",
//         "STN05_00_PI001A","STN05_00_PI001","STN05_00_PI012B","STN05_00_PI011","STN05_00_PI011A",
//         "STN06_00_PI001A","STN06_00_PI001","STN06_00_PI007A","STN06_00_PI007",
//         "STN19_00_PI001A","STN19_00_PI001","STN19_00_PI027","STN19_00_PI027A",
//         "STN20_00_PI001A","STN20_00_PI001","STN20_00_PI001B","STN20_00_PI001C","STN20_00_PI007","STN20_00_PI008",
//         "STN22_00_PI001A","STN22_00_PI001",
//         "STN21_00_PI001A","STN21_00_PI001",
//     ],
//     密度1:[
//         "STN02_00_DI001A",
//         "STN03_00_DI001A",
//         "STN04_00_DI001A",
//         "STN05_00_DI001A",
//         "STN06_00_DI001A",
//         "STN19_00_DI001A",
//         "STN20_00_DI001A",
//         "STN22_00_DI001A",
//         "STN21_00_DI001A",
//     ],
//     流量1:[
//         "STN02_00_FI022B","STN02_00_FI021B",
//         "STN03_00_FI003","STN03_00_FI004","STN03_02_FIQ201","STN03_02_FIQ202",
//         "STN04_00_FI003","STN04_02_FIC201","STN04_02_FIC202",
//         "STN05_00_FI004","STN05_00_FI003","STN05_02_FIC201","STN05_02_FIC202",
//         "STN06_00_FI003","STN06_00_FI3301","STN06_00_FI3302",
//         "STN19_00_FI003","STN19_02_FIC201","STN19_02_FIC202","STN19_02_FIC202A",
//         "STN20_00_FI004","STN20_02_FIC201","STN20_02_FIC202",
//         "STN22_00_FI003","STN22_02_FIC201","STN22_02_FIC202",
//         "STN21_00_FI001","STN21_02_FIC201","STN21_02_FIC202",
//     ],
// }

// const ws = require("nodejs-websocket");
// const server = ws.createServer(function(conn){
//     console.log('new connection for params...')
//     conn.on("text",function(e){
//         switch(e){
//             case 'close':
//                 console.log("当前链接已断开")
//                 conn.close()
//                 break;
//             default:
//                 break;
//         }
//     });

//     conn.on("close",function(code,reason) {
//         console.log("params Disconnected.");
//     });

//     conn.on("error",function(code,reason) {
//         console.log("Error."+reason)
//     });
// }).listen(3091)
// setInterval(()=>{
//     server.connections.forEach((conn)=>{
//         cube1.p_findlastone(name).then(result=>{
//             // console.log(result[0]['密度1'])
//             var x={}
//             for(let i =0;i<name['压力1'].length;i++){
//                 let p =result[0][name['压力1'][i]]
//                 x[name['压力1'][i]]=p[p.length-1]
//             }
//             let key = Object.keys(name)
//             for(let i=1;i<key.length;i++){
//                 for(let j =0;j<name[key[i]].length;j++){
//                     let p =result[0][key[i]][0][name[key[i]][j]]
//                     x[name[key[i]][j]]=p[p.length-1]
//                 }
//             }
//             conn.sendText(JSON.stringify(x))
//         })
//     })
// },1000)

console.log("params server running ...");

module.exports = paramsGet;