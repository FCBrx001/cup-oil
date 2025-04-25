<template>
    <div>
    <!-- <div v-show="0===number"> -->
      <div style="text-align: left;">
		  <form>
		  	<h3>折线图属性配置</h3>
			<el-tabs v-model="activeName">
           		 <el-tab-pane name="first" :key="'first'">
					<span slot="label" class="fontClass">样式配置</span>
					<form>
                    <div style="display: inline">
                       <label>标题</label><input type="text" class="input" placeholder="请输入图表标题"  @input="titleInput">
                    </div>
					</form>
            	</el-tab-pane>

            	 <el-tab-pane  name="second" :key="'second'">
					<span slot="label" class="fontClass">数据配置</span>
					<form>
                    <div>
                        <!-- <input type="file" class="input" :id="fileId" > -->
                        <div class="div_label" style="width:100%"><label>选择时间</label></div>
							<el-select v-model="timespan" style="width:58%" placeholder="时间间隔">
								<el-option style="width:90px"
								v-for="item in timeoptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
							
							<div class="block" style="width:35%">
								<span class="demonstration">默认</span>
								<el-date-picker
								v-model="start_value"
								type="date"
								placeholder="选择起始日期"
								format="yyyy-MM-dd"
								value-format="yyyy-MM-dd HH:mm:ss"
								>
								</el-date-picker>
							</div>
							<div class="block" style="width:35%">
								<span class="demonstration">默认</span>
								<el-date-picker
								v-model="over_value"
								type="date"
								placeholder="选择结束日期"
								format="yyyy-MM-dd"
								value-format="yyyy-MM-dd HH:mm:ss"
								>
								</el-date-picker>
							</div>
						 <div class="div_label"><label>数据频率</label></div>
						 <input type="value" v-model="frequent"> 
						 <div class="div_label"><label>故障范围</label></div>
						 <el-slider v-model="rangeValue" 
							range
							show-stops
							:debounce="300"
							@change="rangeChanged">
    					</el-slider>
						<label v-show="parameterShow">选择参数</label>
						<el-checkbox-group v-model="checkedParameter" :min="1" :max="5" @change="handleCheckedParameterChange">
    						<el-checkbox v-for="item in options" :label="item.name" :key="item.value" ></el-checkbox>
  						</el-checkbox-group>
                    </div>
					</form>
                    
            	</el-tab-pane>
				<!--***********************************-->
				<el-tab-pane name="third" :key="'third'">
					<span slot="label" class="fontClass">自定义事件</span>
						<el-input v-model="param" type="textarea" placeholder="请输入自定义的事件" />
						<el-button style="margin-top: 20px;" @click="addEvent(param)">确定</el-button>
				</el-tab-pane>
				<!--***********************************-->
        	</el-tabs>
		  </form>
	  </div>
    </div>
</template>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
"use strict"; 
 import uuidv1 from 'uuid/v1'
 import { Sketch } from 'vue-color'
import { eventBus } from '../../main';
export default ({
    components:{
            'sketch-picker':Sketch,
        },
  	props:{ 
		opinion:{ 
			type:Array,
				default(){
					return []
				}
		},
		ydata:{
				type:Array,
				default(){
					return []
				}
			},
			// x 轴
		x: {
				type: Array,
				default() {
					return []
				}
			}
  },
  data(){
      return{

		  		//默认第一个选项卡
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
				start_value:'',
				over_value:'',  


                activeName: "first",
				param:'',
                charttitle:'',
                seriesnum:2,
                fileId:'',
                isShowColors:true,
                parameterShow:true,
                options:[{
                    name:'恩平FT201流量显示',
                    value:'0',
                },{
                    name:'恩平FT202流量显示',
                    value:'1',
                },{
                    name:'恩平越站流量',
                    value:'2',
                },{
                    name:'恩平进站压力',
                    value:'3',
                },{
                    name:'恩平出站压力',
                    value:'4',
                },{
                    name:'恩平成品油密度',
                    value:'5',
                },{
                    name:'恩平站FT201密度值',
                    value:'6',
                },{
                    name:'恩平站FT202密度值',
                    value:'7',
                },{
                    name:'恩平进站温度',
                    value:'8',
                },{
                    name:'恩平减压阀前压力',
                    value:'9',
                },{
                    name:'恩平减压阀后压力',
                    value:'10',
                }],
				canshu_options:['恩平FT201流量显示','恩平FT202流量显示',
								'恩平越站流量','恩平进站压力','恩平出站压力',
								'恩平成品油密度','恩平站FT201密度值',
								'恩平站FT202密度值','恩平进站温度',
								'恩平减压阀前压力','恩平减压阀后压力'],
                seriesname:'',
                value:'',
                checkedParameter:[],
                isIndeterminate: true,
                checkAll:false,
                frequent:10,
                rangeValue:[20,50]
			}
  },
  mounted(){
	 this.$nextTick(()=>{
		 console.log('==============');
		 //console.log(this.ydata)
		if(this.ydata.length!=0)
        {
			console.log('-------------this.ydata.length!=0-------------')
            this.dataReprocess();
        }
		if(this.opinion.length!=0){
			console.log('进入this.addOptions函数')
			this.addOptions();
		}
	 })
  },
  destroyed () {
  	//this.array = null // 页面卸载的时候解除引用
 },
  watch:{
		checkedParameter:function(){	
			
            
			// console.log('起始时间：',this.start_value)
			// console.log('结束时间：',this.over_value)
			// console.log('时间间隔：',this.timespan)
			// console.log('参数',this.checkedParameter)
			// console.log('总参数',this.options)
			this.getdata()
	    	//this.dataReprocess();
            
		},
		charttitle:function(){
			console.log("watch(charttitle)");
	    	this.styleConfig();
		},
		opinion:function(){
			console.log('*********************opinion变了---------------------');
			this.addOptions();
			//console.log(this.opinion);
		},
		frequent:function(){
			eventBus.$emit('frequentChange',this.frequent);
			let res=[]
			for(let i=0;i<this.ydata.length;i++){
				let temp=[];
				for(let j=0;i<this.ydata[i].length;j+=this.frequent){
					temp.push(this.ydata[i][j]);
				}
				res.push(temp);
			}
			this.ydata=res;
			this.dataReprocess();
		}
	},
  created(){
		this.fileId = uuidv1() //获取随机id
		//console.log("x:",this.x)
  },
  methods:{
	getdata(){
		let timespan = this.timespan
		let start_value = this.start_value
		let over_value = this.over_value
		let obj = this.checkedParameter   //已选参数
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
			console.log("@@@@@ 来自后端/RealMonitor/data:",res.data)
			console.log('数据1',this.canshu_options)
			console.log('数据2',res.data[0])
			console.log('数据3',res.data[1])
			var series = []
			for(let i=0;i<obj.length;i++)
			{
				let index = this.canshu_options.indexOf(obj[i])
				if(index!=-1)
				{
					series.push({
						name:this.canshu_options[index],
						type:'line',
						smooth:true,
						data:res.data[1][i],
							"smooth": true,
						sampling:'lttb',
						emphasis:{
							showSymbol:true
						}
					})
				}
			}
			
			eventBus.$emit('linedataChange111',this.canshu_options,res.data[0],series)
			// console.log(res.data)
			// setTimeout(function(){
			// 	if(res.data[1].length!=0)
			// 	{
			// 	console.log('realtimedata[1].length!=0');
			// 	eventBus.$emit('singleSectionConfigData',res.data);
			// 	}
			// },6000);
			// console.log('end----')
		})
	},
	rangeChanged(){
		//alert(this.rangeValue);
		eventBus.$emit('alertRange',this.rangeValue);
	},
	addEvent(param) {
		eventBus.$emit('lineLinkageConfig',param);
        // this.isShowEvent = false
        // this.$store.commit('addEvent', { event, param })
    },
	addOptions(){
		this.options=[];
		for(let i=0;i<this.opinion.length;i++){
            var obj={}
            obj['name']=this.opinion[i];
            obj['value']=i;
            this.options.push(obj)
        }
		//console.log('#####################options:',this.options)
	},
	handleCheckAllChange(val) {
        this.checkedParameter = val ? this.options : [];
        this.isIndeterminate = false;
    },
    handleCheckedParameterChange(val) {
		//alert(val);
		//alert(this.checkedParameter)
        let checkedCount = val.length;
        this.checkAll = checkedCount === this.options.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.options.length;
    },
	seriesNumInput(event){
		this.seriesnum=event.target.value;
	  },
	titleInput(event){
		//console.log("titleInput");
		this.charttitle=event.target.value;
	},
	 
	styleConfig(){
		eventBus.$emit('linestyleChange',this.charttitle)
	},
	dataReprocess(){

		//console.log("this.opinion:",this.opinion);
		//alert('dataReprocess')
		let len=this.checkedParameter.length;
		var series1=[];
		//alert('11111')
		if(this.opinion.length>0){
			for(let i=0;i<len;i++){
				let index=this.opinion.indexOf(this.checkedParameter[i]);
				if(index!=-1){
					series1.push({
						name:this.opinion[index],
						type:'line',
							//stack: '总量',
						smooth:true,
						data:this.ydata[index],
							"smooth": true,
						sampling:'lttb',
						emphasis:{
							showSymbol:true
						}
					})
					//alert('series1');
					//alert(series1[series1.length-1])
				}
        	}
		}
		else{
			series1.push({
				type:'line',
				//stack: '总量',
				smooth:true,
				data:this.ydata,
					"smooth": true,
				sampling:'lttb',
				emphasis:{
					showSymbol:true
				}
			});
		}

		//alert(this.x);
		eventBus.$emit('linedataChange111',this.opinion,this.x,series1);
	},
  }
})
</script>
<style>
.fontClass{
font-size:16px;
font-family: Microsoft Yahei;
color:white
}
</style>