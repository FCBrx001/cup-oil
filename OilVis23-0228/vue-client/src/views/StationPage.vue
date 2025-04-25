<template> 
    <div class="StationCharts fl">
        <div class="CLeft">
			<div class="data-box5 box5-back" style="margin-top:20px">
				<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left">[</b>
					<span style="font-size:1.5rem;">沿线参数监测</span>
					<b class="data-title-right">]</b>
				</div>
				<div style="width:100%;height:100%">
					<distancevalue></distancevalue>
				</div>
				<!-- <div style="width:100%;height:50%;" >
					<timevalue ></timevalue>
				</div>    -->
			</div>
			<div class="data-box6 box6-back" style="margin-top:20px">
				<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left">[</b>
					<span style="font-size:1.5rem;">批次跟踪信息</span>
					<b class="data-title-right">]</b>
				</div>
				<div style="width:100%;height:100%">
					<batchdetail ></batchdetail>
				</div>                     
			</div>
        </div>
        <div class="CRight">
			<div class="data-box5 box5-back" style="margin-top:20px">
				<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left">[</b>
					<span style="font-size:1.5rem;">历史参数监测</span>
					<b class="data-title-right">]</b>
				</div>
				<div style="width:100%;height:100%">
					<timevalue ></timevalue>
				</div>                     
			</div>
			<div class="data-box6 box6-back" style="margin-top:20px">
				<i class="topL"></i>
				<i class="topR"></i>
				<i class="bottomL"></i>
				<i class="bottomR"></i>
				<div class="data-title">
					<b class="data-title-left">[</b>
					<span style="font-size:1.5rem;">沿线参数监测</span>
					<b class="data-title-right">]</b>
				</div>
				<div style="width:100%;height:100%">
					<stationMonitor ></stationMonitor>
				</div>                     
			</div>
        </div> 
    </div>
</template>

<script>
   	import ep_params from '../components/enping/ep_params.vue'
	import batchdetail from '../components/OilbatchTracking/batchtrackingdetail.vue'
    // import distancevalue from '../components/realtimeMonitoring/alldistance.vue'
	import stationMonitor from '../components/Monitoring/station_monitoring.vue'
	import timevalue from '../components/realtimeMonitoring/time_value.vue'
	import distancevalue from '../components/realtimeMonitoring/MalldistanceN.vue'
	import ep_gk from '../components/enping/ep_gk.vue'
	import { eventBus } from '../main';

	export default {
		name: 'Diagram',
	    components: {
			'epgk':ep_gk,
			'timevalue':timevalue,
			'epparams':ep_params,
			'batchdetail':batchdetail,
            'distancevalue':distancevalue,
			'stationMonitor':stationMonitor
	    },
		data() {
			return {
                tableId:0,
				tablename:['mm-yj','yj-ep','ep-hs','hs-jm','gg-ss'],
				oildata:[],//5个地理区间数据
				sdis:[102,185,220,263,318,345,383],
                dis:[0,116.8,211.2,251.1,299.7,364.5,396.6,442.3]
			}
		},
		mounted(){
			let that = this
			this.contactSocket()
			 eventBus.$on('ChangeData',result=>{
				that.ws_time.send(result)
			})
		},
		 
 
		//监听参数的变化，如监听路由中id值的变化：
		watch:{
			// '$route.params.station': {
			// 	handler(newVal,oldVal){
			// 		// console.log(newVal,oldVal)
			// 		this.ws.send(newVal)
			// 		//判断newVal有没有值监听路由变化
			// 	},
			// 	deep: true
			// }
		},
		methods: {
            contactSocket () {
				if (window.WebSocket) {
					if(!this.ws){
						// this.ws = new WebSocket('ws://10.120.221.37:3011'); //宿舍
						// this.ws = new WebSocket('ws://192.168.1.103:3011');  //实验室
						this.ws = new WebSocket('ws://127.0.0.1:3011');
						var that=this
						this.ws.onopen = function () {
							// that.ws.send(that.$route.params.station)
							console.log('连接服务器成功')
							// this.ws.socket.send('你好服务器')
						}
						this.ws.onmessage = function (e) {
							eventBus.$emit('realtimeConfigData',JSON.parse(e.data))
						}
						this.ws.onclose = function () {
							console.log('连接已关闭')
						}
					}else {
						alert("ws连接已建立")
					}
					if(!this.ws1){
                        // this.ws1 = new WebSocket('ws://10.120.221.37:3001'); //宿舍
						// this.ws1 = new WebSocket('ws://192.168.1.103:3001'); //实验室
						this.ws1 = new WebSocket('ws://127.0.0.1:3001');
                        this.ws1.onopen = function () {
                            console.log('连接服务器成功')
                            // this.ws.socket.send('你好服务器')
                        }
                        this.ws1.onmessage = function (e) {
							// console.log(e.data)
                            eventBus.$emit('oilDataChange',JSON.parse(e.data))
                        }
                        this.ws1.onclose = function () {
                            console.log('连接已关闭')
                        }
                    }else {
                        alert("ws1连接已建立")
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
                            eventBus.$emit('MAOP_Changed',JSON.parse(e.data))
                        }
                        this.ws_bg.onclose = function () {
                            console.log('连接已关闭')
                        }
                    }else {
                        alert("连接已建立")
                    }
					if(!this.ws_time){
                        // this.ws1 = new WebSocket('ws://10.120.221.37:3001'); //宿舍
                        // this.ws1 = new WebSocket('ws://192.168.1.103:3001');  //实验室
                        this.ws_time = new WebSocket('ws://127.0.0.1:3022');
                        this.ws_time.onopen = function () {
                            console.log('连接time服务器成功')
                            // this.ws.socket.send('你好服务器')
                        }
                        this.ws_time.onmessage = function (e) {
							// console.log(JSON.parse(e.data))
							let all_data = JSON.parse(e.data)
                            let result = []
                            let flag=0
							let position= all_data[0]
                            for(let i=0;i<position.length;i++){
                                var value = position[i]
                                if(i-that.sdis[flag]>=0){
                                    flag++
                                }
                                // console.log(flag)
                                value=(value-that.dis[flag]).toFixed(2)
                                result.push({
                                    value: value,
                                    name: value+' km',
                                    label:i
                                })
                            }
                            that.$store.commit('positions',result)
                            eventBus.$emit('timeData',all_data)
                        }
                        this.ws_time.onclose = function () {
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
		beforeRouteLeave(to, from, next) {
			this.ws.close();
			this.ws=null
            this.ws1.close();
			this.ws1=null
			this.ws_bg.close();
			this.ws_bg=null
			this.ws_time.close();
			this.ws_time=null
			eventBus.$off()
			next();
		},
		// beforeDestroy() {
		// 	this.ws.close();
		// 	this.ws=null
        //     this.ws1.close();
		// 	this.ws1=null
		// 	this.ws_bg.close();
		// 	this.ws_bg=null
		// 	this.ws_time.close();
		// 	this.ws_time=null
		// 	eventBus.$off()
		// // 页面销毁后同时清除定时器，避免占用内存
		// 	// this.ws.close();
		// 	// this.ws=null
        //     // this.ws1.close();
		// 	// this.ws1=null
		// 	// this.ws2.close();
		// 	// this.ws2=null
		// 	// clearInterval(this.timer)
		// 	// this.timer=null;
		// }, //生命周期 – 销毁之前
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
</style>
