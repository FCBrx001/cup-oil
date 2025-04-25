<template>
    <div class="chartground" >
         <!--左上边框-->
        <div class="t_line_box">
            <i class="t_l_line"></i> 
            <i class="l_t_line"></i> 
        </div> 
        <!--右上边框-->
        <div class="t_line_box">
            <i class="t_r_line"></i> 
            <i class="r_t_line"></i> 
        </div> 
        <!--左下边框-->
        <div class="t_line_box">
            <i class="l_b_line"></i> 
            <i class="b_l_line"></i> 
        </div> 
            <!--右下边框-->
            <div class="t_line_box">
            <i class="r_b_line"></i> 
            <i class="b_r_line"></i> 
        </div> 
        <!-- <div><input type="file" class="input" :id="fileId" ></div> -->
        <div :id="elId"  :style="{'width':chartWidth+'px','height':chartHeight+'px'}"></div>
    </div>
</template>
<script>
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'
import { eventBus } from '../../main'
// let echarts = require('echarts/lib/echarts');
// require('echarts/lib/chart/pie'); //所需图表
export default {
    name:'roseDiagram',
    props:{
        chartWidth:{
				type: Number,
				default:500
		},
		chartHeight:{
				type: Number,
				default:500
		},
       
        titleText: {
				type: String,
				default: '玫瑰',
				required:true, //必传属性
                textStyle:{
						fontSize:18,
						fontWeight:'bold',
						color:'#fff'
					}
		},
        // data:{
        //     type:Array,
        //     default(){
        //         return[]
        //     }
        // },
        // innervalue:{
        //     type:Array,
        //     default(){
        //         return[]
        //     }
        // },
        // outervalue:{
        //     type:Array,
        //     default(){
        //         return[]
        //     }
        // },
        // specificCauseCount:{
        //     type:Array,
        //     default(){
        //         return[]
        //     }
        // },
        // position:{
        //     type:Array,
        //     default(){
        //         return[]
        //     }
        // }
    },
    data(){
        return{
            elId:'',
            fileId:'',
            charts:null,
            accidentData:[],
            position:[],
            yard:'三水',//默认值
            yardAccidentData:[],
            innervalue:[],
            outervalue:[],
        }
    },
    created(){
        this.elId = uuidv1() //获取随机id
        this.fileId = uuidv1() //获取随机id
        //响应字符云点击事件
        eventBus.$on('yardSelected',message=>{
            this.yard=message;
            console.log(this.yard);
        })
        eventBus.$on('rosechartDataArrived',message=>{
            //console.log('22222222')
            this.position=message[0];
            this.accidentData=message[1];
            //console.log('33333333:',this.accidentData)
        })
        console.log('444444444:',this.accidentData)
    },
    mounted(){
        this.charts = echarts.init(document.getElementById(this.elId));
        //自适应窗口大小
		window.addEventListener('resize', function() {
        	this.charts.resize()
      	}.bind(this))
    },
     computed:{
		// 'param':function(){
		// 	//console.log("this.chartHeight:",this.chartHeight);
		// 	return this.innervalue,this.outervalue,this.specificCauseCount
		// },
        
	},
    watch:{
        // param1(){
        //     this.drawRosediagram(this.elId);
        //     //自适应窗口大小
        //     window.addEventListener('resize', function() {
        //         this.charts.resize()
        //     }.bind(this))
        // },
        yard(){
            if(this.accidentData.length>0){
                console.log('this.accidentData is changed')
                this.dataReprocess();
            } 
        }

    },
    methods:{
        dataReprocess(){
            var index=this.position.indexOf(this.yard);
            this.yardAccidentData=this.accidentData[index];
            console.log('this.yardAccidentData=========',this.yardAccidentData)
            var specificCause=[];
            var cause=[];
            var causevalue=[];
            var specificCauseValue=[];
            for(let i=0;i<this.yardAccidentData.length;i++){
                var cause_index=cause.indexOf(this.yardAccidentData[i]['事故原因']);
                if(cause_index==-1){
                    cause.push(this.yardAccidentData[i]['事故原因'])
                    causevalue.push(parseInt(this.yardAccidentData[i]['事故次数']))
                }
                else{
                    causevalue[cause_index]+=parseInt(this.yardAccidentData[i]['事故次数']);
                }
                var specificCause_index=specificCause.indexOf(this.yardAccidentData[i]['具体原因']);
                if(specificCause_index==-1){
                    specificCause.push(this.yardAccidentData[i]['具体原因'])
                    specificCauseValue.push(parseInt(this.yardAccidentData[i]['事故次数']))
                }
                else{
                    specificCauseValue[specificCause_index]+=parseInt(this.yardAccidentData[i]['事故次数']);
                }
            }
            console.log('cause,causevalue:',cause,causevalue);
            console.log('specificCause,specificCauseValue:',specificCause,specificCauseValue);
            for (let i = 0; i < cause.length; i++) {
                this.innervalue.push({
                    name: cause[i],
                    value: causevalue[i],
                });
            }
            for (let i = 0; i < specificCause.length; i++) {
                   this.outervalue.push({
                        name: specificCause[i],
                        value: specificCauseValue[i],
                    });
            }
            /*for(let i=0;i<array2.length;i++){//36为具体故障类型个数
                if(that.position!=null&&(that.position[that.position.length-1]!=array2[i][0]))
                {
                    that.position.push(array2[i][0]);
                }
                if(cause!=null&&(cause[cause.length-1]!=array2[i][1])&&(cause.length<6))//7为故障类型个数
                {
                    cause.push(array2[i][1]);
                }
                if(i<36){
                    that.specificCauseCount[i]=new Array;
                    that.specificCauseCount[i].push(array2[i][1]); 
                    that.specificCauseCount[i].push(array2[i][2]);        
                    that.specificCauseCount[i].push(array2[i][3]);
                    specificCause.push(array2[i][2]);
                    for(let j=36;j<array2.length;j++){
                        if(array2[j][2]==array2[i][2])
                        {
                            that.specificCauseCount[i].push(array2[j][3]);
                        }
                    }
                }     
            }
            //console.log("position:",that.position);
            //console.log("cause:",cause);
            console.log("specificCause:",specificCause);
            console.log("specificCauseCount:",that.specificCauseCount);
            for (let i = 0; i < that.specificCauseCount.length; i++) {
                var count=0;
                for(let j=2;j<that.specificCauseCount[i].length;j++){
                    count=count+that.specificCauseCount[i][j];
                }
                // console.log("this:",this);
                // console.log("that:",that);
                that.outervalue.push({
                    name: that.specificCauseCount[i][1],
                    value: count,
                });
            }
            for (let i = 0; i < cause.length; i++) {
                var count2=0;
                for (let j = 0; j < that.specificCauseCount.length; j++){
                    if(that.specificCauseCount[j][0]==cause[i])
                    {
                        for(let k=2;k<that.specificCauseCount[j].length;k++){
                            count2=count2+that.specificCauseCount[j][k];
                        }
                    }
                }  
                that.innervalue.push({
                    name: cause[i],
                    value: count2,
                });
            }*/ 
            console.log("outervalue:",this.outervalue);
            console.log("innervalue:",this.innervalue);  
            this.drawRosediagram()
        },
        drawRosediagram(){
			 // console.log("id3:",id);
            //console.log("rose");
          
            this.charts.clear();
            this.charts.on("click", this.eConsole);
            var that=this;

    //          var getinnername = ['未知原因', '第三方活动', '腐蚀', '机械故障', '操作失误','自然灾害','设备故障'];
    //          var getinnervalue = [217,286,159,152,64,55,52];
              //var getbl=[22,29,16.1,15.4,6.5,5.6,5.3];
//               var getoutername = [
  

//     '高压电',
//     '重压',
//     '河运',
//     '除挖掘外的运输/其他设备活动',
//     '机械挖掘',
//     '其他活动',

//     '应力腐蚀',
//     '内部腐蚀',
//     '外部腐蚀',
//     '其他腐蚀',

//     '支撑物故障',
//     '老化',
//     '建造缺陷',
//     '超压',
//     '材料缺陷',
//     '焊接不良',
//     '其他故障',

//     '关闭',
//     '压力测试',
//     '清管作业',
//     '阀门操作',
//     '维修/保养',
//     '报废',
//     '日常操作',
//     '启动',
//     '其他操作',

//     '低温天气',
//     '侵蚀',
//     '暴雨',
//     '泥石流',
//     '洪水',
//     '闪电',
//     '其他灾害',

//     '泵/压缩机',
//     '阀门',
//     '其他设备故障'

// ];
// var getoutervalue = [1,2,3,44,218,18,16,36,76,31,3,14,16,22,25,43,29,1,1,1,4,43,3,4,5,2,2,1,5,5,12,26,4,9,21,22];

// var data = [];
// for(var i = 0;i<getinnername.length;i++){
// 	data.push({name:getinnername[i],value:getinnervalue[i]});
// }

let scale = 1;
// var innervalue = [];
// for (var i = 0; i < getinnername.length; i++) {
//     innervalue.push({
//         name: getinnername[i],
//         value: getinnervalue[i],
//     });
// }
// var outervalue = [];
// for (var i = 0; i < getoutername.length; i++) {
//        outervalue.push({
//             name: getoutername[i],
//             value: getoutervalue[i],
//         });
// }
            
	this.charts.setOption({
    title: {
        text: this.titleText,
        left: 'center',
        textStyle:{
            color:'#fff'
        }
    },
    tooltip:{
            trigger: 'item',
            formatter:"{a}<br/>{b}：{c} ({d}%) "
        },
    toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        },
    },
    calculable : true,//手柄拖拽调整选中的范围
    
    series: [
        {
            name: '事故原因',
            type: 'pie',
            radius: [20, 50],
            //center: ['50%', '50%'],
           // roseType: 'area',
            //width:'50%',
           itemStyle: {
                normal: {
                    show: false,
                },
            },
            label: {
                normal: {
                    show: false,
                },
            },
            labelLine: {
                normal: {
                    show: false,
                },
            },
            data: this.innervalue,
            color:['#99CCCC','#336666','#336699','#999966','#666666','#CCCCCC','#6e6b41','#b69968'],
        },
        {
            name: '具体原因',
            type: 'pie',
            radius: [52, 100],
           // center: ['50%', '50%'],
            roseType: 'radius',
            itemStyle: {
                normal: {
                    show: false,
                },
            },
            label: {
                normal: {
                    show: false,
                },
            },
            labelLine: {
                normal: {
                    show: false,
                },
            },
                //高亮样式设置
            emphasis: {
                    label : {
                        show : true
                    },
                    labelLine : {
                        show : true,
                       lineStyle:{
                           color:'#fff'
                       }
                    }
                },
            data: this.outervalue,
            color:['#99CCCC','#336666','#336699','#999966','#666666','#CCCCCC','#6e6b41','#b69968','#274d3d','#274d3d','#596032','#336699'],
        }
    ]
    },true);
    /*that.charts.on('click',function (params) { 			
        if(params.componentType=="series"){
                //console.log("rose:",params.data.name,typeof(params.data.name));
                var stack;
                var name=[];
                var series=[];
                var serises_i=0;
                for(let i=0;i<that.specificCauseCount.length;i++){       
                    if(that.specificCauseCount[i][0]==params.data.name){
                        name.push(that.specificCauseCount[i][1]);
                        stack=that.specificCauseCount[i][0];
                        series[serises_i]=new Array();
                        for(let j=2;j<that.specificCauseCount[i].length;j++){
                            series[serises_i].push(that.specificCauseCount[i][j]);
                        }
                        serises_i++;                                 
                    }
                }
        }
        //console.log("stack:",stack);
        //console.log("name:",name);
        //console.log("series:",series);
        var barseries=[];
        for(let i=0;i<name.length;i++){
            barseries.push({
                name: name[i],
                type: 'bar',
                stack: stack,
                emphasis: {
                    focus: 'series'
                },
                data: series[i]
            })
        }
        //console.log("barseries:",barseries);
        that.$emit('seriesChange',that.position,barseries);
    });*/
           //

           //
	 
        }
    }
   
}
/*
// let echartData = {
//     inner: innervalue,
//     outer: outervalue,
// };

// let legend1 = echartData.inner.map((v) => v.name);
// let legend2 = echartData.outer.map((v) => v.name);
// let legendData = [...legend1, ...legend2];

// var option = {
//     title: {
//         text: '事故原因占比',
//         top: 180,
//         left: 250
//     },
//     tooltip: {
//         trigger: 'item',
//         formatter: '{b}：{c}',
//     },
//     legend: {
//         top:'bottom',
//         orient: 'horizontal',
// 		height:'88%',
//         right: '11%',
//         icon: 'circle',
//         itemWidth: 10,
//         itemHeight: 10,
//         itemGap:10,
//         data: getinnername,
//         formatter: function(name) {
//             for (var i = 0; i<getinnername.length; i++) {
// 				if (name == data[i].name) {
// 					return '{name|' + name+'}{value|'+getinnervalue[i] +'次}{rate|' + getbl[i]+ '%}'
// 				}
//             }
//         },
//         textStyle: {
//             rich: {
//                 name: {
//                     fontSize: 13,
//                     fontWeight: 400,
//                     width: 50,
//                     height: 35,
//                     padding:[0,0,0,10],
// 					color:'#666666'
//                 },
//                 value: {
//                     fontSize: 13,
//                     fontWeight: 400,
//                     width: 50,
//                     height: 35,
//                     padding:[0,0,0,25],
// 					color:'#333333'
//                 },
//                 rate: {
//                     fontSize: 13,
//                     fontWeight: 500,
//                     height: 35,
//                     width: 55,
//                     align:'left',
// 					color:'#666666'
//                 }
//             }
//         }        
//     },
//     series: [
//         {
//             type: 'pie',
//             radius: ['10%', '24%'],
//             itemStyle: {
//                 normal: {
//                     show: false,
//                 },
//             },
//             label: {
//                 normal: {
//                     show: false,
//                 },
//             },
//             labelLine: {
//                 normal: {
//                     show: false,
//                 },
//             },
//             data: echartData.inner,
//         },
//         {
//             type: 'pie',
//             radius: ['26%', '70%'],
//             roseType: 'radius',
//             data: echartData.outer,
//             labelLine: {
//                 normal: {
//                     show: false,
//                 },
//             },
//             label: {
//                 normal: {
//                     show: false,
//                 },
//             },
//         },
//     ],
// };
// this.charts.setOption(option); */
</script>