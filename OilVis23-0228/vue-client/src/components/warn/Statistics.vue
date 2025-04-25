<template>
    <div  style="width:100%;height:100%">
        <div :id="elId" style="width:100%;height:100%;float:left">
        </div>
    </div>
</template>
<script>
"use strict"; 
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'
import { eventBus } from '../../main'
export default {
    name:'Statistics',
    data(){
        return{
            value0:0,
            value92:0,
            value95:0,
            times:1,
            sumdata:0,
            echartData : [{
                name: '0#柴油',
                value: 0,
            },{
                name: '92#汽油',
                value: 0,
            },{
                name: '95#汽油',
                value: 0,
            }]
        }
    },
    created(){
   		this.elId = uuidv1() //获取随机id
  	},
    mounted(){
        var that = this
        eventBus.$on('oilDataChange',result =>{
            for(let i =result.length-1;i>=0;i--){
                let name2 = result[i].name[1] ? result[i].name[1] : ''
                let data = result[i].batch_v[1] ? result[i].batch_v[1] : result[i].batch_v[0]
                that.datacom(result[i].batch_v[0],result[i].name[0],data,name2)
            }
            that.drawChart(this.elId)
            that.echartData=[{
                name: '0#柴油',
                value: '0',
            },{
                name: '92#汽油',
                value: '0',
            },{
                name: '95#汽油',
                value: '0',
            }]
            that.value0=0
            that.value92=0
            that.value95=0
            that.sumdata=0
        })
        
    },
    methods:{
        datacom(data1,name1,data2,name2){
            var that=this
            switch(name1){
                case '0#柴油':
                    that.value0+=data1
                    that.echartData[0].value=that.value0.toFixed(0).toString()
                    that.sumdata+=data1                    
                    break
                case '92#汽油':
                    that.value92+=data1
                    that.echartData[1].value=that.value92.toFixed(0).toString()
                    that.sumdata+=data1   
                    break
                case '95#汽油':
                    that.value95+=data1
                    that.echartData[2].value=that.value95.toFixed(0).toString()
                    that.sumdata+=data1   
                    break
                default:
                    break
            }
            switch(name2){
                case '0#柴油':
                    that.value0+=data2
                    that.echartData[0].value=that.value0.toFixed(0).toString()
                    that.sumdata+=data2                    
                    break
                case '92#汽油':
                    that.value92+=data2
                    that.echartData[1].value=that.value92.toFixed(0).toString()
                    that.sumdata+=data2   
                    break
                case '95#汽油':
                    that.value95+=data2
                    that.echartData[2].value=that.value95.toFixed(0).toString()
                    that.sumdata+=data2   
                    break
                default:
                    break
            }
        },
        drawChart(id){
            var that=this
            let color = ['#FAC858', '#73C0DE', '#EE6666', '#F8456B', '#00FFFF', '#4AEAB0'];
            let formatNumber = function (num) {
                if(num==0){
                    let n=num.toString()+'m³\n占比：0%'
                     return n;
                }
                let n=num.toString()+'m³\n占比：'+(num/that.sumdata*100).toFixed(0)+'%'
                return n;
            };
            if(this.times==1){
                this.charts = echarts.init(document.getElementById(id));
                this.times++;
            }
            this.charts.clear();
            this.charts.on("click", this.eConsole);
            this.charts.setOption({
                color: color,
                title: [
                    {
                        text: '管容量',
                        x: '40%',
                        top: '40%',
                        textStyle: {
                            color: '#fff',
                            fontSize: 40,
                            fontWeight: '100',
                        },
                    },
                    {
                        //text: '3000m³',
                        text: that.sumdata.toFixed(0)+'m³',
                        x:  '34%',
                        top: '53%',
                        textStyle: {
                            fontSize: 45,
                            color: '#00f0ff',
                            foontWeight: '500',
                        },
                    },
                ],
                animation:false,
                polar: {
                    radius: ['50%', '80%'],
                    center: ['47%', '50%'],
                },
                angleAxis: {
                    max: 100,
                    show: false,
                },
                radiusAxis: {
                    type: 'category',
                    show: true,
                    axisLabel: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['45%', '55%'],
                        center: ['50%', '50%'],
                        data: this.echartData,
                        
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                // color:'#FAC858',
                                borderColor: '#364684',
                                borderWidth: 2,
                            },
                        },
                        labelLine: {
                            normal: {
                                length: 50,
                                length2: 20,
                                lineStyle: {
                                    color: '#e6e6e6',
                                },
                            },
                        },
                        label: {
                            normal: {
                                formatter: (params) => {
                                    return '{name|' + params.name +' '+ '}{value|' + formatNumber(params.value) + '}';
                                },
                                padding: [0, -70, 0, -70],
                                rich: {
                                    icon: {
                                        fontSize: 16,
                                        align: 'left',
                                        padding: [4, 0, 0, 0],
                                    },
                                    name: {
                                        fontSize: 23,
                                        align: 'left',
                                        fontWeight: 'bold',
                                        padding: [10, 0, 0, 0],
                                        color: '#fff',
                                    },
                                    value: {
                                        fontSize: 21,
                                        fontWeight: 'bold',
                                        padding: [4, 0, 0, 0],
                                        color: '#fff',
                                        align: 'left',
                                    },
                                },
                            },
                        },
                    },
                    {
                        name: '',
                        type: 'pie',
                        startAngle: 90,
                        radius: '40%',
                        hoverAnimation: false,
                        center: ['50%', '50%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false,
                                },
                                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                                    {
                                        offset: 1,
                                        color: 'rgba(50,171,241, 1)',
                                    },
                                    {
                                        offset: 0,
                                        color: 'rgba(55,70,130, 0)',
                                    },
                                ]),
                                // borderWidth: 1,
                                // borderColor: '',
                                shadowBlur: 10,
                                // shadowColor: 'rgba(55,70,130, 1)'
                            },
                        },
                        data: [
                            {
                                value: 100,
                            },
                        ],
                    },
                ],
            })
        }
    }
}
</script>