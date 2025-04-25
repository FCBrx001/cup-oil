<!-- 折线图 -->
<template>
    <div :id="elId" style="width:100%;height:100%"></div>
</template>

<script>
"use strict"; 
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'
import { eventBus } from '../../main';
import Vue from 'vue'
import "echarts/map/js/guangdong.js";
import obj from "echarts/map/json/province/guangdong.json";
import "echarts/extension/bmap/bmap"
  export default {
		name:'batchtrackingoverview',
		data(){
			return{
				/*子组件向父组件传递数据 */
                elId: '',
                charts:null,
                times:1,
                time:'',
                //titleText:'油品批次跟踪',
                oilname:[],
                oiltime:[],
                oildistance:[],
                stationname:['阳江','恩平','鹤山','江门','高明','三水','花都','南海','顺德','南沙'],
                stationnames:['茂名','阳江','恩平','鹤山','江门','高明','三水','花都','南海','顺德','南沙','黄埔','东莞'],
                //新增管段距离
                stationdis:[116800,94400,39900,48600,64800,32100,45700,52800,35800,55100,45000,38000],
                //lines:[],
                linedata:{},
                linedata2:{},
                linedatans_sd:{},
                lines:[],
                lines2:[],
                linesns_sd:[],
                lineshp_dg:[],
                series:[],
                rawseries:[],
                pointname:'',
                flag:0,
                num:0,
                pressdata:[1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8],
                flowdata:[1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8],
                options:{},
                data1:{}
			}
		},
		created(){
            this.linedatans_sd={
                顺德:[113.277878,22.81189],
                南沙:[113.546939,22.858787]
            }
            this.linedata={
                茂名:[110.932798,21.742765],
                阳江:[111.864161,21.899795],
                恩平:[112.335009,22.170561],
                鹤山:[112.745157,22.547317],
                江门:[113.090681,22.660491],
                高明:[112.818746,23.039357],
                三水:[112.858415,23.17976],
                花都:[113.124817,23.361275]
            }
            this.linedata2={
                //用于绘制管道，经纬度
                //茂名到阳江
                茂名:[110.932798,21.742765],
                阳江:[111.864161,21.899795],
                //阳江到恩平
                恩平:[112.335009,22.170561],
                //恩平到鹤山
                鹤山:[112.745157,22.547317],
                //鹤山到江门
                江门:[113.090681,22.660491],
                //江门到高明
                高明:[112.818746,23.039357],
                //高明到三水
                三水:[112.858415,23.17976],
                //三水到花都
                花都:[113.124817,23.361275],
                //花都到南海
                南海:[113.360945,23.117433],
                //南海到顺德
                顺德:[113.277878,22.81189],
                //顺德到南沙
                南沙:[113.546939,22.858787],
                //南沙到黄埔
                黄埔:[113.450000,23.100000],
                //黄埔到东莞
                东莞:[113.750000,23.050000]
            }
            this.lines=[
                //茂名到阳江
                [110.932798,21.742765],
                [111.864161,21.899795],
                //阳江到恩平
                [112.335009,22.170561],
                //恩平到鹤山
                [112.745157,22.547317],
                //鹤山到江门
                [113.090681,22.660491],
                //江门到高明
                [112.818746,23.039357],
                //高明到三水
                [112.858415,23.17976],
                //三水到花都
                [113.124817,23.361275]
            ]
            this.lines2=[
                //三水到南海
                [112.858415,23.17976],
                [113.360945,23.117433]
            ]
            this.linesns_sd=[
                [113.090681,22.660491],
                [113.277878,22.81189],
                [113.546939,22.858787]
            ]
            this.lineshp_dg=[
                //南沙到黄埔到东莞
                [113.546939,22.858787],
                [113.450000,23.100000],
                [113.750000,23.050000]
            ]
   			this.elId = uuidv1() //获取随机id
            
            //绘制底层白线
            this.rawseries.push({
                type: 'lines',
                coordinateSystem: 'geo',
                geoIndex: 0,
                polyline: true,
                lineStyle: {
                    color: '#ffffff',
                    width: 10,
                    opacity: 1,
                    type: 'solid'
                },
                data: [{
                    coords: this.lines
                }]
            })
            this.rawseries.push({
                type: 'lines',
                coordinateSystem: 'geo',
                geoIndex: 0,
                polyline: true,
                lineStyle: {
                    color: '#ffffff',
                    width: 10,
                    opacity: 1,
                    type: 'solid'
                },
                data: [{
                    coords: this.lines2
                }]
            })
            this.rawseries.push({
                type: 'lines',
                coordinateSystem: 'geo',
                geoIndex: 0,
                polyline: true,
                lineStyle: {
                    color: '#ffffff',
                    width: 10,
                    opacity: 1,
                    type: 'solid'
                },
                data: [{
                    coords: this.linesns_sd
                }]
            })
            this.rawseries.push({
                type: 'lines',
                coordinateSystem: 'geo',
                geoIndex: 0,
                polyline: true,
                lineStyle: {
                    color: '#73C0DE',
                    width: 12,
                    opacity: 1,
                    type: 'solid'
                },
                effect: {
                    constantSpeed: 20,
                    show: true,
                    trailLength: 0.1,
                    symbolSize: 20,
                    symbol: 'circle'
                },
                data: [{
                    coords: this.lineshp_dg
                }]
            })
            let that=this
            let res= []

            //绘制站场点
            for(let i=0;i<Object.keys(that.linedata).length;i++){
                //console.log("series"+)
                let pointname=Object.keys(that.linedata)[i];
                let data=that.linedata[pointname]
                res.push({
                    name:pointname,
                    value:data
                })
            }
            res.push({
                name:'南海',
                value:[113.360945,23.117433]
            },{
                name:'顺德',
                value:[113.277878,22.81189]
            },{
                name:'南沙',
                value:[113.546939,22.858787]
            },{
                name:'黄埔',
                value:[113.450000,23.100000]
            },{
                name:'东莞',
                value:[113.750000,23.050000]
            })
            that.rawseries.push({
                type:'scatter',
                z:5,
                coordinateSystem:'geo',
                data:res,
                symbolSize:15,
                encode:{
                    value:19.9
                },
                itemStyle:{
                    color:"rgba(45, 88, 41, 1)"
                },
                label: {
                    formatter: function(params){
                        let str
                        let pi_in
                        let pi_out
                        let fi_in
                        let fi_out
                        let fi_down
                        switch(params.name){
                            case '茂名':
                                pi_in = that.data1.STN02_00_PI001A ? that.data1.STN02_00_PI001A.toFixed(2) : that.data1.STN02_00_PI001.toFixed(2)
                                pi_out = that.data1.STN02_00_PI012 ? that.data1.STN02_00_PI012.toFixed(2): (that.data1.STN02_00_PI012A ? that.data1.STN02_00_PI012A.toFixed(2) : that.data1.STN02_00_PI013A.toFixed(2))
                                fi_in = that.data1.STN02_00_FI022B ? that.data1.STN02_00_FI022B.toFixed(2) : that.data1.STN02_00_FI021B.toFixed(2)
                                str=
                                '{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN02_00_DI001A.toFixed(2)+'}\n'+
                                '{hr|}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{hr|}\n'+
                                '{valueHead|出站压力}{value|'+pi_out+'}\n'+
                                '{hr|}\n'+
                                '{valueHead|进站流量}{value|'+fi_in+'}\n'+
                                '{hr|}\n'
                                break;
                            case '阳江':
                                pi_in = that.data1.STN03_00_PI001A ? that.data1.STN03_00_PI001A.toFixed(2):that.data1.STN03_00_PI001.toFixed(2)
                                pi_out = that.data1.STN03_00_PI008 ? that.data1.STN03_00_PI008.toFixed(2): that.data1.STN03_00_PI008A ? that.data1.STN03_00_PI008A.toFixed(2) : that.data1.STN03_00_PI009A.toFixed(2)
                                fi_in = that.data1.STN03_00_FI003 ? that.data1.STN03_00_FI003.toFixed(2):that.data1.STN03_00_FI004.toFixed(2)
                                fi_down =that.data1.STN03_02_FIQ201 ? that.data1.STN03_02_FIQ201.toFixed(2) : that.data1.STN03_02_FIQ202.toFixed(2)
                                str=
                                '{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN03_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|出站压力}{value|'+pi_out+'}\n'+
                                '{valueHead|进站流量}{value|'+fi_in+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '恩平':
                                pi_in = that.data1.STN04_00_PI001A ? that.data1.STN04_00_PI001A.toFixed(2):that.data1.STN04_00_PI001.toFixed(2)
                                pi_out = that.data1.STN04_00_PI007.toFixed(2)
                                fi_out = that.data1.STN04_00_FI003.toFixed(2)
                                fi_down =that.data1.STN04_02_FIC201 ? that.data1.STN04_02_FIC201.toFixed(2):that.data1.STN04_02_FIC202.toFixed(2)
                                str=
                                '{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN04_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|出站压力}{value|'+pi_out+'}\n'+
                                '{valueHead|出站流量}{value|'+fi_out+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '鹤山':
                                pi_in = that.data1.STN05_00_PI001A?that.data1.STN05_00_PI001A.toFixed(2):that.data1.STN05_00_PI001.toFixed(2)
                                pi_out = that.data1.STN05_00_PI011A ? that.data1.STN05_00_PI011A.toFixed(2) : that.data1.STN05_00_PI011? that.data1.STN05_00_PI011.toFixed(2):that.data1.STN05_00_PI012B.toFixed(2)
                                fi_in = that.data1.STN05_00_FI004 ? that.data1.STN05_00_FI004.toFixed(2) : that.data1.STN05_00_FI003.toFixed(2)
                                fi_down =that.data1.STN05_02_FIC201 ? that.data1.STN05_02_FIC201.toFixed(2) : that.data1.STN05_02_FIC202.toFixed(2)
                                str=
                                '{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN05_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|出站压力}{value|'+pi_out+'}\n'+
                                '{valueHead|进站流量}{value|'+fi_in+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '江门':
                                pi_in = that.data1.STN06_00_PI001A ? that.data1.STN06_00_PI001A.toFixed(2) :that.data1.STN06_00_PI001.toFixed(2)
                                pi_out = that.data1.STN06_00_PI007A ? that.data1.STN06_00_PI007A.toFixed(2):that.data1.STN06_00_PI007.toFixed(2)
                                fi_in = that.data1.STN06_00_FI003.toFixed(2)
                                fi_down =that.data1.STN06_00_FI3301 ? that.data1.STN06_00_FI3301.toFixed(2):that.data1.STN06_00_FI3302.toFixed(2)
                                str=
                                '{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN06_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|出站压力}{value|'+pi_out+'}\n'+
                                '{valueHead|进站流量}{value|'+fi_in+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '高明':
                                pi_in = that.data1.STN19_00_PI001A ? that.data1.STN19_00_PI001A.toFixed(2):that.data1.STN19_00_PI001.toFixed(2)
                                pi_out = that.data1.STN19_00_PI027A ? that.data1.STN19_00_PI027A.toFixed(2):that.data1.STN19_00_PI027.toFixed(2)
                                fi_down = that.data1.STN19_02_FIC201 ? that.data1.STN19_02_FIC201.toFixed(2) : that.data1.STN19_02_FIC202A ? that.data1.STN19_02_FIC202A.toFixed(2):that.data1.STN19_02_FIC202.toFixed(2)
                                str=
                                '{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN19_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|出站压力}{value|'+pi_out+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '三水':
                                pi_in = that.data1.STN20_00_PI001A ? that.data1.STN20_00_PI001A.toFixed(2):that.data1.STN20_00_PI001.toFixed(2)
                                pi_out = that.data1.STN20_00_PI007 ? that.data1.STN20_00_PI007.toFixed(2) :that.data1.STN20_00_PI008.toFixed(2)
                                fi_down = that.data1.STN20_02_FIC201 ? that.data1.STN20_02_FIC201.toFixed(2):that.data1.STN20_02_FIC202.toFixed(2)
                                str='{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN20_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|出站压力}{value|'+pi_out+'}\n'+
                                '{valueHead|进站流量}{value|'+that.data1.STN20_00_FI004.toFixed(2)+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '花都':
                                pi_in = that.data1.STN22_00_PI001A ? that.data1.STN22_00_PI001A.toFixed(2):that.data1.STN22_00_PI001.toFixed(2)
                                fi_down = that.data1.STN22_02_FIC201 ? that.data1.STN22_02_FIC201.toFixed(2):that.data1.STN22_02_FIC202.toFixed(2)
                                str='{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN22_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '南海':
                                pi_in = that.data1.STN21_00_PI001A ? that.data1.STN21_00_PI001A.toFixed(2):that.data1.STN21_00_PI001.toFixed(2)
                                fi_down = that.data1.STN21_02_FIC201 ? that.data1.STN21_02_FIC201.toFixed(2):that.data1.STN21_02_FIC202.toFixed(2)
                                str='{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN21_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '南沙':
                                pi_in = that.data1.STN22_00_PI001A ? that.data1.STN22_00_PI001A.toFixed(2):that.data1.STN22_00_PI001.toFixed(2)
                                fi_down = that.data1.STN22_02_FIC201 ? that.data1.STN22_02_FIC201.toFixed(2):that.data1.STN22_02_FIC202.toFixed(2)
                                str='{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN22_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '顺德':
                                pi_in = that.data1.STN21_00_PI001A ? that.data1.STN21_00_PI001A.toFixed(2):that.data1.STN21_00_PI001.toFixed(2)
                                fi_down = that.data1.STN21_02_FIC201 ? that.data1.STN21_02_FIC201.toFixed(2):that.data1.STN21_02_FIC202.toFixed(2)
                                str='{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|'+that.data1.STN21_00_DI001A.toFixed(2)+'}\n'+
                                '{valueHead|进站压力}{value|'+pi_in+'}\n'+
                                '{valueHead|下载流量}{value|'+fi_down+'}';
                                break;
                            case '黄埔':
                                str='{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|735.50}\n'+
                                '{valueHead|进站压力}{value|2.15}\n'+
                                '{valueHead|出站压力}{value|2.10}\n'+
                                '{valueHead|进站流量}{value|150.20}\n'+
                                '{valueHead|下载流量}{value|45.30}';
                                break;
                            case '东莞':
                                str='{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|734.80}\n'+
                                '{valueHead|进站压力}{value|1.95}\n'+
                                '{valueHead|出站压力}{value|1.85}\n'+
                                '{valueHead|进站流量}{value|105.60}\n'+
                                '{valueHead|下载流量}{value|38.50}';
                                break;
                            default:
                                str='{title|'+ params.name +'}\n'+
                                '{valueHead|标准密度}{value|202.00}\n'+
                                '{valueHead|进站压力}{value|142.00}\n'+
                                '{valueHead|出站压力}{value|21.00}\n'+
                                '{valueHead|进站流量}{value|21.00}\n'+
                                '{valueHead|下载流量}{value|21.00}';
                                break;
                        }
                        return str;
                    },
                    color:'white',
                    fontWeight:600,
                    rich: {
                        hr: {
                            borderColor: '#777',
                            width: 140,
                            borderWidth: 0.5,
                            height: 0
                        },
                        title: {
                            height: 30,
                            backgroundColor: '#333',
                            width: 220,
                            fontSize:25,
                            color: '#eee',
                            align: 'center',
                            padding: [0, 0, 0, 0],
                        },
                        value: {
                            backgroundColor: '#fff',
                            borderColor:'#fff',
                            borderWidth:0,
                            width: 50,
                            color:'#000',
                            fontSize:20,
                            height: 25,
                            padding: [0, 20, 0, 30],
                            align: 'left'
                        },
                        valueHead: {
                            backgroundColor: '#fff',
                            borderColor:'#ffffff',
                            borderWidth:0,
                            color: '#000',
                            width:120,
                            fontSize:22,
                            height: 25,
                            align: 'center'
                        },
                    },
                    // padding:[50,40],
                    show: true
                },
                labelLine:{
                    show:true,
                    length2:10,
                    lineStyle:{
                        width:2,
                        color:'#ffffff'
                        // color:rgba(14, 251, 81, 1)
                    },
                },
                labelLayout(params) {
                    // console.log('475',params)
                    switch(params.dataIndex){
                        case 0: //茂名
                            return {
                                x: params.rect.x - 250,
                                y: params.rect.y + params.rect.height / 2,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 1: // 阳江
                            return {
                                x: params.rect.x -50,
                                y: params.rect.y + params.rect.height*7,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 2: //恩平
                            return {
                                x: params.rect.x + 20,
                                y: params.rect.y + params.rect.height *7,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 3: //鹤山
                            return {
                                x: params.rect.x - 250,
                                y: params.rect.y - params.rect.height *4,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 4: //江门
                            return {
                                x: params.rect.x -150,
                                y: params.rect.y + params.rect.height *10,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 5: //高明
                            return {
                                x: params.rect.x -250,
                                y: params.rect.y ,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 6: //三水
                            return {
                                x: params.rect.x -250,
                                y: params.rect.y - params.rect.height *6,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 7: //花都
                            return {
                                x: params.rect.x + 20,
                                y: params.rect.y - params.rect.height / 2,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 8: // 南海
                            return {
                                x: params.rect.x + 20,
                                y: params.rect.y - params.rect.height / 2,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 9: // 顺德
                            return {
                                x: params.rect.x ,
                                y: params.rect.y + params.rect.height *10,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 10: //南沙
                            return {
                                x: params.rect.x + 30,
                                y: params.rect.y + params.rect.height / 2,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 11: //黄埔
                            return {
                                x: params.rect.x - 250,
                                y: params.rect.y,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        case 12: //东莞
                            return {
                                x: params.rect.x + 50,
                                y: params.rect.y - params.rect.height * 5,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                    }
                    
                },
            })
            
            //初始化图表
            this.options={
                tooltip: {},
                geo: {
                    map: '广东',
                    roam: true,
                    aspectScale: 1.0,
                    layoutSize: '200%', 
                    layoutCenter: ['60%', '13%'],
                    itemStyle: {
                        normal: {
                            areaColor: {
                            type: 'linear-gradient',
                            x: 0,
                            y: 400,
                            x2: 0,
                            y2: 0,
                            colorStops: [{
                                offset: 0, 
                                color: 'rgba(37,108,190,0.3)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(15,169,195,0.3)' // 50% 处的颜色
                            }],
                            global: true // 缺省为 false
                            },
                            borderColor: '#4ecee6',
                            borderWidth: 1
                        },
                    },
                    tooltip:{
                        show:false
                    },
                    silent:true,
                    emphasis: {
                        disabled:true,
                        itemStyle: {
                            areaColor: '#0160AD'
                        }
                    }
                },
                animation:false,
                legend: {
                    // left:'0%',
                    x: 'left',
                    top: '5%',
                    left:'5%',
                    selectedMode:false,
                    data: ['0#柴油', '92#汽油', '95#汽油'],
                    textStyle:{
                        color:'white',
                        fontSize:25
                    }
                },
                series: this.series
            }
            
  		},
		/*只要计算属性，这个function内部，所用到的任何data中的数据发送了变化，就会立即重新计算这个计算属性的值； */
		computed:{
		},
		mounted(){
            
            this.drawBar(this.elId)
            
            //获取批次跟踪数据，并通过datacom进行计算
            /*
            *   result:从茂名-阳江
            *   result:[{
            *      name:['0#柴油','92#汽油','95#汽油'],
            *      data:[1,..,n]
            *   ]
            */
            eventBus.$on('oilDataChange',result =>{
                // console.log(result)
                this.options.series=[]
                for(let i =0;i<this.rawseries.length;i++){
                    this.options.series.push(this.rawseries[i])
                }
                this.data1=this.$store.state.paramsData
                let data = result[result.length-1].data
                // datacom(油品名称，油品数据，起始站点，终点站点)
                this.datacom(result[result.length-1].name,data,this.stationnames[result.length],this.stationnames[result.length-1],this.data1.STN08_02_FIC202+this.data1.STN08_02_FIC201,this.data1.STN07_00_DI001A,this.data1.STN08_00_II001)
                data = result[result.length-2].data
                // datacom(油品名称，油品数据，起始站点，终点站点)
                this.datacom(result[result.length-2].name,data,this.stationnames[result.length-1],this.stationnames[4],this.data1.STN07_00_FI003,this.data1.STN06_00_DI303,this.data1.STN07_00_DI001A)
                data = result[result.length-3].data
                // datacom(油品名称，油品数据，起始站点，终点站点)
                let test_data = this.data1.STN21_02_FIC201+this.data1.STN21_02_FIC202
                this.datacom(result[result.length-3].name,data,this.stationnames[result.length-4],this.stationnames[result.length-2],test_data,this.data1.STN21_00_DI001A,this.data1.STN20_00_DI001A)
                let lldata = [
                    parseFloat(this.data1.STN02_00_FI101_102),
                    this.data1.STN04_00_FI004 ? parseFloat(this.data1.STN04_00_FI004) : 0,
                    parseFloat(this.data1.STN04_00_FI003),
                    parseFloat(this.data1.STN06_00_FI003),
                    parseFloat(this.data1.STN19_00_FI003),
                    parseFloat(this.data1.STN19_00_FI003),
                    parseFloat(this.data1.STN22_02_FIC201+this.data1.STN22_02_FIC202)
                ]
                let D_s = [this.data1.STN03_00_DI001A,this.data1.STN04_00_DI001A,this.data1.STN05_00_DI001A,this.data1.STN06_00_DI001A,this.data1.STN19_00_DI001A,this.data1.STN20_00_DI001A,this.data1.STN22_00_DI001A]
                let D_e = [this.data1.STN02_00_DI002A,this.data1.STN03_00_DI001A,this.data1.STN04_00_DI001A,this.data1.STN05_00_DI001A,this.data1.STN06_00_DI002A,this.data1.STN19_00_DI001A,this.data1.STN20_00_DI001A]
                for(let i =result.length-4;i>=0;i--){
                    let data = result[i].data
                    // console.log(i,lldata[i],this.stationnames[i])
                    this.datacom(result[i].name,data,this.stationnames[i],this.stationnames[i+1],lldata[i],D_s[i],D_e[i])
                }
                // console.log("raw",this.rawseries)
                this.charts.setOption(this.options)
            })
		},
		watch:{
		},
		methods: {
			drawBar(id){
			    if(this.times==1){
				   this.charts = echarts.init(document.getElementById(id));
				   this.times++;
			    }
			    this.charts.clear();
			    this.charts.on("click", this.eConsole);
                echarts.registerMap('广东', obj);
                let that=this
                this.charts.on('click',function (params) {
        	    });
                
                this.charts.getZr().on('mousewheel',(params)=>{
                    // console.log(params)
                    // var data = that.charts.getOption();
                    // console.log(data.geo[0].zoom)
                })
			},
            
            /** 
             * name: 管道第一批次油品名称
             * data: 管道第一批次油品长度
             * start: 起始站名
             * end: 终止站名
            */
            datacom(name,data,start,end,lldata,D_s,D_e){
                // console.log(start,end,D_s,D_e)
                var start_p=[this.linedata2[start],this.linedata2[start]];
                var j
                var result_data
                if(end === '江门' && start === '顺德'){
                    result_data = 35800
                    j=8
                }else if(end === '顺德' && start === '南沙'){
                    result_data = 55100
                    j=9
                }
                else if(end ==='高明' && start === '江门'){
                    result_data=64800
                    j = 4
                }
                else if(end ==='南海' && start === '三水'){
                    result_data=52800
                    j = 7
                }else if(end ==='花都' && start === '三水'){
                    result_data=45700
                    j = 6
                }
                else if(end ==='茂名' && start === '阳江'){
                    result_data=116800
                    j=0
                }
                else if(end ==='阳江' && start === '恩平'){
                    result_data = 94400
                    j=1
                }else if(end ==='恩平' && start === '鹤山'){
                    result_data = 39900
                    j=2
                }else if(end ==='鹤山' && start === '江门'){
                    result_data = 48600
                    j=3
                }else if(end ==='南沙' && start === '顺德'){
                    result_data = 55100
                    j=9
                }
                else if(end ==='黄埔' && start === '南沙'){
                    result_data = 45000
                    j=10
                    start_p=[
                        [113.546939,22.858787],
                        [113.450000,23.100000]
                    ]
                    let pipe = {
                        name: name[0],
                        type: 'lines',
                        coordinateSystem: 'geo',
                        geoIndex: 0,
                        tooltip:{
                            show:true
                        },
                        polyline: true,
                        lineStyle: {
                            color: '#73C0DE',
                            width: 10,
                            opacity: 0.95,
                            type: 'solid'
                        },
                        effect: {
                            constantSpeed: 20,
                            show: true,
                            trailLength: 0.1,
                            symbolSize: 20,
                            symbol: 'circle'
                        },
                        data: [{
                            coords: start_p
                        }]
                    }
                    this.options.series.push(pipe)
                    return
                }
                else if(end ==='东莞' && start === '黄埔'){
                    result_data = 38000
                    j=11
                    start_p=[
                        [113.450000,23.100000],
                        [113.750000,23.050000]
                    ]
                    let pipe = {
                        name: name[0],
                        type: 'lines',
                        coordinateSystem: 'geo',
                        geoIndex: 0,
                        tooltip:{
                            show:true
                        },
                        polyline: true,
                        lineStyle: {
                            color: '#73C0DE',
                            width: 12,
                            opacity: 1,
                            type: 'solid'
                        },
                        effect: {
                            constantSpeed: 20,
                            show: true,
                            trailLength: 0.1,
                            symbolSize: 20,
                            symbol: 'circle'
                        },
                        data: [{
                            coords: start_p
                        }]
                    }
                    this.options.series.push(pipe)
                    return
                }
                else{
                    result_data = 32100
                    j=5
                }
                
                // console.log(result_data,data,start,end)
                // console.log("tianchong1",data[0],result_data,start,end)
                result_data -= parseFloat(data[0])
                // console.log(result_data,data,end)
                // console.log("tianchong",data[0],result_data,start,end)
                for(let i =data.length-1;i>= 0;i--){
                    if(i != data.length-1){
                        start_p[1]=this.com(data[i]-data[i+1],start,end,start_p,j)
                    }else{
                        start_p[1]=this.com(data[i],start,end,start_p,j)
                    }
                    
                    // console.log("test_start_p",start_p[1])
                   
                    if(result_data<=0){
                        start_p[1]=this.linedata2[end]
                    }
                  
                    let color=''
                    switch(name[i]){
                        case '0#柴油':
                            color='#FAC858'
                            break;
                        case '92#汽油':
                            color='#73C0DE'
                            break;
                        case '95#汽油':
                            color='#EE6666'
                            break;
                        default:
                            color='#aaaaaa'
                            start_p[1]=this.com(data[i],start,end,start_p,j)
                            break;
                    }
                    let pipe={}
                    if(lldata <= 10){
                        pipe = {
                            name: name[i],
                            type: 'lines',
                            coordinateSystem: 'geo',
                            geoIndex: 0,
                            tooltip:{
                                show:true
                            },
                            polyline: true,
                            lineStyle: {
                                color: color,
                                width: 10,
                                opacity: 1,
                                type: 'solid'
                            },
                            effect: {
                                constantSpeed: 20,
                                show: false,
                                trailLength: 0.1,
                                symbolSize: 20
                            },
                            data: [{
                                coords: start_p
                            }]
                        }
                    }else{
                        pipe = {
                            name: name[i],
                            type: 'lines',
                            coordinateSystem: 'geo',
                            geoIndex: 0,
                            tooltip:{
                                show:true
                            },
                            polyline: true,
                            lineStyle: {
                                color: color,
                                width: 10,
                                opacity: 1,
                                type: 'solid'
                            },
                            effect: {
                                constantSpeed: 20,
                                show: true,
                                trailLength: 0.1,
                                symbolSize: 20
                            },
                            data: [{
                                coords: start_p
                            }]
                        }
                    }
                    
                    let objCopy = JSON.parse(JSON.stringify(pipe));
                    // console.log(i,name[i],end,objCopy)
                    this.options.series.push(objCopy)
                    // console.log(this.series.length,this.series)
                    start_p[0]=start_p[1] 
                }
                
                if(result_data>0){
                    start_p[1]=this.linedata2[end]
                    // console.log(end,start_p)
                    let pipe = {}
                    // console.log("ttt",start,end,D_s,D_e)
                    if(D_s>780){
                        if(lldata <= 10){
                            pipe = {
                                name: '0#柴油',
                                type: 'lines',
                                coordinateSystem: 'geo',
                                geoIndex: 0,
                                tooltip:{
                                    show:true
                                },
                                polyline: true,
                                lineStyle: {
                                    color: '#73C0DE',
                                    width: 10,
                                    opacity: 1,
                                    type: 'solid'
                                },
                                effect: {
                                    constantSpeed: 20,
                                    show: false,
                                    trailLength: 0.1,
                                    symbolSize: 20
                                },
                                data: [{
                                    coords: start_p
                                }]
                            }
                        }else{
                            pipe = {
                                name: '0#柴油',
                                type: 'lines',
                                coordinateSystem: 'geo',
                                geoIndex: 0,
                                tooltip:{
                                    show:true
                                },
                                polyline: true,
                                lineStyle: {
                                    color: '#73C0DE',
                                    width: 10,
                                    opacity: 1,
                                    type: 'solid'
                                },
                                effect: {
                                    constantSpeed: 20,
                                    show: true,
                                    trailLength: 0.1,
                                    symbolSize: 20
                                },
                                data: [{
                                    coords: start_p
                                }]
                            }
                        }
                        
                    }else if(name[0] =='0#柴油'){
                        if(lldata <= 10){
                            pipe = {
                                name: '92#汽油',
                                type: 'lines',
                                coordinateSystem: 'geo',
                                geoIndex: 0,
                                tooltip:{
                                    show:true
                                },
                                polyline: true,
                                lineStyle: {
                                    color: '#73C0DE',
                                    width: 10,
                                    opacity: 1,
                                    type: 'solid'
                                },
                                effect: {
                                    constantSpeed: 20,
                                    show: false,
                                    trailLength: 0.1,
                                    symbolSize: 20
                                },
                                data: [{
                                    coords: start_p
                                }]
                            }
                        }else{
                                pipe = {
                                    name: '92#汽油',
                                    type: 'lines',
                                    coordinateSystem: 'geo',
                                    geoIndex: 0,
                                    tooltip:{
                                        show:true
                                    },
                                    polyline: true,
                                    lineStyle: {
                                        color: '#73C0DE',
                                        width: 10,
                                        opacity: 1,
                                        type: 'solid'
                                    },
                                    effect: {
                                        constantSpeed: 20,
                                        show: true,
                                        trailLength: 0.1,
                                        symbolSize: 20
                                    },
                                    data: [{
                                        coords: start_p
                                    }]
                                }
                        }
                    }else {
                        if(D_s <=745){
                            if(lldata <= 10){
                                pipe = {
                                    name: '92#汽油',
                                    type: 'lines',
                                    coordinateSystem: 'geo',
                                    geoIndex: 0,
                                    tooltip:{
                                        show:true
                                    },
                                    polyline: true,
                                    lineStyle: {
                                        color: '#73C0DE',
                                        width: 10,
                                        opacity: 1,
                                        type: 'solid'
                                    },
                                    effect: {
                                        constantSpeed: 20,
                                        show: false,
                                        trailLength: 0.1,
                                        symbolSize: 20
                                    },
                                    data: [{
                                        coords: start_p
                                    }]
                                }
                            }else{
                                    pipe = {
                                        name: '92#汽油',
                                        type: 'lines',
                                        coordinateSystem: 'geo',
                                        geoIndex: 0,
                                        tooltip:{
                                            show:true
                                        },
                                        polyline: true,
                                        lineStyle: {
                                            color: '#73C0DE',
                                            width: 10,
                                            opacity: 1,
                                            type: 'solid'
                                        },
                                        effect: {
                                            constantSpeed: 20,
                                            show: true,
                                            trailLength: 0.1,
                                            symbolSize: 20
                                        },
                                        data: [{
                                            coords: start_p
                                        }]
                                    }
                            }
                        }else{
                            if(lldata <= 10){
                                pipe = {
                                    name: '95#汽油',
                                    type: 'lines',
                                    coordinateSystem: 'geo',
                                    geoIndex: 0,
                                    tooltip:{
                                        show:true
                                    },
                                    polyline: true,
                                    lineStyle: {
                                        color: '#EE6666',
                                        width: 10,
                                        opacity: 1,
                                        type: 'solid'
                                    },
                                    effect: {
                                        constantSpeed: 20,
                                        show: false,
                                        trailLength: 0.1,
                                        symbolSize: 20
                                    },
                                    data: [{
                                        coords: start_p
                                    }]
                                }
                            }else{
                                    pipe = {
                                        name: '95#汽油',
                                        type: 'lines',
                                        coordinateSystem: 'geo',
                                        geoIndex: 0,
                                        tooltip:{
                                            show:true
                                        },
                                        polyline: true,
                                        lineStyle: {
                                            color: '#EE6666',
                                            width: 10,
                                            opacity: 1,
                                            type: 'solid'
                                        },
                                        effect: {
                                            constantSpeed: 20,
                                            show: true,
                                            trailLength: 0.1,
                                            symbolSize: 20
                                        },
                                        data: [{
                                            coords: start_p
                                        }]
                                    }
                            }
                        }
                    }
                    
                    let objCopy = JSON.parse(JSON.stringify(pipe));
                    // console.log(i,name[i],end,objCopy)
                    this.options.series.push(objCopy)
                }
            },

            /**
             * l: 油品批次长度 
             * startname:起始站名
             * finishname:终点站名
             * start_p:起始站坐标
             * alllength:管道总长
             */
            com(l,startname,finishname,start_p,alllength){
                // console.log()
                let data=[this.linedata2[startname],this.linedata2[finishname]]
                // console.log(startname,finishname,alllength)
                let slope =(data[1][1] - data[0][1])/(data[1][0] - data[0][0])
                let d = data[0][1]- slope*data[0][0]
                let dis
                let datas2=[]
                let leng = Math.sqrt((data[1][1] - data[0][1])*(data[1][1] - data[0][1]) +(data[1][0] - data[0][0])*(data[1][0] - data[0][0]))
                let x,y
                if(l===0){
                    dis=0
                     x=data[1][0]
                    y=data[1][1]
                }else if(l===this.stationdis[alllength]){
                    // console.log("相同")
                    x=data[1][0]
                    y=data[1][1]
                }
                else{
                    dis = l/this.stationdis[alllength]*leng
                    let delta = Math.sqrt(Math.abs((1+slope*slope)*dis*dis - start_p[0][0]*start_p[0][0]*slope*slope + (2*start_p[0][0]*start_p[0][1]-2*d*start_p[0][0])*slope -start_p[0][1]*start_p[0][1] +2*d*start_p[0][1] - d*d))
                    x = (delta+start_p[0][0]+(start_p[0][1]-d)*slope)/(1+slope*slope)
                    if(slope<0&&data[1][1]>data[0][1]  && data[1][0]<data[0][0]){
                        x=2*data[0][0]-x
                    }
                    if(slope>0&&data[1][1]<data[0][1]  && data[1][0]<data[0][0]){
                        x= 2*data[0][0]-x
                    }
                    y = slope*x+d
                }
                datas2=[x,y]
                // console.log(datas2,data)
                return datas2
            }
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
