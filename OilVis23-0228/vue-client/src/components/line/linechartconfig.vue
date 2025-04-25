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
                activeName: "first",
				param:'',
				 charttitle:'',
				 seriesnum:2,
				 fileId:'',
				 isShowColors:true,
				 parameterShow:true,
				 options:[],
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
			console.log("watch(checkedParameter)");
	    	this.dataReprocess();
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