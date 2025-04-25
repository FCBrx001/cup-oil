<template>
	<div class="SZW">
        <!-- 左侧图表展示 -->
        <div class="SLF fl">
            <!-- 恩平站信息 -->
            <div class="data-box1 left_tb fl">
                <i class="topL"></i>
                <i class="topR"></i>
                <i class="bottomL"></i>
                <i class="bottomR"></i>
                <div class="data-title" style="width:13rem;">
                    <b class="data-title-left fl">[</b>
                    <span style="font-size:1.5rem;width:12rem;">全线水头流量变化</span>
                    <b class="data-title-right fr">]</b>
                </div>
                    <!-- 项目概览-->
                <div style="width:100%;height:100%;margin-top:-4.2rem;">
                    <el-radio-group v-model="radio1" @change="change">
                        <el-radio-button :label="1" >南沙-花都</el-radio-button>
                        <el-radio-button :label="2" >南沙-南海</el-radio-button>
                        <el-radio-button :label="3" >茂名-江门</el-radio-button>
                    </el-radio-group>
                    <KeepAlive>
                        <component :is="test" style="margin-top:-1rem;"></component> 
                    </KeepAlive>
                </div>     
            </div>     
            <!-- 恩平站信息统计 -->
            <div class="data-box2 left_tb fl mtop40">
                <i class="topL"></i>
                <i class="topR"></i>
                <i class="bottomL"></i>
                <i class="bottomR"></i>
                <div class="data-title">
                    <b class="data-title-left fl">[</b>
                    <span style="font-size:1.5rem;">全线批次统计</span>
                    <b class="data-title-right fr">]</b>
                </div>
                    <!-- 项目人员信息状态-->
                <div style="width:100%;height:100%">
					<tableall></tableall>  
                    
                </div>     
            </div>                           
        </div>
        <!--右侧图表展示 -->
        <div class="SRT fl">
            <!-- 工况警告表单 -->        
            
            <div class="data-box1 root-right_tb_up ">
                <i class="topL"></i>
                <i class="topR"></i>
                <i class="bottomL"></i>
                <i class="bottomR"></i>
                <div class="data-title">
                    <b class="data-title-left">[</b>
                    <span style="font-size:1.5rem;">沿线批次信息</span>
                    <b class="data-title-right">]</b>
                </div>
				<!-- <div style="width:50%;height:100%;float:left;"> 
                    <statics></statics>
                </div>  -->
                <div style="width:80%;height:80%;float:left;margin-left:6rem;margin-top:5rem"> 
                    <remind></remind>
                </div> 
            </div>  
            <div class="data-box2  root-right_tb_down mtop40 ">
                <i class="topL"></i>
                <i class="topR"></i>
                <i class="bottomL"></i>
                <i class="bottomR"></i>
                <div style="width:100%;height:100%;float:left"> 
                    <div class="data-title">
                        <b class="data-title-left">[</b>
                        <span style="font-size:1.5rem;">沿线参数检测</span>
                        <b class="data-title-right">]</b>
                    </div>
                    <div> 
                        <parametermonitoring></parametermonitoring>
                    </div> 
                </div>
                 <!-- <div style="width:100%;height:50%;float:left"> 
                    <div class="data-title">
                        <b class="data-title-left">[</b>
                        <span>压力预警模块</span>
                        <b class="data-title-right">]</b>
                    </div>
                    <div> 
                        <prepress></prepress>
                    </div> 
                </div> -->
            </div>
        </div>
    </div>
</template>

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
	import tableall from '../components/OilbatchTracking/batchtrackingall.vue'
	import batchtracking from '../components/OilbatchTracking/batchtracking.vue'
	import realtime from '../components/realtimeMonitoring/alldistance.vue'
    import NSrealtimeSD from '../components/realtimeMonitoring/NSdistanceSD.vue'
    import MrealtimeN from '../components/realtimeMonitoring/distance_value.vue'
	import { eventBus } from '../main';
	import remind from '../components/warn/remind.vue'
	import DisInfo from '../components/infomation/disinfo.vue'
    import statics from '../components/warn/Statistics.vue'
    import parametermonitoring from '../components/Monitoring/parameter_monitoring.vue';
    import prepress from '../components/Monitoring/prepress.vue';
	export default {
		name: 'StationHome',
	    components: {
            'statics':statics,
			'remind':remind,
			'tableall':tableall,
			'realtime':realtime,
			'batchtracking':batchtracking,
			'disinfo':DisInfo,
            'parametermonitoring':parametermonitoring,
            'prepress':prepress,
            'MrealtimeN':MrealtimeN,
            'NSrealtimeSD':NSrealtimeSD
	    },
		data() {
			return {
                radio1:1,
                test:'NSrealtimeSD',
				namemm:'茂名',
				nameyj:'阳江',
				nameep:'恩平',
				namehs:'鹤山',
                slices:[0,199],
                val:1,
                
			}
		},
		mounted(){
            let that=this
            eventBus.$on('ChangeData',result=>{
                
				that.ws.send(result)
			})
            this.contactSocket()
		},
		watch:{
		},
		methods: {
            change(val){
                if(val === 1){
                    this.test=NSrealtimeSD;
                    this.val =1 
                    console.log("切换到南沙-花都")
                    this.ws.send('花都')
                }else if(val === 2){
                    this.val =2 
                    this.test=MrealtimeN;
                    this.ws.send('南海')
                    console.log("切换到南沙-南海")
                }else if(val === 3){
                    this.val =3
                    this.test=realtime;
                    this.ws.send('茂名')
                    console.log("切换到茂名-江门")
                }
            },
			contactSocket () {
				if (window.WebSocket) {
					if(!this.ws){
                        var that = this
                        this.ws = new WebSocket('ws://127.0.0.1:3011');
						// this.ws = new WebSocket('ws://10.120.221.37:3011');  //宿舍
                        // this.ws = new WebSocket('ws://192.168.1.103:3011');  //实验室
						this.ws.onopen = function () {
							console.log('连接服务器成功')
							// this.ws.socket.send('你好服务器')
						}
						this.ws.onmessage = function (e) {
                            let data = JSON.parse(e.data)
                            let test = []
                            // console.log(data)
                            if(that.val === 1){
                                test = [
                                    data[0].slice(0,199),
                                    data[1].slice(0,199),
                                    data[2].slice(0,199),
                                    data[3].slice(0,199),
                                    data[4].slice(0,199)
                                ]
                            }else if(that.val === 2){
                                test = [
                                    data[0].slice(0,161).concat(data[0].slice(199,data[0].length)),
                                    data[1].slice(0,161).concat(data[1].slice(199,data[0].length)),
                                    data[2].slice(0,161).concat(data[2].slice(199,data[0].length)),
                                    data[3].slice(0,161).concat(data[3].slice(199,data[0].length)),
                                    data[4].slice(0,161).concat(data[4].slice(199,data[0].length))
                                ]
                            }else{
                                test = data
                            }
							eventBus.$emit('realtimeConfigData',test)
						}
						this.ws.onclose = function () {
							console.log('连接已关闭')
						}
					}else {
						alert("连接已建立")
					}
					if(!this.ws1){
                        // this.ws1 = new WebSocket('ws://10.120.221.37:3001'); //宿舍
                        // this.ws1 = new WebSocket('ws://192.168.1.103:3001');  //实验室
                        this.ws1 = new WebSocket('ws://127.0.0.1:3001');
                        this.ws1.onopen = function () {
                            console.log('连接服务器成功')
                            // this.ws.socket.send('你好服务器')
                        }
                        this.ws1.onmessage = function (e) {
                            eventBus.$emit('oilDataChange',JSON.parse(e.data))
                        }
                        this.ws1.onclose = function () {
                            console.log('连接已关闭')
                        }
                    }else {
                        alert("连接已建立")
                    }
                    if(!this.ws_bg){
                        // this.ws1 = new WebSocket('ws://10.120.221.37:3001'); //宿舍
                        // this.ws1 = new WebSocket('ws://192.168.1.103:3001');  //实验室
                        this.ws_bg = new WebSocket('ws://127.0.0.1:3002');
                        this.ws_bg.onopen = function () {
                            console.log('连接服务器成功')
                            // this.ws.socket.send('你好服务器')
                        }
                        this.ws_bg.onmessage = function (e) {
                            // eventBus.$emit('MAOP_Changed',JSON.parse(e.data))
                        }
                        this.ws_bg.onclose = function () {
                            console.log('连接已关闭')
                        }
                    }else {
                        alert("连接已建立")
                    }
				} else {
					console.log('当前浏览器不支持WebSocket！')
				}
				
			},
		},
		created(){
		},
		// beforeDestroy() {
        //     this.ws.close();
		// 	this.ws=null
        //     this.ws1.close();
		// 	this.ws1=null
        //     this.ws_bg.close();
		// 	this.ws_bg=null
        //     eventBus.$off()
		// // 页面销毁后同时清除定时器，避免占用内存
		// }, //生命周期 – 销毁之前
        beforeRouteLeave(to, from, next) {
			this.ws.close();
			this.ws=null
            this.ws1.close();
			this.ws1=null
            this.ws_bg.close();
			this.ws_bg=null
			console.log("关闭连接");
            eventBus.$off()
			next();
		},
	}

</script>
<style lang="less">
body {
    margin: 0;
    padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
 .router-link-active{
	color:aqua
} 
.el-radio-button__inner {
    font-size:25px;
}

</style>
