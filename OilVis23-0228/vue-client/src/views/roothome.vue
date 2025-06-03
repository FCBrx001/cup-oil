<template>
    <!-- 内容正文 -->
    <div class="zhenwen">
        <!-- 左侧图表展示 -->
        <div class="left_zs fl">
            <!-- 恩平站信息 -->
            <div class="data-box3 left_tb fl">
                <i class="topL"></i>
                <i class="topR"></i>
                <i class="bottomL"></i>
                <i class="bottomR"></i>
                <div class="data-title">
                    <b class="data-title-left fl">[</b>
                    <span style="font-size:1.5rem;">批次统计分析</span>
                    <b class="data-title-right fr">]</b>
                </div>
                    <!-- 项目概览-->
                <div style="width:100%;height:100%;float:left;margin-top:-1.5rem;"> 
                    <statics/>     
                    
                </div>     
            </div>     
            <!-- 恩平站信息统计 -->
            <div class="data-box3 left_tb fl mtop40">
                <i class="topL"></i>
                <i class="topR"></i>
                <i class="bottomL"></i>
                <i class="bottomR"></i>
                <div class="data-title">
                    <b class="data-title-left fl">[</b>
                    <span style="font-size:1.5rem;">全线信息统计</span>
                    <b class="data-title-right fr">]</b>
                </div>
                    <!-- 项目人员信息状态-->
                <div style="width:100%;height:100%;float:left">      
                    <rightup></rightup>
                </div>     
            </div>                           
        </div>
        <!--中间图表展示-->
        <div class="center_zs fl">
            <div class="data-box4 root-box-back">
                <i class="topL"></i>
                <i class="topR"></i>
                <i class="bottomL"></i>
                <i class="bottomR"></i>
                <div class="data-title">
                    <b class="data-title-left">[</b>
                    <span style="font-size:1.5rem;">批次跟踪监测</span>
                    <b class="data-title-right">]</b>
                </div>
                <div style="width:100%;height:100%">
                    <batchtracking></batchtracking>
                </div>                       
            </div>
        </div>
       
    </div>
</template>

<script>

    import { eventBus } from '../main';
    import leftup from '../components/root_home/left_up.vue'
    import leftdown from '../components/root_home/left_down.vue'
    import rightup from '../components/root_home/right_up.vue'
    import rightdown from '../components/root_home/right_down.vue'
    import batchtracking from '../components/OilbatchTracking/batchtracking.vue'
    import leftdownup from '../components/root_home/left_down_up.vue'
    import leftdownd from '../components/root_home/left_down_d.vue'
    import statics from '../components/warn/Statistics.vue'
    import all from '../components/OilbatchTracking/batchtrackingall.vue'
    export default {
        name: 'roothome',
        components:{
            'all':all,
            'statics':statics,
            'leftup':leftup,
            'leftdown':leftdown,
            'rightup':rightup,
            'rightdown':rightdown,
            'batchtracking':batchtracking,
            'leftdownup':leftdownup,
            'leftdownd':leftdownd
        },
        data(){
            return{
                
            }
        },
        mounted(){
            this.contactSocket()
            // 输出Vuex state到控制台
            this.logVuexState()
            
            // 设置定时器，每10秒输出一次最新的state
            this.stateLogTimer = setInterval(() => {
                this.logVuexState()
            }, 10000)
        },
        methods:{
            contactSocket () {
                var that=this
				if (window.WebSocket) {
					if(!this.ws){
						// this.ws = new WebSocket('ws://10.120.221.37:3001'); //宿舍
                        // this.ws = new WebSocket('ws://192.168.1.103:3001'); //实验室
                        this.ws = new WebSocket('ws://127.0.0.1:3001');
						this.ws.onopen = function () {
							console.log('连接服务器成功')
							// this.ws.socket.send('你好服务器')
						}
						this.ws.onmessage = function (e) {
							eventBus.$emit('oilDataChange',JSON.parse(e.data))
						}
						this.ws.onclose = function () {
							console.log('连接已关闭')
						}
					}else {
						alert("连接已建立")
					}
                    if(!this.ws1){
                        // this.ws1 = new WebSocket('ws://10.120.221.37:3091'); //宿舍
						// this.ws1 = new WebSocket('ws://192.168.1.103:3091'); //实验室
                        this.ws1 = new WebSocket('ws://127.0.0.1:3091');
						this.ws1.onopen = function () {
							console.log('连接服务器成功')
							// this.ws.socket.send('你好服务器')
						}
						this.ws1.onmessage = function (e) {
                            that.$store.commit('params',JSON.parse(e.data))
                            console.log('收到3091端口数据:', JSON.parse(e.data))
                            // alert("数据更新")
						}
						this.ws1.onclose = function () {
							console.log('连接已关闭')
						}
					}else {
						alert("连接已建立")
					}
					
				} else {
					console.log('当前浏览器不支持WebSocket！')
				}
			},
            logVuexState() {
                console.log('==== Vuex Store State ====')
                console.log('Dmm:', this.$store.state.Dmm)
                console.log('Dyj:', this.$store.state.Dyj)
                console.log('Dep:', this.$store.state.Dep)
                console.log('Dhs:', this.$store.state.Dhs)
                console.log('Dgm:', this.$store.state.Dgm)
                console.log('realtimedata:', this.$store.state.realtimedata)
                console.log('paramsData:', this.$store.state.paramsData)
                console.log('positions:', this.$store.state.positions)
                console.log('========================')
            }
        },
        beforeRouteLeave(to, from, next) {
			this.ws.close();
			this.ws=null
            this.ws1.close();
			this.ws1=null
            // 清除定时器
            if (this.stateLogTimer) {
                clearInterval(this.stateLogTimer)
            }
			console.log("关闭连接");
			next();
            eventBus.$off()
		},
    }
</script>

<style>
#roothome {
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
</style>
