<template>
    <div style="float:left;width:90%">
        <!-- <img src="./assets/logo.png"> -->

            <!-- 内容正文 -->
            <div class="zhenwen">
                <!-- 左侧图表展示 -->
                <div class="left_gk fl">
                    <!-- 恩平站信息 -->
                    <div class="data-box1 left_tb box1-backlu fl " >
                        <i class="topL"></i>
                        <i class="topR"></i>
                        <i class="bottomL"></i>
                        <i class="bottomR"></i>
                        <div class="data-title" style="width:13rem;">
                            <b class="data-title-left fl">[</b>
                            <span style="font-size:1.5rem;width:12rem;">恩平站信息</span>
                            <b class="data-title-right fr">]</b>
                        </div>
                            <!-- 项目概览-->
                        <div class="xmglan">        
                            <ul class="xmgl_heard">
                                
                            </ul>            
                            <div id="xmgl_cen">              
                                <div class="xmgl_tb">
                                    <ul class="xm_cszs">
                                    <li style="font-size:1.5rem;">管线：<span style="font-size:1.5rem;">珠三角西线</span></li>
                                    <li style="font-size:1.5rem;">设备参数：<span style="font-size:1.5rem;">18</span>个</li>
                                    <li> <span> </span> </li>
                                    <li> <span> </span></li>
                                    </ul>
                                </div>             
                            </div>
                        </div>     
                    </div>     
                    <!-- 恩平站信息统计 -->
                    <div class="data-box1 left_tb box1-backld fl mtop40">
                        <i class="topL"></i>
                        <i class="topR"></i>
                        <i class="bottomL"></i>
                        <i class="bottomR"></i>
                        <div class="data-title" style="width:13rem;">
                            <b class="data-title-left fl">[</b>
                            <span style="font-size:1.5rem;width:12rem;">恩平站信息统计</span>
                            <b class="data-title-right fr">]</b>
                        </div>
                            <!-- 项目人员信息状态-->
                        <div class="xmglan">        
                            <div class="wgrytj">
                                <span class="wgrytj_bt" style="font-size:1.2rem;width:95%;">恩平站工况统计
                                    <el-select style = "width:40%;float: right;" v-model="value" placeholder="阀门内漏" @change="selectChanged">
                                        <el-row>
                                            <el-col>
                                            <el-option
                                            v-for="item in options"
                                            
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                            </el-col>
                                        </el-row>
                                    </el-select>

                                </span>
                                
                                
                                <div class="wgrytj_tb">
                                    <div id="gztj" style="height:33%">
                                        <epfmstatis></epfmstatis>
                                    </div>                    
                                </div>
                            </div>   
                            
                            <div class="wgrytj">
                                <span class="wgrytj_bt" style="font-size:1.2rem;">恩平站工况准确率统计</span>
                                <div class="wgrytj_tb">
                                    <div id="gztj" style="height:33%">
                                        <epgkzql></epgkzql>
                                    </div>                    
                                </div>
                            </div>
                            
                            <div class="wgrytj">
                                <span class="wgrytj_bt" style="font-size:1.2rem;">恩平站工况占比统计</span>
                                <div class="wgrytj_tb">
                                    <div id="xcrytj" style="height:33%">
                                        <epgkstatis></epgkstatis>
                                    </div>                    
                                </div>
                            </div>
                        </div>     
                    </div>                           
                </div>
                <!--中间图表展示-->
                <div class="center_zsgk fl">
                    <div class="data-box1 box1-backcu">
                        <i class="topL"></i>
                        <i class="topR"></i>
                        <i class="bottomL"></i>
                        <i class="bottomR"></i>
                        <div class="data-title" style="width:13rem;">
                            <b class="data-title-left fl">[</b>
                            <span style="font-size:1.5rem;width:12rem;">运行参数监测</span>
                            <b class="data-title-right fr">]</b>
                        </div>
                        <div>
                            <!-- 图表组件 -->
                            <epparams></epparams>
                        </div>                       
                    </div>

                    <div class="data-box1 box1-backcd mtop40">
                    <i class="topL"></i>
                        <i class="topR"></i>
                        <i class="bottomL"></i>
                        <i class="bottomR"></i>
                        <div class="data-title" style="width:13rem;">
                            <b class="data-title-left fl">[</b>
                            <span style="font-size:1.5rem;width:12rem;">工况警告表单</span>
                            <b class="data-title-right fr">]</b>
                        </div>
                        <!--问题等级-->
                        <div class="ryclts">          			
                            <div id="fxbhqs" style="height:300px">

                                <!-- 图表组件 -->
                                <epgk></epgk>
                            </div>
                        </div>
                    </div>
                </div>    
                <!--右侧图表展示 -->
                <div class="right_gk fl">
                    <!-- 工况警告表单 -->        
                    <div class="data-box1 right_tb_up ">
                        <i class="topL"></i>
                        <i class="topR"></i>
                        <i class="bottomL"></i>
                        <i class="bottomR"></i>
                        <div class="data-title" style="width:13rem;">
                            <b class="data-title-left fl">[</b>
                            <span style="font-size:1.5rem;width:12rem;">站内流程图</span>
                            <b class="data-title-right fr">]</b>
                        </div>
                        <div class="ryclts"> 
                            <div id="xjfxzt" style="height:300px,weight:200ps">
                                
                                <!-- 工况组件 -->
                                
                                <ep_gongyi></ep_gongyi>
                                
                                <!-- <ep_gongyi></ep_gongyi> -->
                                
                            </div>
                        </div> 
                    </div>  
                    
                    <!-- 工况统计信息 -->        
                    <div class="data-box1 right_tb_down mtop40">
                        <i class="topL"></i>
                        <i class="topR"></i>
                        <i class="bottomL"></i>
                        <i class="bottomR"></i>
                        <div class="data-title" style="width:13rem;">
                            <b class="data-title-left fl">[</b>
                            <span style="font-size:1.5rem;width:12rem;">历史工况表单</span>
                            <b class="data-title-right fr">]</b>
                        </div>
                        <!--问题等级-->
                        <div class="ryclts">          			
                            <div id="fxbhqs" style="height:300px">                                
                                <gk_history></gk_history>
                            </div>
                        </div> 
                    </div>   
                </div>
            </div>
        
    </div>
</template>

<script>

    import { eventBus } from '../../main';
    import ep_gk from '../enping/ep_gk.vue'
    import ep_params from '../enping/ep_params.vue'
    
    import ep_gongyi from '../enping/ep_gongyi.vue'
    import ep_gkstatis from '../enping/ep_gkstatis.vue'
    import ep_gk_zql from '../enping/ep_gk_zql.vue'
    import ep_fmtable from '../enping/ep_fmtable.vue'
    import ep_fmstatis from '../enping/ep_fmstatis.vue'

    import gk_history from '../enping/gk_history.vue'


    export default {
        name: 'home',
        components:{
            'epgk':ep_gk,
            'epparams':ep_params,
            'epgkstatis':ep_gkstatis,
            'epgkzql':ep_gk_zql,
            'epfmtable':ep_fmtable,
            'epfmstatis':ep_fmstatis,
            'ep_gongyi':ep_gongyi,
            'gk_history':gk_history
        },
        data(){
            return{
                station:'',
                warnId:202202001,
                warndata:[],
                warntypeId:0,
                options: [ {
                    value: 'fmnl',
                    label: '阀门内漏'
                    }, {
                    value: 'kgf',
                    label: '开关阀'
                    }, {
                    value: 'sb',
                    label: '甩泵'
                    }, {
                    value: 'qg',
                    label: '清管'
                    }],
                value: 'fmnl'
            }
        },
        mounted(){
            // eventBus.$on('mmstation',data=>{
            //     this.station = data
            //     console.log('mm站名',data)
            // })
            // this.Time_warn_check()
        
        },
        methods:{

            //更改工况统计选图
            selectChanged(value){
                console.log('选中的值',value)
                eventBus.$emit('ep_gk_statis',value)
            },

            Time_warn_check(){
				setInterval(()=>{
			        this.warn_check()
			    },60000)
			},
            warn_check(){
				console.log('进入warn_check')
                
				this.$axios({
					mrthid:'get',
					url:'/Popup/warn_check',
					params:{
						//this.station就是实际的库名
                        stationname:'恩平',
                        collectionname:'label'
					}
				}).then(res=>{
					//将站名传到图组件中
                    
                    // this.warndata.push(this.station)
                    // console.log('mm2站名',this.warndata)
					this.warndata=res.data   //将传回的data数组赋值给this.warndata,为了传到dialog中
					console.log('返回的最新一条工况：',this.warndata)
                    let date = new Date(this.warndata[0]['datetime'])
                    
                    const Y = date.getFullYear()+'-';
                    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)+'-';
                    const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
                    const h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours())+':';
                    const min = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+':'
                    const s = (date.getSeconds() < 10 ? '0' +date.getSeconds() : date.getSeconds()); // 秒
                    let datetime = Y+M+D+'-'+h+min+s
                    console.log('date',date)
                    console.log('datetime',datetime)
                    this.warndata[0]['datetime']=datetime
                    eventBus.$emit('ep_warn',this.warndata)

                    
					// console.log('测试：',res.data)
					// if(res.data[0].warn_type!=0)
					// {
					// 	this.warntypeId = res.data[0].warn_type
					// 	// console.log('warntypeId',this.warntypeId)
						
                    //     console.log('')
					// 	eventBus.$emit('ep_warn',this.warndata[0])
					// 	//this.tankuang(this.warncheckId)
					// }
				})
			},
            handlehome(){
                this.$router.push('/roothome')
            },
            handlepcgz()
            {
                this.$router.push('/home_pcgz')
            }
                
        },
        beforeDestroy() {
			console.log("关闭连接");
			next();
			eventBus.$off()
		},
        
    }
</script>

<style>
#home {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
 .router-link-active{
		color:aqua
	} 
  .title{
	height: 10%;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
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
  height: 40px;  //改变input框的高度
  font-size: 20px; //字体大小
//   color: red; //字体颜色
// background-color: yellow; //背景颜色
}
</style>
