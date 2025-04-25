<template>
	<div class="zhenwen">
		<!-- 左侧图表展示 -->
		<div class="left_zs fl">
			<!-- 恩平站信息 -->
			<div class="data-box1 left_tb fl">
				<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left fl">[</b>
					<span>茂名站信息</span>
					<b class="data-title-right fr">]</b>
				</div>
					<!-- 项目概览-->
				<div class="xmglan">        
					<ul class="xmgl_heard">
						
					</ul>            
					<div id="xmgl_cen">              
						<div class="xmgl_tb">
							<ul class="xm_cszs">
							<li>所在管线：<span>华南管线</span></li>
							<li>设备参数：<span>11</span>个</li>
							<li>距首站位置：<span>104</span>km</li>
							<li>油品品类：<span>#0号柴油</span></li>
							</ul>
						</div>             
					</div>
				</div>     
			</div>     
			<!-- 恩平站信息统计 -->
			<div class="data-box1 left_tb fl mtop40">
				<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left fl">[</b>
					<span>茂名站信息统计</span>
					<b class="data-title-right fr">]</b>
				</div>
					<!-- 项目人员信息状态-->
				<div class="xmglan">        
					<div class="wgrytj">
						<span class="wgrytj_bt">茂名站阀门状态统计</span>
						<div class="wgrytj_tb">
							<div id="gztj" style="height:150px">
								<epfmstatis></epfmstatis>
							</div>                    
						</div>
					</div>   
					
					<div class="wgrytj">
						<span class="wgrytj_bt">茂名站工况准确率统计</span>
						<div class="wgrytj_tb">
							<div id="gztj" style="height:150px">
								<epgkzql></epgkzql>
							</div>                    
						</div>
					</div>
					
					<div class="wgrytj">
						<span class="wgrytj_bt">茂名站工况统计</span>
						<div class="wgrytj_tb">
							<div id="xcrytj" style="height:150px">
								<epgkstatis></epgkstatis>
							</div>                    
						</div>
					</div>
				</div>     
			</div>                           
		</div>
		<!--中间图表展示-->
		<div class="center_zs fl">
			<div class="data-box1 box1-back">
				<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left">[</b>
					<span>参数监测</span>
					<b class="data-title-right">]</b>
				</div>
				<div>
					<!-- 图表组件 -->
					<epparams></epparams>
				</div>                       
			</div>

			<div class="data-box1 box1-back2 mtop40">
			<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left">[</b>
					<span>工况警告表单</span>
					<b class="data-title-right">]</b>
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
		<div class="right_zs fl">
			<!-- 工况警告表单 -->        
			<div class="data-box1 right_tb_up ">
				<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left">[</b>
					<span>阀门开关检测</span>
					<b class="data-title-right">]</b>
				</div>
				<div class="ryclts"> 
					<div id="xjfxzt" style="height:300px,weight:200ps">
						
						<!-- 工况组件 -->
						
						<epfmtable></epfmtable>
					</div>
				</div> 
			</div>  
			
			<!-- 工况统计信息 -->        
			<div class="data-box1 right_tb_down mtop40">
				<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left">[</b>
					<span>全线工况统计信息</span>
					<b class="data-title-right">]</b>
				</div>
				<!--问题等级-->
				<div class="ryclts">          			
					<!-- <div id="fxbhqs" style="height:300px"> -->
						
						<!-- 图表组件 -->
					
						<qxgkstatis></qxgkstatis>
					
					<!-- </div> -->
				</div> 
			</div>   
		</div>
	</div>
</template>

<script>

    import { eventBus } from '../main';
    import ep_gk from '../components/enping/ep_gk.vue'
    import ep_params from '../components/enping/ep_params.vue'
    import qx_gkstatis from '../components/enping/qx_gkstatis.vue'
    import ep_gkstatis from '../components/enping/ep_gkstatis.vue'
    import ep_gk_zql from '../components/enping/ep_gk_zql.vue'
    import ep_fmtable from '../components/enping/ep_fmtable.vue'
    import ep_fmstatis from '../components/enping/ep_fmstatis.vue'


    export default {
        name: 'home',
        components:{
            'epgk':ep_gk,
            'epparams':ep_params,
            'qxgkstatis':qx_gkstatis,
            'epgkstatis':ep_gkstatis,
            'epgkzql':ep_gk_zql,
            'epfmtable':ep_fmtable,
            'epfmstatis':ep_fmstatis
        },
        data(){
            return{
                warnId:202202001,
                warndata:[],
                warntypeId:0,
            }
        },
        mounted(){
            this.Time_warn_check()
        },
        methods:{
            Time_warn_check(){
				this.timer=setInterval(()=>{
			        this.warn_check()
			    },6000)
			},
            warn_check(){
				console.log('进入warn_check')
				let warnId = this.warnId
				this.$axios({
					mrthid:'get',
					url:'/Popup/warn_check',
					params:{
						warnId:warnId
					}
				}).then(res=>{
					//判断传回值，接入弹框
					this.warndata = res.data   //将传回的data数组赋值给this.warndata,为了传到dialog中
					this.warnId++
					// console.log('测试：',res.data)
					if(res.data[0].warn_type!=0)
					{
						this.warntypeId = res.data[0].warn_type
						// console.log('warntypeId',this.warntypeId)
						this.$message.success('茂名站工况警告！')
						eventBus.$emit('ep_warn',this.warndata[0])
						//this.tankuang(this.warncheckId)
					}
				})
			},
            handlehome(){
                this.$router.push('/roothome')
            },
            handlepcgz()
            {
                this.$router.push('/home_pcgz')
            }
                
        }
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
