<!-- 折线图 -->
<template>
    <div class='chartground' style='width:100%;height:98%' >
        <div :id='elId' style='width:100%;height:100%' ></div>
    </div>
</template>

<script>
'use strict'
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'
import { eventBus } from '../../main'
export default {
    name: 'realtimeCompute',
    data () {
        return {
        /* 子组件向父组件传递数据 */
            elId: '',
            charts: null,
            times: 1,
            time: '',
            titleText: '全线实时计算',
            station:'',
            stationname:['阳江','恩平','鹤山','江门','高明','三水','花都','南海','顺德','南沙'],
            stationdis:[116800,94400,39900,48600,64800,32100,45700,52800,35800,55100],
            sdis:[103,84,36,43,55,28,44,44,31,48],
            data0:0,
            data92:0,
            dataname:['','','','','','','','','',''],
            dataColor:'#aaaaaa',
            dataColor2:'#aaaaaa',
            value: [],
            value2: [],
            time: [],
            distance: [
                '茂名','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','阳江','阳江','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','恩平','恩平','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','鹤山','鹤山','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','江门','江门','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','高明','高明','','','','','','','','','','','','','','','','','',
                '','','','','','','','','三水','三水','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','', '','花都',
                '','三水','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','南海'
            ],
            distance2: [
            ],
            value3: [],
            data1: [],
            data2: [],
            seriesName1: [],
            options:{},
            num: 0,
            i:0,
            j:383,
            k:0,
            xdata:[],
            xishu:[1.15,1.15,1.15,1.15,1.19,1.2,1.2,1.2],
            MAOP:[]
        }
    },
    created () {
        
   		this.elId = uuidv1() // 获取随机id
        
  	},
  /* 只要计算属性，这个function内部，所用到的任何data中的数据发送了变化，就会立即重新计算这个计算属性的值； */
    computed: {

    },
    
    mounted () {
        this.drawLine(this.elId)
        eventBus.$on('timeData', message => {
            // this.distance = message[0]// time
            // console.log(message)
            this.i=this.$route.params.start
            this.j=this.$route.params.end
            this.station=this.$route.params.station
            // console.log("ttttt",this.station)
            this.value = message[1][0].slice(this.i,this.j)// distance
            this.value2 = message[2][0].slice(this.i,this.j)
            this.highdis =message[3].slice(this.i,this.j)
                // this.value2 = message[3]
            this.distance2 = message[0].slice(this.i,this.j)
            if(this.station === '南沙'){
                this.xdata = ['南沙','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '顺德']
            }else if (this.station === '顺德') {
                this.xdata=['顺德','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '江门']
            }else{
                this.xdata = this.distance.slice(this.i,this.j)
            }
            
            // console.log(this.i,this.j)
            // this.value3 = message[5]
        }),
        eventBus.$on('oilDataChange',result =>{
            this.MAOP = []
            for(let i=0;i<this.xdata.length ;i++){
                this.MAOP.push(10)
            }
            // console.log(this.MAOP)
            this.options={
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        snap:false,
                        type: 'cross',
                        label: {
                            backgroundColor: '#3C3C3C'
                        }
                    },
                    // alwaysShowContent:true,
                    formatter:function(params){
                        // console.log(params)
                        let dis = params[0].dataIndex
                        let sdis=[102,82,36,43,55,28,44,30,47]
                        let xishu=[1.15,1.15,1.15,1.15,1.19,1.2,1.2,1.2,1.19,1.17]
                        let str;
                        if(params.length<3 || params[0].hasOwnProperty('seriesName')==false){
                            str = ""
                        }
                        else{
                        for(var i=0;i<sdis.length;i++){
                            if(dis>=sdis[i]){
                                dis-=sdis[i]
                            }
                            else {
                                dis = dis*xishu[i]
                                break
                            }
                        }
                        str =   `<div style='display: flex;justify-content: space-between;margin-bottom: 12px'>
                                        <span>${'距离上一站场'+dis.toFixed(2)+'km'}</span>
                                    </div>`;
                        for(let i=0; i<3; i++){
                            let series = params[i];
                            // //value判定为空
                            if(series.seriesName=='沿线压力'){
                                str += `<p style='display: flex;justify-content: space-between;align-items: center;'>
                                        <span style='margin-right: 20px'>
                                            <span style=\'display:inline-block;margin-right:4px;border-radius:6px;width:6px;height:6px;background-color: red;'\></span>
                                            <span >${series.seriesName}</span>
                                        </span>
                                        <span>${parseFloat(series.data).toFixed(2)}</span>
                                        <span>MPa</span>
                                    </p>`;
                            }
                            // else if(series.seriesName=='沿线流量'){
                            //     str += `<p style='display: flex;justify-content: space-between;align-items: center;'>
                            //             <span style='margin-right: 20px'>
                            //                 <span style=\'display:inline-block;margin-right:4px;border-radius:6px;width:6px;height:6px;background-color: ${series.color};'\></span>
                            //                 <span >${series.seriesName}</span>
                            //             </span>
                            //             <span>${parseFloat(series.data).toFixed(2)}</span>
                            //             <span>m³/h</span>
                            //         </p>`;
                            // }
                            else if(series.seriesName=='MAOP'){
                                str += `<p style='display: flex;justify-content: space-between;align-items: center;'>
                                        <span style='margin-right: 20px'>
                                            <span style=\'display:inline-block;margin-right:4px;border-radius:6px;width:6px;height:6px;background-color: #aaaaaa;'\></span>
                                            <span >${series.seriesName}</span>
                                        </span>
                                        <span>${parseFloat(series.data).toFixed(2)}</span>
                                        <span>MPa</span>
                                    </p>`;
                            }else{
                                str += `<p style='display: flex;justify-content: space-between;align-items: center;'>
                                        <span style='margin-right: 20px'>
                                            <span style=\'display:inline-block;margin-right:4px;border-radius:6px;width:6px;height:6px;background-color: #aaaaaa;'\></span>
                                            <span >${series.seriesName}</span>
                                        </span>
                                        <span>${parseFloat(series.data).toFixed(2)}</span>
                                        <span>m</span>
                                    </p>`;
                            }
                            
                        }
                    }
                        return str;
                    }
                },
                legend: [{
                    x: 'left',
                    top: '5%',
                    left:'10%',
                    selectedMode:false,
                    icon:'roundRect',
                    itemHeight:3,
                    data: [
                    //     {
                    //     name:'沿线流量',
                    // },
                    {
                        name:'沿线压力',
                        itemStyle:{
                            color:'red'
                        }
                    },{
                        name:'沿线高程',
                        itemStyle:{
                            color:'#3399ff'
                        }
                    },{
                        name:'MAOP',
                        itemStyle:{
                            color:'#80FFA5'
                        }
                    }], // 区域名称
                    textStyle: {
                        color: 'white',
                        fontSize: 23,
                        fontWeight:600,
                    }
                },{
                    x: 'left',
                    selectedMode:false,
                    top: '10%',
                    left:'10%',
                    selectedMode:false,
                    data: [{
                        name:'0#柴油',
                        itemStyle:{
                            color:'#FAC858'
                        }
                    },{
                        name:'92#汽油',
                        itemStyle:{
                            color:'#73C0DE'
                        }
                    },{
                        name:'95#汽油',
                        itemStyle:{
                            color:'#EE6666'
                        }
                    },], // 区域名称
                    textStyle: {
                        color: 'white',
                        fontSize: 23,
                        fontWeight:600,
                    }
                }],
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: this.xdata,
                    boundaryGap :false,
                    axisLine:{
                        show:true,
                        onZero:true,
                    },
                    axisLabel:{
                        show:true,
                        interval: 0,
                        textStyle: {
                            fontSize: 25,
                            fontWeight:600,
                            color:'white'
                        },
                        margin:-53
                    },
                    z:4,
                    axisTick:{
                        show: false
                    }
                }, {
                    show:false,
                    type: 'category',
                    name:'(km)',
                    nameTextStyle:{
                        show:false,
                        verticalAlign:'top',
                        fontSize: 18,
                        fontWeight:600,
                        color:'white',
                        padding:[-30,0,0,0]
                    },
                    data: this.distance2,
                    axisLabel:{
                        show:false,
                        interval: 20,
                        textStyle: {
                            fontSize: 18,
                            // fontWeight:600,
                            color:'white'
                        },
                        // margin:-35
                    },
                    position:'top',
                    axisLine:{
                        show:false,
                        onZero:false,
                    }
                },{
                    show:false,
                    type:'value',
                    min:0,
                    max:this.j-this.i-1,
                }
                ],
                yAxis: [{
                    name:'(MPa)',
                    nameLocation:'middle',
                    nameTextStyle:{
                        color:'white',
                        fontSize: 25,
                        fontWeight:600,
                        
                    },
                    nameGap:30,
                    type: 'value',
                    axisLabel: {
                        color: 'white',
                        fontSize: 25,
                        // fontWeight:600,
                    },
                    min:-1,
                    max:11,
                    splitNumber:11,
                    splitLine:{
                        show:false
                    }
                }, {
                    name:'(m³/h)',
                    nameLocation:'middle',
                    nameRotate:270,
                    splitNumber:11,
                    nameTextStyle:{
                        color:'white',
                        fontSize: 25,
                        fontWeight:600,
                        // verticalAlign:'top',
                        
                    },
                    max:1100,
                    min:-100,
                    nameGap:60,
                    type: 'value',
                    axisLabel: {
                        color: 'white',
                        fontSize: 25,
                        // fontWeight:600,
                    },
                    splitLine:{
                        show:false
                    }
                },{
                    type:'category',
                    show:false,
                    max:100,
                    min:0,
                    splitNumber:10,
                    splitLine:{
                        show:false
                    }
                },{
                    type:'value',
                    show:false,
                    max:1100,
                    min:-100,
                    splitNumber:11,
                    splitLine:{
                        show:false
                    }
                }],
                series: [
                {
                    name: '沿线压力',
                    data: this.value,
                    type: 'line',
                    smooth: true,
                    z:3,
                    symbol:'none',
                    lineStyle:{
                        color:'red',
                        width:2
                    },
                    yAxisIndex: 0
                },{
                    name: 'MAOP',
                    data: this.MAOP,
                    type: 'line',
                    smooth: true,
                    z:3,
                    symbol:'none',
                    lineStyle:{
                        color:'#80FFA5',
                        width:2
                    },
                    yAxisIndex: 0
                },
                // {
                //     name: '沿线流量',
                //     data: this.value2,
                //     type: 'line',
                //     z:3,
                //     smooth: true,
                //     lineStyle:{
                //         width:2
                //     },
                //     symbol:'none',
                //     yAxisIndex: 1
                // },
                {
                    name: '沿线高程',
                    data: this.highdis,
                    type: 'line',
                    z:3,
                    smooth: true,
                    lineStyle:{
                        width:2,
                        color:'#3399ff'
                    },
                    symbol:'none',
                    yAxisIndex: 3
                },{
                    name:'Station',
                    type:'scatter',
                    data:[['茂名',0],['阳江',0],['恩平',0],['鹤山',0],['江门',0],['高明',0],['三水',0],['南海',0],['顺德',0],['南沙',0]],
                    // data:[['茂名',0],['阳江',0],['恩平',0],['鹤山',0],['江门',0],['高明',0],['三水',0],['花都',0],['南海',0]],
                    xAxisIndex:0,
                    yAxisIndex:0,
                    z:4,
                    itemStyle:{
                        color:'white'
                    }
                }
                ],
            }
            // console.log(this.station)
            let index = this.stationname.indexOf(this.station)
            var series = [
                {
                    name: '沿线压力',
                    data: this.value,
                    type: 'line',
                    smooth: true,
                    z:3,
                    symbol:'none',
                    lineStyle:{
                        color:'red',
                        width:2
                    },
                    yAxisIndex: 0
                },
                {
                    name: 'MAOP',
                    data: this.MAOP,
                    type: 'line',
                    smooth: true,
                    z:3,
                    symbol:'none',
                    lineStyle:{
                        color:'#80FFA5',
                        width:2
                    },
                    yAxisIndex: 0
                },
                // {
                //     name: '沿线流量',
                //     data: this.value2,
                //     type: 'line',
                //     z:3,
                //     smooth: true,
                //     lineStyle:{
                //         width:2
                //     },
                //     symbol:'none',
                //     yAxisIndex: 1
                // },
                {
                    name: '沿线高程',
                    data: this.highdis,
                    type: 'line',
                    z:3,
                    smooth: true,
                    lineStyle:{
                        width:2,
                        color:'#3399ff'
                    },
                    symbol:'none',
                    yAxisIndex: 3
                },{
                    name:'Station',
                    type:'scatter',
                    data:[['茂名',0],['阳江',0],['恩平',0],['鹤山',0],['江门',0],['高明',0],['三水',0],['南海',0],['顺德',0],['南沙',0]],
                    // data:[['茂名',0],['阳江',0],['恩平',0],['鹤山',0],['江门',0],['高明',0],['三水',0],['花都',0],['南海',0]],
                    xAxisIndex:0,
                    yAxisIndex:0,
                    z:4,
                    itemStyle:{
                        color:'white'
                    }
                }
                ]
            this.options.series = series
            let data1=this.$store.state.paramsData
            let D_s = [data1.STN03_00_DI001A,data1.STN04_00_DI001A,data1.STN05_00_DI001A,data1.STN06_00_DI001A,data1.STN19_00_DI001A,data1.STN20_00_DI001A,data1.STN22_00_DI001A,data1.STN21_00_DI001A,,data1.STN06_00_DI303,data1.STN07_00_DI001A]
            let D_e = [data1.STN02_00_DI002A,data1.STN03_00_DI001A,data1.STN04_00_DI001A,data1.STN05_00_DI001A,data1.STN06_00_DI002A,data1.STN19_00_DI001A,data1.STN20_00_DI001A,data1.STN20_00_DI001A,data1.STN07_00_DI001A,data1.STN08_00_II001]
            // console.log(index,result.length)
            this.getBardata(result[index],index,D_s[index],D_e[index])
            
            var that = this
            
            this.charts.setOption(this.options)
        })

    },
    watch: {
    },
    methods: {
         getBardata(data,index,D_s,D_e){
            var result_data = this.stationdis[index]
            result_data -= data.data[0]
            for(let i =data.name.length-1;i>=0;i--){
                let color = '#aaaaaa'
                var data1
                if(i !=data.name.length-1){
                    data1=(data.data[i]-data.data[i+1])/this.stationdis[index]*this.sdis[index]
                }else{
                    data1=data.data[i]/this.stationdis[index]*this.sdis[index]
                }
                switch(data.name[i]){
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
                        break;
                }
                let pipe1={
                    name: data.name[i],
                    z:2,
                    xAxisIndex:2,
                    yAxisIndex:2,
                    type: 'bar',
                    itemStyle:{
                        normal: {
                            color:color,
                            barBorderRadius:5,
                        },
                    },
                    stack: 'all',
                    barWidth: 30,
                    data: [data1],
                }
                let objCopy = JSON.parse(JSON.stringify(pipe1));
                this.options.series.push(objCopy)
            }
            // console.log(result_data)
            if(result_data !== 0){
                 let color
                if(D_s > 780){
                    color = '#FAC858'
                }else if(data.name[0] == '0#柴油'){
                    color = '#73C0DE'
                    
                }else{
                    if(D_s > 745){
                        color = '#EE6666'
                    }else{
                        color = '#73C0DE'
                    }
                }
                let data1=result_data/this.stationdis[index]*this.sdis[index]
                let pipe1={
                    name: '',
                    z:2,
                    xAxisIndex:2,
                    yAxisIndex:2,
                    type: 'bar',
                    itemStyle:{
                        normal: {
                            color:color,
                            barBorderRadius:5,
                        },
                    },
                    stack: 'all',
                    barWidth: 30,
                    data: [data1],
                }
                let objCopy = JSON.parse(JSON.stringify(pipe1));
                this.options.series.push(objCopy)
            }

        },
        // getBardata(data,index,name,name2){
        //     let data1,data2
        //     if(data>=this.stationdis[index]){
        //         data1=data/this.stationdis[index]*this.sdis[index]
        //         data2=''
        //     }else if(data==0){
        //         data1=''
        //         data2=this.sdis[index]
        //     }else{
        //         data1=data/this.stationdis[index]*this.sdis[index]
        //         data2=(this.stationdis[index]-data)/this.stationdis[index]*this.sdis[index]
        //     }
        //     this.data0=data1
        //     this.data92=data2
        //     switch(name){
        //         case '0#柴油':
        //             if(name2=='92#汽油'){
        //                 this.dataColor='#FAC858'
        //                 this.dataColor2='#73C0DE'
        //             }else if(name2=='95#汽油'){
        //                 this.dataColor='#FAC858'
        //                 this.dataColor2='#EE6666'
        //             }else{
        //                 this.dataColor='#FAC858'
        //             }
        //             break;
        //         case '92#汽油':
        //             if(name2=='95#汽油'){
        //                 this.dataColor='#73C0DE'
        //                 this.dataColor2='#EE6666'
        //             }else if(name2=='0#柴油'){
        //                 this.dataColor='#73C0DE'
        //                 this.dataColor2='#FAC858'
        //             }else{
        //                 this.dataColor='#73C0DE'
        //             }
        //             break;
        //         case '95#汽油':
        //             if(name2=='92#汽油'){
        //                 this.dataColor='#EE6666'
        //                 this.dataColor2='#73C0DE'
        //             }else if(name2=='0#柴油'){
        //                 this.dataColor='#EE6666'
        //                 this.dataColor2='#FAC858'
        //             }else{
        //                 this.dataColor='#EE6666'
        //             }
        //             break;
        //         default:
        //             break;
        //     }
        // },
        drawLine (id) {  
            // alert('this')
            if (this.times == 1) {
                this.charts = echarts.init(document.getElementById(id))
                this.times++
            }
            this.charts.clear()
            // this.charts.setOption(this.options, true)
            this.charts.on('mouseover', function (params) {     
                eventBus.$emit('stop',params)
            })
            this.charts.on('globalout',function(params){
                eventBus.$emit('start',params)
            })
        }
    }
}
</script>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
