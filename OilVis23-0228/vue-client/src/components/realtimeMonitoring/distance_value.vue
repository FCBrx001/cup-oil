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
            titleText: '全线实时计算',
            stationname:['顺德','江门','高明','三水','南海'],
            stationdis:[55100,35800,64800,32100,52800],
            sdis:[47,30,55,27,42],
            data0:[0,0,0,0,0],
            data92:[0,0,0,0,0],
            data95:[0,0,0,0,0],
            dataname:['','','','',''],
            dataColor:['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa'],
            dataColor2:['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa'],
            color:['white','white','white','white','white'],
            value: [],
            value2: [1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,
                1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,
                1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,
                1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,
                1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400, 1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400,1400]
        }
    },
    created () {
        
   		this.elId = uuidv1() // 获取随机id
        // for(let i =0;i<this.distance.length;i++){
        //     this.MAOP.push(10)
        // }
  	},
  /* 只要计算属性，这个function内部，所用到的任何data中的数据发送了变化，就会立即重新计算这个计算属性的值； */
    computed: {

    },
    
    mounted () {
        this.drawLine(this.elId)
        
        eventBus.$on('realtimeConfigData', message => {
            // this.distance = message[0]// time
            this.value = message[1]// distance
            this.value2 = message[3]
            this.highdis =message[4]// 高程待融合
            // this.value2 = message[3]
            this.distance2 = message[0]
            // console.log(this.i,this.j)
            // this.value3 = message[5]
        }),
        eventBus.$on('oilDataChange',result =>{
            this.options={
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        snap:true,
                        type: 'cross',
                        label: {
                            backgroundColor: '#3C3C3C'
                        }
                    },
                    // alwaysShowContent:true,
                    formatter:function(params){
                        // console.log(params)
                        let dis = params[0].dataIndex
                        let sdis=[47,30,55,27,43]
                        let xishu=[1.17,1.19,1.193,1.204,1.204,1.2]
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
                            if(series.seriesName=='水力坡降'){
                                str += `<p style='display: flex;justify-content: space-between;align-items: center;'>
                                        <span style='margin-right: 20px'>
                                            <span style=\'display:inline-block;margin-right:4px;border-radius:6px;width:6px;height:6px;background-color: red;'\></span>
                                            <span >${series.seriesName}</span>
                                        </span>
                                        <span>${parseFloat(series.data).toFixed(2)}</span>
                                        <span>m</span>
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
                                        <span>m</span>
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
                legend: [
                {
                    x: 'left',
                    top: '5%',
                    left:'15%',
                    selectedMode:false,
                    icon:'roundRect',
                    itemHeight:3,
                    data: [
                    //     {
                    //     name:'沿线流量',
                    // },
                    {
                        name:'水力坡降',
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
                        fontSize: 22,
                        fontWeight:600,
                    }
                },{
                    x: 'left',
                    selectedMode:false,
                    top: '10%',
                    left:'15%',
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
                        fontSize: 22,
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
                    data: this.distance,
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
                        margin:-60
                    },
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
                    max:201,
                }
                ],
                yAxis: [{
                    name:'(m)',
                    nameLocation:'middle',
                    nameTextStyle:{
                        color:'white',
                        fontSize: 22,
                        fontWeight:600,
                        
                    },
                    nameGap:60,
                    type: 'value',
                    axisLabel: {
                        color: 'white',
                        fontSize: 22,
                        // fontWeight:600,
                    },
                    min:-100,
                    max:1500,
                    splitNumber:16,
                    splitLine:{
                        show:false
                    }
                }, {
                    name:'(m)',
                    nameLocation:'middle',
                    nameRotate:270,
                    show:false,
                    splitNumber:11,
                    nameTextStyle:{
                        color:'white',
                        fontSize: 25,
                        fontWeight:600,
                        // verticalAlign:'top',
                        
                    },
                    max:110,
                    min:-10,
                    nameGap:50,
                    type: 'value',
                    axisLabel: {
                        color: 'white',
                        fontSize: 22,
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
                    max:110,
                    min:-10,
                    splitNumber:11,
                    splitLine:{
                        show:false
                    }
                }],
                series: [{
                    name: '水力坡降',
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
                    yAxisIndex: 0
                },
                {
                    name:'Station',
                    type:'scatter',
                    // data:[['茂名',0],['阳江',0],['恩平',0],['鹤山',0],['江门',0],['高明',0],['三水',0],['花都',0]],
                    data:[['南沙',0],['顺德',0],['江门',0],['高明',0],['三水',0],['南海',0]],
                    xAxisIndex:0,
                    yAxisIndex:0,
                    z:4,
                    itemStyle:{
                        color:'white'
                    }
                },
                ],
            }
            let data1=this.$store.state.paramsData
            let D_s=[data1.STN07_00_DI001A,data1.STN06_00_DI303,data1.STN19_00_DI001A,data1.STN20_00_DI001A,data1.STN22_00_DI001A]
            let D_e=[data1.STN08_00_II001,data1.STN07_00_DI001A,data1.STN06_00_DI303,data1.STN19_00_DI001A,data1.STN20_00_DI001A]
            this.getBardata(result[result.length-1],0,D_s[0],D_e[0])
            this.getBardata(result[result.length-2],1,D_s[1],D_e[1])
            this.getBardata(result[4],2,D_s[2],D_e[2])
            this.getBardata(result[5],3,D_s[3],D_e[3])
            this.getBardata(result[7],4,D_s[4],D_e[4])


            //console.log(result[result.length-1])
           
            // this.getBardata(result[result.length-1].data,result.length-2,result[result.length-1].name,result[result.length-1].name2)
            
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
                if (result_data < 0){
                    data1 = (result_data + data.data[i]) /this.stationdis[index]*this.sdis[index]
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
