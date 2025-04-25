<template>
    <div id="app">
        <el-card class="box-card">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column prop="station" label="站名" width="180"></el-table-column>
                <el-table-column prop="event_type" label="事件类型" width="180"></el-table-column>
                <el-table-column prop="event_name" label="事件名称"></el-table-column>
                <el-table-column label="操作">
                    <el-button type="danger" @click="changeevent">更改</el-button>
                    <el-button type="success" @click="eventsure">确认</el-button>
                </el-table-column>
            </el-table>
            <div slot="header" class="clearfix">
                <span>工况表单</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
		</el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>参数查询</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>

            请选择参数：
                <el-select  v-model="value" placeholder="请选择参数">
                    
                    <el-row>
                    <el-col>
                        <el-option 
                        v-for="item in optionsA"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                        
                    </el-col>
                    </el-row>
                </el-select>
                请选择时间：
                <el-select style="width:120px" v-model="timespan" placeholder="时间间隔">
                    <el-row>
                    <el-col>
                    <el-option style="width:120px"
                    v-for="item in timeoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    </el-col>
                    </el-row>
                </el-select>
                
                

                <el-date-picker
                v-model="start_value"
                type="date"
                placeholder="选择起始日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>

                
                <el-date-picker
                v-model="over_value"
                type="date"
                placeholder="选择结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
                
                <!-- <el-button @click="DDA">执行</el-button> -->
                <!-- <el-button @click="sure">确定</el-button> -->
                <div :id="elid" :style="{'width':chartWidth+'px','height':chartHeight+'px'}">  
                </div>
                <epdialog ref="epdialog"/>
		</el-card>



        
    </div>
</template>


<script>
    import uuidv1 from 'uuid/v1'
    import * as echarts from 'echarts'
    import epdialog from './EP_dialog'
    import { eventBus } from '../../main';
    import {MessageBox} from 'element-ui'

    export default{
        name: "App",
        data(){
            return {
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
                timespan:'',

                optionsA:[{
                    name:'恩平FT201流量显示',
                    value:'恩平FT201流量显示',
                },{
                    name:'恩平FT202流量显示',
                    value:'恩平FT202流量显示',
                },{
                    name:'恩平越站流量',
                    value:'恩平越站流量',
                },{
                    name:'恩平进站压力',
                    value:'恩平进站压力',
                },{
                    name:'恩平出站压力',
                    value:'恩平出站压力',
                },{
                    name:'恩平成品油密度',
                    value:'恩平成品油密度',
                },{
                    name:'恩平站FT201密度值',
                    value:'恩平站FT201密度值',
                },{
                    name:'恩平站FT202密度值',
                    value:'恩平站FT202密度值',
                },{
                    name:'恩平进站温度',
                    value:'恩平进站温度',
                },{
                    name:'恩平减压阀前压力',
                    value:'恩平减压阀前压力',
                },{
                    name:'恩平减压阀后压力',
                    value:'恩平减压阀后压力',
                }],

                warn_type:['','阀门内漏','清管','甩泵','阀门打开','阀门关闭','正常','其他工况'],

                    value: '',
                checkedvalue:[],
                
                start_value:'',
				over_value:'',  

                ydata:[],
                xdata:[],

                

                chartWidth:1200,
                chartHeight:500,
                data:'',
                datas:'',
                elid:'',
                flag:'',
                start: '',
                finish: ''
            }
        },
        mounted(){
            
            eventBus.$on('warncheckId',data=>{
                console.log('aaaa警告值：',data)
                console.log('BBB警告值',`${this.warn_type[data]}`)
                this.tableData=[{
					station: '恩平站',
					event_type: '工况报警',
					event_name: `${this.warn_type[data]}`
				}]
            })

            eventBus.$on('checked_event',data=>{
                console.log('#######返回值',data)
                console.log('#########警告值',`${this.warn_type[data]}`)
                this.tableData=[{
					station: '恩平站',
					event_type: '工况报警',
					event_name: `${this.warn_type[data+1]}`
				}]
            })
        },
        components: {
            'epdialog': epdialog
        },
        created(){
            this.elid = uuidv1() //获取随机id
        },
        methods: {

            
            changeevent(){
                console.log('进入changeevent')
                this.$refs.epdialog.openAdd().then(res=>{
					//console.log(res)
				})
            },
            eventsure(){
                MessageBox("工况报警修改成功！","确认提示",)
            },
            
            sure()
            {


                this.checkedvalue[0]=this.value
                console.log('开始时间',this.start_value)
                let timespan = this.timespan
                let start_value = this.start_value
                let over_value = this.over_value
                let obj = this.checkedvalue
                this.$axios({
                    mrthid:'get',
                    url:'/RealMonitor/data',
                    params:{
                        timespan:timespan,
                        start_value:start_value,
                        over_value:over_value,
                        obj:obj
                    }
                }).then(res=>{
                    console.log('返回数据',res)
                    this.ydata = res.data[1]
                    this.xdata = res.data[0]
                    this.drawchart()
                })
            },
            drawchart(){

                
                this.charts = echarts.init(document.getElementById(this.elid));
                this.charts.clear();
			    this.charts.on("click", this.eConsole);
                this.charts.setOption({
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                        return [pt[0], '10%'];
                        }
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
                        data: this.xdata
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%']
                    },
                    dataZoom: [
                        {
                        type: 'inside',
                        start: 0,
                        end: 10
                        },
                        {
                        start: 0,
                        end: 10
                        }
                    ],
                    series: [
                        {
                        name: 'Fake Data',
                        type: 'line',
                        symbol: 'none',
                        sampling: 'lttb',
                        itemStyle: {
                            color: 'rgb(255, 70, 131)'
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }
                            ])
                        },
                        data: this.ydata[0]
                        }
                    ]
			  },true);
			    // this.charts.setOption({
                //     dataset: [{      
                //         source: datasourse
                //     }],
                //     tooltip: {
                //         trigger: 'axis',
                //         axisPointer: {
                //             type: 'cross'
                //         }
                //     },
                //     xAxis: {
                //         splitLine: {
                //             lineStyle: {
                //                 type: 'dashed'
                //             }
                //         }
                //     },
                //     yAxis: {
                //         splitLine: {
                //             lineStyle: {
                //                 type: 'dashed'
                //             }
                //         }
                //     },
                //     series: [{
                //         name: 'scatter',
                //         type: 'scatter',
                //         datasetIndex: 0
                //     },
                //     {
                //         name: 'line',
                //         type: 'line',
                //         smooth: true,
                //         data: [start,finish]
                //     }]
                // },true);
            },
            
        },
        watch:{
            value(){
                this.sure()
            },
            timespan(){
                this.sure()
            },
            start_value(){
                this.sure()
            },
            over_value(){
                this.sure()
            },

        }
    }
</script>
