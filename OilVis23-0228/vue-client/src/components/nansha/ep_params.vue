<template>
    <div style="width:100%; float:center">
        <!-- <div slot="header" class="clearfix">
            
           
        </div> -->
        <!-- 请选择参数： -->
        <!-- <span>参数查询</span> -->
        
            <el-select  style="width:25%;font-size: 50px"  v-model="value" multiple collapse-tags placeholder="出站压力1、出站流量" @change="(val) =>changeval(val)">
                <el-row>
                    <el-col>
                        
                        <el-option 
                        v-for="item in optionsA"
                        :key="item.value"
                        :label="item.name"
                        :value="{name:item.name,value:item.value}">
<!--                         
                        <el-checkbox :key="item.value" v-model="item.check" @change="(val) =>changeval(val, item)">{{item.name}}</el-checkbox>
                        -->
                        </el-option>
                        
                        
                    </el-col>
                </el-row>
            </el-select>
        
        <!-- 请选择时间： -->
            <el-select style="width:20%" v-model="timespan" placeholder="5分钟">
                <el-row>
                <el-col>
                <el-option
                v-for="item in timeoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
                </el-col>
                </el-row>
            </el-select>
            
            <el-date-picker style="width:20%"
            size = "large"
            v-model="start_value"
            type="date"
            placeholder="2023-03-02 00:00:00"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
           
            <el-date-picker style="width:20%" 
            size = "large"
            v-model="over_value"
            type="date"
            placeholder="2023-03-03 00:00:00"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>

            <el-button type="primary" style="width:10%" round @click="suredraw()">确定</el-button>
        
        <div :id="elid" :style="{'width':'100%' ,'height':chartHeight+'px','margin-top': '30px'}">  
        </div>
    </div>
</template>


<script>
    import uuidv1 from 'uuid/v1'
    import * as echarts from 'echarts'
    import { eventBus } from '../../main';
    import {MessageBox} from 'element-ui'

    export default{
        name: "App",
        data(){
            return {
                //南沙站
                

                sszd:{


                    'STN08_00_PIAH001B':'出站压力1',
		            'STN08_00_PIAH001A':'出站压力2',
		            'STN08_00_TI001':'出站温度',
		            'STN08_02_FIC201':'出站流量1(t/h)',
                    'STN08_02_FIC202':'出站流量2(t/h)',
		            'STN08_00_II001B':'出站密度1',
                    'STN08_00_II002B':'出站密度2',
                    'STN08_00_PIC030':'主输泵区（二）入口压力',
                    'STN08_00_PIA032A':'南沙-黄埔主输泵出口汇管压力'
                    
                },


                tableData: [{
					station: '恩平站',
					event_type: '工况报警',
					event_name: ''
				}],
                timeoptions:[{
					value:'5',
					label:'5分钟',
				},{
					value:'10',
					label:'10分钟',
				},{
					value:'30',
					label:'30分钟',
				},{
					value:'60',
					label:'60分钟',
				}],
                timespan:'5',
                optionsA:[],
               

                warn_type:['','阀门内漏','清管','甩泵','阀门打开','阀门关闭','正常','其他工况'],

                value: [],
                checkedvalue:['STN20_00_PI001','STN20_00_PI008'],
                
                start_value:'2023-03-02 00:00:00',
				over_value:'2023-03-03 00:00:00',  

                ydata:[],
                xdata:[],

                seriesdata: [],
                seclectedparm: [],
                legenddata:['出战压力1','出站流量'],

                chartWidth:900,
                chartHeight:570,
                data:'',
                datas:'',
                elid:'',
                flag:'',
                start: '',
                finish: ''
            }
        },
        mounted(){
            
           
        },
        created(){
            this.todaytime()
            this.paramsdatainit()
            this.datainit()
            this.elid = uuidv1() //获取随机id
        },
        methods: { 
            todaytime(){
                let todaydate = new Date()
                let month = todaydate.getMonth()+1
                this.start_value = todaydate.getFullYear()+'-'+month+'-'+todaydate.getDate()+' '+'00:00:00'
                
                this.over_value = todaydate.getFullYear()+'-'+month+'-'+todaydate.getDate()+' '+todaydate.getHours()+':'+todaydate.getMinutes()+':'+todaydate.getSeconds()
                // console.log('今天的时间',this.start_value,this.over_value)
            },
            datainit(){
                
                let timespan = this.timespan
                let start_value = this.start_value
                let over_value = this.over_value
                let obj = this.checkedvalue
                this.$axios({
                    mrthid:'get',
                    url:'/RealMonitor/data',
                    params:{
                        stationname:'南沙',
                        timespan:timespan,
                        start_value:start_value,
                        over_value:over_value,
                        obj:obj
                    }
                }).then(res=>{
                    console.log('返回参数数据',res)
                    for(let i in res.data[0]){
                        res.data[0][i] = this.datetrans(res.data[0][i])
                    }
                    this.ydata = res.data[1]
                    this.xdata = res.data[0]
                    this.drawchart()
                })
            },
            paramsdatainit(){
                const token = sessionStorage.getItem('token');
                this.$axios({
                    mrthid:'get',
                    url:'/RealMonitor/paramdata',
                    headers: {
                    Authorization: `Bearer ${token}`  // 在请求头中附加 JWT Token
                },
                    params:{
                        stationname:'南沙'
                    }
                }).then(res=>{
                    console.log('南沙返回表名',res.data)
                    var option = []
                    for(var i=0;i<res.data.length;i++){
                        var obj = {}
                        //字典修改处
                        // obj['value'] = res.data[i]
                        // obj['name'] = res.data[i]
                        let name = Object.keys(this.sszd)
                        if(name.includes(`${res.data[i]}`)){
                            obj['value'] = res.data[i]
                            obj['name'] = this.sszd[`${res.data[i]}`]
                            obj['check'] = false
                            option.push(obj)
                        }   
                        // obj['value'] = res.data[i]
                        // obj['name'] = this.sszd[`${res.data[i]}`]
                        // //暂时修改
                        // // obj['name'] = res.data[i]
                        // obj['check'] = false
                        // option.push(obj)
                    }
                    console.log('参数转换：',option)
                    this.optionsA = option
                })
            },
            changeevent(){
                console.log('进入changeevent')
                this.$refs.epdialog.openAdd().then(res=>{
					//console.log(res)
				})
            },
            eventsure(){
                MessageBox("工况报警修改成功！","确认提示",)
            },
            datetrans(timespan){
                let date = new Date(timespan)
                    
                const Y = date.getFullYear()+'-';
                const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)+'-';
                const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
                const h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours())+':';
                const min = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+':'
                const s = (date.getSeconds() < 10 ? '0' +date.getSeconds() : date.getSeconds()); // 秒
                let datetime = Y+M+D+'-'+h+min+s
                // console.log('date',date)
                // console.log('datetime',datetime)

                return datetime
            },
            sure(){
                // this.checkedvalue[0]=this.value
                console.log('开始时间',this.start_value)
                let timespan = this.timespan
                let start_value = this.start_value
                let over_value = this.over_value
                let obj = this.seclectedparm
                const token = sessionStorage.getItem('token');
                this.$axios({
                    mrthid:'get',
                    url:'/RealMonitor/data',
                    headers: {
                    Authorization: `Bearer ${token}`  // 在请求头中附加 JWT Token
                },
                    params:{
                        stationname:'南沙',
                        timespan:timespan,
                        start_value:start_value,
                        over_value:over_value,
                        obj:obj
                    }
                }).then(res=>{
                    console.log('返回数据',res)
                    for(let i in res.data[0]){
                        res.data[0][i] = this.datetrans(res.data[0][i])
                    }
                    this.ydata = res.data[1]
                    this.xdata = res.data[0]
                    this.drawchart()
                })
            },
            drawchart(){
                var len = this.ydata.length
                this.seriesdata = [];
                for(var i=0;i<len;i++){
                    var str = this.legenddata[i]
                    if(str.includes("压力")){
                        var obj = {
                            name: this.legenddata[i],
                            type: 'line',
                            // stack: 'Total',
                            lineStyle: {                         
                                width: 3,
                            },
                            data: this.ydata[i],
                            yAxisIndex: 0
                        }
                    }else if(str.includes("流量")){
                        var obj = {
                            name: this.legenddata[i],
                            type: 'line',
                            // stack: 'Total',
                            lineStyle: {                         
                                width: 3,
                            },
                            data: this.ydata[i],
                            yAxisIndex: 1
                        }
                    }else{
                        var obj = {
                            name: this.legenddata[i],
                            type: 'line',
                            // stack: 'Total',
                            lineStyle: {                         
                                width: 3,
                            },
                            data: this.ydata[i],
                            yAxisIndex: 1
                        }
                    }
                    
                    this.seriesdata.push(obj)
                }
                console.log("数据长度",this.seriesdata)

                this.charts = echarts.init(document.getElementById(this.elid));
                this.charts.clear();
			    this.charts.on("click", this.eConsole);
                this.charts.setOption({
                    tooltip: {
                        trigger: 'axis',
                        formatter(params){
                            
                            var reval = params[0].name;
                            for(var i=0;i<params.length;i++){
                                // console.log('tooltip数据值',params[i])
                                reval += '<br/>'+params[i].marker + params[i].seriesName +':  ' +Number(params[i].value).toFixed(3)
                            }
                            return reval;
                        },
                        position: function (pt) {
                        return [pt[0], '10%'];
                        }
                    },
                    legend: {
                        show:'true',
                        textStyle:{
                            fontSize: 18,//字体大小
                            color: '#ffffff'//字体颜色
                        },
                        data:this.legenddata
                        // data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                    },
                    toolbox: {
                        feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xdata,
                        splitLine:{  //决定是否显示坐标中网格
                            show:false
                        },
                        axisLine:{show:true},
                        axisTick: {
                            show: true
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#ffffff'
                            }
                        }

                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '压力（MPa）',
                            nameTextStyle:{
                                color: '#ffffff',
                                fontSize: 18
                            },
                            // boundaryGap: [0, '100%'],
                            splitLine:{  //决定是否显示坐标中网格
                                show:false
                            },
                            axisLine:{show:true},
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#ffffff',
                                    fontSize: 18
                                }
                            }
                        },
                        {
                            type: 'value',
                            name: '流量',
                            nameTextStyle:{
                                color: '#ffffff',
                                fontSize: 18
                            },
                            // boundaryGap: [0, '100%'],
                            splitLine:{  //决定是否显示坐标中网格
                                show:false
                            },
                            axisLine:{show:true},
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#ffffff',
                                    fontSize: 18
                                }
                            }
                        }
                        
                    ],
                    dataZoom: [
                        {
                        type: 'inside',
                        start: 0,
                        end: 100
                        },
                        {
                        start: 0,
                        end: 100
                        }
                    ],
                    series: this.seriesdata
                    // series: [
                    //     {
                        
                    //     type: 'line',
                    //     symbol: 'none',
                    //     sampling: 'lttb',
                    //     itemStyle: {
                    //         color: 'rgb(255, 70, 131)'
                    //     },
                    //     areaStyle: {
                    //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    //         {
                    //             offset: 0,
                    //             color: 'rgb(255, 158, 68)'
                    //         },
                    //         {
                    //             offset: 1,
                    //             color: 'rgb(255, 70, 131)'
                    //         }
                    //         ])
                    //     },
                    //     data: this.ydata[0]
                    //     }
                    // ]
			  },true);
			    
            },
            changeval(val,item){
                this.seclectedparm = []
                this.legenddata = []
                for(var i=0;i<val.length;i++){
                    
                    this.seclectedparm.push(val[i].value)
                    this.legenddata.push(val[i].name)
                }
            },
            suredraw(){
                this.sure()
            }
            
        },
        watch:{
           

        }
    }
</script>
<style lang="less" scoped>
/deep/ .el-icon-arrow-up:before {
  content: ""; //除去右侧小箭头默认样式
  content: "\e78f"; //"\e78f" 先选一个字体图标,F12查看该元素的content,再复制到这里
  width: 60px;
}
/deep/.el-select .el-input .el-select__caret {
    color: #0a53e6; //右侧字体图标的颜色
    font-size: 23px;  //右侧字体图标的大小
    }
/deep/ .el-input__inner {
  height: 50px;  //改变input框的高度
  font-size: 25px; //字体大小
//   color: red; //字体颜色
// background-color: yellow; //背景颜色
}
</style>