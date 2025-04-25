<template>
<keep-alive>
  <router-view></router-view>
  </keep-alive>
</template>

<script>
import { eventBus } from './main';
	export default {
		name: 'Diagram',
		data() {
			return {
				//批次跟踪数据库表名
				tableId:0,
				tablename:['mm-yj','yj-ep','ep-hs','hs-jm','gg-ss'],
				oildata:[],//5个地理区间数据
				flag:0,
				num:0,
				datamm:[],
				datayj:[],
				dataep:[],
				datahs:[],
				datagm:[],
				data1:[],
				disyj:[],
				disep:[],
				dishs:[],
				disgm:[],
				Dmm:{},
				Dyj:{},
				Dep:{},
				Dhs:{},
				Dgm:{},
			}
		},
    	created(){
      		// this.$nextTick( async()=>{		
			// 	this.Time_loadOil()
			// 	this.getallrealtime()
			// })
    	},
		mounted()
		{
			var that = this
			// this.loadOil()
			// this.Time_loadOil()
			// this.contactSocket()
			// eventBus.$on('stop',message=>{
			// 	// that.clearTimer()
			// 	that.flag=1
			// })
			// eventBus.$on('start',message=>{
			// 	if(that.flag==1){
			// 		console.log("开启计时器")
			// 		// that.createData()	
			// 		this.getOilbatchTrack()		
			// 		that.flag=0
			// 	}
			// })
		},
		watch: {
			// Dmm(){
			// 	eventBus.$emit('oilDataChange',this.Dmm,this.Dyj,this.Dep,this.Dhs)
      		// } 
		},
		methods: {
			contactSocket () {
				if (window.WebSocket) {
					this.ws = new WebSocket('ws://10.120.103.175:4000');
					this.ws.onopen = function () {
						console.log('连接服务器成功')
						ws.socket.send('你好服务器')
					}
					this.ws.onmessage = function (e) {
						console.log(e.data)
					
					}
					this.ws.onclose = function () {
						console.log('连接已关闭')
					}
				} else {
					console.log('当前浏览器不支持WebSocket！')
				}
			},
			Time_loadOil(){
				this.timer=setInterval(()=>{
					this.getallrealtime()
					this.getOilbatchTrack()		
				},5000)
			},
			clearTimer(){
				clearInterval(this.timer)
				console.log('停止计时器')
			},
			
			getOilbatchTrack(){
				var that=this
				this.$axios({
					mrthid:'get',
					url:'/OilBT/test',
				}).then(res=>{
					// this.oildata.push(res.data)
					console.log(res.data)
					// that.$store.commit('oilDataChange',res.data)
					// eventBus.$emit('oilDataChange',res.data[0],res.data[1],res.data[2],res.data[3],res.data[4])
					eventBus.$emit('oilDataChange',res.data)
				})
			},
			//【批次跟踪数据结束】
			
			getallrealtime(){
				var that=this
				this.$axios({
					mrthid:'get',
					url:'/RT/test',
				}).then(res=>{
					// that.$store.commit('realtimeConfigData',res.data)
					eventBus.$emit('realtimeConfigData',res.data)
				})
			},
		},
		beforeDestroy() {
		// 页面销毁后同时清除定时器，避免占用内存
		}, //生命周期 – 销毁之前

	}

</script>