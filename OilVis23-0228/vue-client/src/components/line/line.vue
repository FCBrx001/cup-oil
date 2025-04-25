<!-- 折线图 -->
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
		<div class="main_title">{{titleText}}</div>
    <div :id="elId" :style="{'width':chartWidth+'px','height':chartHeight+'px'}"></div>
  </div>
</template>

<script>
"use strict"; 
 import uuidv1 from 'uuid/v1'
  import * as echarts from 'echarts'
  import { eventBus } from '../../main';
  import mixin from '@/mixins/index.js'
// let echarts = require('echarts/lib/echarts');
// require('echarts/lib/chart/line'); //所需图表
  export default {
		mixins:[mixin],
		//name:'linechart',
		props: {
			// 样式 - 1
			chartWidth:{
				type: Number,
				default:500
			},
			chartHeight:{
				type: Number,
				default:500
			},
		},
		data(){
			return{
				/*子组件向父组件传递数据 */
				 elId: '',
				 charts:null,
				 times:1,
				 opinion:[],
				 x:[],
				 opinionData:[],
				 titleText:'实时监测预警',
				 func:'',
				 alertRange:[0,20]
			}
		},
		created(){
   			this.elId = uuidv1() //获取随机id
			eventBus.$on('linedataChange111', (message0,message1,message2) => {
				this.opinion=message0;
				this.x=message1;
				this.opinionData=message2;
				
				console.log("linedataChange")
    		});
			eventBus.$on('linestyleChange',(message)=>{
				this.titleText=message;
			})
			/*************** */
			eventBus.$on('lineLinkageConfig',(message)=>{
				 this.func=message
			})
			eventBus.$on('alertRange',message=>{
				this.alertRange=message;
			})
			/************** */
  		},
		/*只要计算属性，这个function内部，所用到的任何data中的数据发送了变化，就会立即重新计算这个计算属性的值； */
		computed:{
			'param':function(){
				//console.log("this.chartHeight:",this.chartHeight);
				return this.x,this.opinionData
			}
		},
		mounted(){
			// this.readfile();
			//this.addSeries();
			 this.drawLine(this.elId);
			// window.addEventListener('resize', function() {
        	// 	this.charts.resize()
      		// }.bind(this))
		},
		// beforeDestory(){
		// 	   if(this.charts){
        //     	echarts.dispose(this.charts);
  	    //         this.charts = null;
		// 		window.addEventListener=null;}
	    // },
		watch:{
			alertRange(){
				this.drawLine(this.elId);
				//自适应窗口大小
				window.addEventListener('resize', function() {
					this.charts.resize()
				}.bind(this))
			},
			ydata(){
				this.drawLine(this.elId);
				//自适应窗口大小
				window.addEventListener('resize', function() {
					this.charts.resize()
				}.bind(this))
			},
			param(){
				console.log("param")
				this.drawLine(this.elId);
				//自适应窗口大小
				window.addEventListener('resize', function() {
					this.charts.resize()
				}.bind(this))
					// // 新建一个promise对象
		//     let newPromise = new Promise((resolve) => {
		//     resolve()
		//     })
		//     //然后异步执行echarts的初始化函数
		//     newPromise.then(() => {
		//   //	此dom为echarts图标展示dom
		//     this.drawLine(this.elId);
		//     })
		// 				//自适应窗口大小
		// 	 			window.addEventListener('resize', function() {
		//     			this.charts.resize()
		//   				}.bind(this))
				}
		},
		methods: {
			// 绘制折线图
			drawLine(id){
			  console.log("drawLine")
			  if(this.times==1){
				   this.charts = echarts.init(document.getElementById(id));
				   this.times++;
			  }
			  this.charts.clear();
			  this.charts.on("click", this.eConsole);
			  this.charts.setOption({
			  	title: {
			  		left: 'center',
		  	        // text: this.titleText, //标题文本
					textStyle:{
						fontSize:18,
						fontWeight:'bold',
						color:'#fff'
					}
		  	    },
		  	    tooltip: {
					trigger: 'axis',
					axisPointer: {
						label: {
							show: true,
							backgroundColor: '#fff',
							color: '#556677',
							borderColor: 'rgba(0,0,0,0)',
							shadowColor: 'rgba(0,0,0,0)',
							shadowOffsetY: 0
						},
						lineStyle: {
							width: 0
						}
					},
					backgroundColor: '#fff',
					textStyle: {
						color: '#5c6c7c'
					},
					padding: [10, 10],
					extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
				},
				legend: {
					orient: 'vertical',
					x:'right',
					//left: 'right',
					// top:'bottom',
					// backgroundColor: ‘rgba(0,0,0,0.2)’,
					data: this.opinion, // 区域名称
					textStyle:{
                          color:'#fff',
                          fontSize:14
                      }
				},	
		  	    grid: {
		  	        right: 200,
		  	        // right: '4%',
		  	        // bottom: '4%',
		  	        // containLabel: true
		  	    },
		  	    // toolbox: {
		  	    //     feature: {
		  	    //         saveAsImage: {},
				// 		dataZoom : {show: true}
		  	    //     }
		  	    // },
				//数据区域缩放、滚动条
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,  //数据窗口范围的起始百分比,表示0%
                end: 100    //数据窗口范围的结束百分比,表示100%
            },
            {
                type: 'inside',
                xAxisIndex: [0],
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                yAxisIndex: [0],
                start: 0,
                end: 100
            }
        ],
		  	    xAxis: {   // x 轴
		  	        type: 'category',
		  	       // boundaryGap: false,
					// nameTextStyle:{
					// 	overflow:'breakAll'
					// },
		  	        data: this.x,
					axisLabel: {
						 color:'#fff',
						 fontSize:12,
						//X轴标签 label 做了特殊处理，防止左右溢出
					formatter: (value, index) => {
						if (index === 0 || index === this.x.length - 1) {
							return "";
						}
						return value;
						}
					},
					// axisLabel:{
					// 	 color:'#fff',
					// 	 fontSize:12
					// }
		  	    },
		  	    yAxis: {   // y 轴
		  	        type: 'value',
					scale:true,//是否是脱离 0 值比例。设置成 true 后坐标刻度不会强制包含零刻度
					splitNumber:5,
					// min:500,
					// max:700,
					axisLabel: {
                            color: '#fff',
                            fontSize:12
                        },
		  	    },
		  	    series: this.opinionData,  // 区域数据
				visualMap: [{ //改变线的颜色
					show: true,
					dimension: 1,
					type:'piecewise',
					left: '1%',
					top: '6%',
					textStyle:{
                          color:'#fff',
                          fontSize:14
                    },
					pieces: [{min: this.alertRange[0], max: this.alertRange[1], color: 'red', label: '不合格'}],//pieces的值由动态数据决定
					outOfRange: {
					color: 'green',
					symbol: 'triangle',
					}
				}],
			  },true);
			  	 var that=this
			     this.charts.on('click',function (params) {
					 eventBus.$emit('line_parallel_Linkage',that.func,params);
					 console.log("line自定义")
				// 	if(params.componentType=="series"){
                //     	console.log("line:",params);
                // 	}
				// 	//console.log("y:",params.value);
        		 });
			}
		}
	}
	/*
	param.name：X轴的值
	param.value：Y轴的值
	param.data：Y轴的值
	param.type：点击事件均为click
	param.seriesName：legend的名称
	param.seriesIndex：系列序号（series中当前图形是第几个图形第几个）
	param.dataIndex：数值序列（X轴上当前点是第几个点）
	*/
/*

 */
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
