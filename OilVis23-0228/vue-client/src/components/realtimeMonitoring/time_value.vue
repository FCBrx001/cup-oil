<!-- 折线图 -->
<template>
    <div class='chartground' style='width:100%;height:98%' >

        <el-select  style="width:25%;font-size: 50px"  v-model="time_value" multiple collapse-tags @change="change">
                <el-row>
                    <el-col>
                        <el-option 
                        v-for="item in positions"
                        :key="item.name"
                        :label="item.name"
                        :value="{name:item.name,value:item.label}">
                       
                        </el-option>
                        
                    </el-col>
                </el-row>
            </el-select>
        
        <!-- 请选择时间： -->
            
            <el-button type="primary" style="width:10%" round @click="suredraw()">确定</el-button>

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
            sdis:[103,84,36,43,55,28,44],
            positions:[{
                value:1,
                name:1,
                label:1,
            },{
                value:2,
                name:2,
                label:2,
            },{
                value:3,
                name:3,
                label:3,
            },{
                value:4,
                name:4,
                label:4,
            },{
                value:5,
                name:5,
                label:5,
            }],
            time_value:[],
            active:[
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            name_active:[
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
            ],
            index:0,
            sure:[],
            series:[],
            data:[],
            x:[],
            start:0,
            end:20,
            station:['阳江','恩平','鹤山','江门','高明','三水','花都','南海'],
        }
    },
    created () {
        
   		this.elId = uuidv1() // 获取随机id
        // this.station = this.$route.params.station
        for(let i =0 ;i<1440;i++){
            this.x.push(i)
        }
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
                },
                formatter:function(params){
                    let dis = params[0].dataIndex *60 *1000
                    let x = + new Date()
                    let show = new Date(x-=dis)
                    var Y = show.getFullYear();
                    var M = (show.getMonth() + 1 < 10 ? '0' + (show.getMonth() + 1) : show.getMonth() + 1);
                    var D = (show.getDate() < 10 ? '0'+show.getDate() : show.getDate());
                    var h = (show.getHours() < 10 ? '0'+show.getHours() : show.getHours());
                    var min = (show.getMinutes() < 10 ? '0' + show.getMinutes() : show.getMinutes())
                    let showshen = Y+'-'+M+'-'+D+' '+h+':'+min
                    let str =   `<div style='display: flex;justify-content: space-between;margin-bottom: 12px'>
                                        <span>${showshen}</span>
                                    </div>`;
                    for(let i=0; i<params.length; i++){
                        let series = params[i];
                        // //value判定为空
                        let name = series.seriesName.slice(series.seriesName.length-3,series.seriesName.length-1)
                        if(name=='压力'){
                            str += `<p style='display: flex;justify-content: space-between;align-items: center;'>
                                    <span style='margin-right: 20px'>
                                        <span style=\'display:inline-block;margin-right:4px;border-radius:6px;width:6px;height:6px;background-color: ${series.color};'\></span>
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
                                    <span>m³/h</span>
                                </p>`;
                        }
                        
                    }
                    return str;
                },
                 dataZoom: [
                    {
                        type: 'inside',
                        start: this.start,
                        end: this.end
                    },
                    {
                        start: this.start,
                        end: this.end
                    }
                ],
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: [{
                    data:this.x,
                    type: 'category',
                    boundaryGap :false,
                    axisLine:{
                        show:true,
                        onZero:true,
                    },
                    axisLabel:{
                        show:true,
                        // interval: 20,
                        textStyle: {
                            fontSize: 20,
                            fontWeight:600,
                            color:'white'
                        },
                        margin:-30
                    },
                    z:4,
                    axisTick:{
                        show: true,
                        interval:'auto'
                    }
                }],
                yAxis: [{
                    name:'(MPa)',
                    nameLocation:'middle',
                    nameTextStyle:{
                        color:'white',
                        fontSize: 25,
                        fontWeight:600,
                        
                    },
                    boundaryGap: [0, '100%'],
                    nameGap:30,
                    type: 'value',
                    axisLabel: {
                        color: 'white',
                        fontSize: 25,
                        // fontWeight:600,
                    },
                    min:-1,
                    max:8,
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
                    boundaryGap: [0, '100%'],
                    max:800,
                    min:-100,
                    nameGap:50,
                    type: 'value',
                    axisLabel: {
                        color: 'white',
                        fontSize: 25,
                        // fontWeight:600,
                    },
                    splitLine:{
                        show:false
                    }
                }],
                series:this.series,
            }
  	},
  /* 只要计算属性，这个function内部，所用到的任何data中的数据发送了变化，就会立即重新计算这个计算属性的值； */
    computed: {

    },
    
    mounted () {
        this.drawLine(this.elId)
        this.index = this.station.indexOf(this.$route.params.station)
        let active = this.active[this.index]
        var yl_arr = new Array(active.length).fill(new Array(1440).fill(0))
        var ll_arr = new Array(active.length).fill(new Array(1440).fill(0))
        eventBus.$on('timeData', message => {
            this.data=message
            // console.log(this.data)
            this.distance = this.data[0]
            
            for(let i=0;i<this.data[1].length;i++){
                for(let j=0;j<active.length;j++){
                    yl_arr[j][i]=this.data[1][i][active[j]]
                    ll_arr[j][i]=this.data[2][i][active[j]]
                }
            }
            this.series=[]
            for(let i=0;i<active.length;i++){
                var yl={
                    name: this.name_active[i],
                    data: yl_arr[active[i]],
                    type: 'line',
                    smooth: true,
                    z:3,
                    symbol:'none',
                    lineStyle:{
                        width:2
                    },
                    yAxisIndex: 0
                }
                var ll = {
                    name: this.name_active[i],
                    data: ll_arr[active[i]],
                    type: 'line',
                    z:3,
                    smooth: true,
                    lineStyle:{
                        width:2
                    },
                    symbol:'none',
                    yAxisIndex: 1
                }
                
                this.series.push(yl)
                this.series.push(ll)
            }
            var dataZoom=[
                    {
                        type: 'inside',
                        start: this.start,
                        end: this.end
                    },
                    {
                        start: this.start,
                        end: this.end
                    }
                ]
                this.options.dataZoom=dataZoom
            this.options.series=this.series
            this.positions=this.$store.state.positions.slice(this.$route.params.start,this.$route.params.end)
            this.charts.setOption(this.options)
        })
    },
    watch: {
        "$route.params.station":{
            handler(oldval,newval){
                this.index=this.station.indexOf(oldval)
                // console.log(oldval,newval)
                this.positions=this.$store.state.positions.slice(this.$route.params.start,this.$route.params.end)
                this.time_value = this.name_active[this.index]

                let active = this.active[this.index]
                let sure_name = this.name_active[this.index]
                let yl_arr = new Array(active.length)
                let ll_arr = new Array(active.length)
                for(let j=0;j<active.length;j++){
                    yl_arr[j] = new Array(1440)
                    ll_arr[j] = new Array(1440)
                }
                for(let i=0;i<1440;i++){
                    for(let j=0;j<active.length;j++){
                        yl_arr[j][i]=this.data[1][i][active[j]]
                        ll_arr[j][i]=this.data[2][i][active[j]]
                    }
                }
                for(let i=0;i<active.length;i++){
                    // console.log(sure_name[i])
                    var yl={
                        name: sure_name[i] +'压力:',
                        data: yl_arr[i],
                        type: 'line',
                        smooth: true,
                        z:3,
                        symbol:'none',
                        lineStyle:{
                            width:2
                        },
                        yAxisIndex: 0
                    }
                    var ll = {
                        name: sure_name[i]+'流量:',
                        data: ll_arr[i],
                        type: 'line',
                        z:3,
                        smooth: true,
                        lineStyle:{
                            width:2
                        },
                        symbol:'none',
                        yAxisIndex: 1
                    }
                    this.series.push(yl)
                    this.series.push(ll)
                }
                var dataZoom=[
                    {
                        type: 'inside',
                        start: this.start,
                        end: this.end
                    },
                    {
                        start: this.start,
                        end: this.end
                    }
                ]
                this.options.dataZoom=dataZoom
                this.options.series=this.series
                this.charts.setOption(this.options,true)
            }
        }
    },
    methods: {
        change(val){
            this.sure = val
            // console.log(val)
        },
        suredraw(){
            var sure_active=[]
            var sure_name=[]
            for(let i=0;i<this.sure.length;i++){
                sure_active.push(this.sure[i].value)
                sure_name.push(this.sure[i].name)
            }
            // console.log(this.data)
            this.active[this.index]=sure_active
            this.name_active[this.index] = sure_name
            this.time_value = sure_name
            

            let yl_arr = new Array(sure_active.length)
            let ll_arr = new Array(sure_active.length)
            for(let j=0;j<sure_active.length;j++){
                yl_arr[j] = new Array(1440)
                ll_arr[j] = new Array(1440)
            }
            for(let i=0;i<1440;i++){
                for(let j=0;j<sure_active.length;j++){
                    yl_arr[j][i]=this.data[1][i][sure_active[j]]
                    ll_arr[j][i]=this.data[2][i][sure_active[j]]
                }
            }
            // console.log(yl_arr)
            // console.log(ll_arr)
            this.series=[]
            for(let i=0;i<sure_active.length;i++){
                // console.log(sure_name[i])
                var yl={
                    name: sure_name[i] +'压力:',
                    data: yl_arr[i],
                    type: 'line',
                    smooth: true,
                    z:3,
                    symbol:'none',
                    lineStyle:{
                        width:2
                    },
                    yAxisIndex: 0
                }
                var ll = {
                    name: sure_name[i]+'流量:',
                    data: ll_arr[i],
                    type: 'line',
                    z:3,
                    smooth: true,
                    lineStyle:{
                        width:2
                    },
                    symbol:'none',
                    yAxisIndex: 1
                }
                this.series.push(yl)
                this.series.push(ll)
            }
            var dataZoom=[
                    {
                        type: 'inside',
                        start: this.start,
                        end: this.end
                    },
                    {
                        start: this.start,
                        end: this.end
                    }
                ]
                this.options.dataZoom=dataZoom
            this.options.series=this.series
            this.charts.setOption(this.options,true)
        },
        drawLine (id) {  
            // alert('this')
            if (this.times == 1) {
                this.charts = echarts.init(document.getElementById(id))
                this.times++
            }
            var that=this
            this.charts.clear()
            // this.charts.setOption(this.options, true)
            this.charts.on('mouseover', function (params) {     
                eventBus.$emit('stop',params)
            })
            this.charts.on('globalout',function(params){
                eventBus.$emit('start',params)
            })
            this.charts.on('dataZoom',function(params){
                that.start = params.start
                that.end = params.end
                
                // console.log(params)
            })
        }
    }
}
</script>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
