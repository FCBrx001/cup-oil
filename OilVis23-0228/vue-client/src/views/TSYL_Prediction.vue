<template>
  <div class="StationBox">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pipeSegments: [
        { 
          start: '黄埔', 
          end: '东莞', 
          imageUrl: require('@/assets/img/测试图片.jpg'),
          detail: '黄埔到东莞管段详细信息',
          state: '停输',
          isNormal: true
        },
        { 
          start: '阳江', 
          end: '恩平', 
          imageUrl: require('@/assets/img/测试图片.jpg'),
          detail: '阳江到恩平管段详细信息',
          state: '停输',
          isNormal: false
        },
        { 
          start: '恩平', 
          end: '鹤山', 
          imageUrl: require('@/assets/img/测试图片.jpg'),
          detail: '恩平到鹤山管段详细信息',
          state: '停输',
          isNormal: false
        },
        { 
          start: '鹤山', 
          end: '江门', 
          imageUrl: require('@/assets/img/测试图片.jpg'),
          detail: '鹤山到江门管段详细信息',
          state: '停输',
          isNormal: false
        },
        { 
          start: '江门', 
          end: '高明', 
          imageUrl: require('@/assets/img/测试图片.jpg'),
          detail: '江门到高明管段详细信息',
          state: '停输',
          isNormal: false
        }
      ],
      hoverSegment: null
    };
  },
  methods: {
    mmyjPage() {
      this.$router.push('/home/TSYL_Prediction');
    },
    handleHover(segment) {
      this.hoverSegment = segment;
    },
    handleLeave() {
      this.hoverSegment = null;
    },
    goToDetail(segment) {
      console.log(segment.detail);
    },
    mounted() {
      let that = this
      this.contactSocket()
      eventBus.$on('ChangeData',result=>{
        that.ws_time.send(result)
      })
    },
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
				
			}
  },
  mounted() {
    // 这里可以添加 WebSocket 连接的逻辑
    this.ws = new WebSocket('ws://127.0.0.1:3005');
    // this.ws.onmessage = (event) => {
    //   console.log(event.data);
    // };
  },
};

</script>

<style lang="less" scoped>
.StationBox {
  display: flex;
  min-height: 100vh;
  background-color: #1a1e30;
  width: 100%;
}

/* 移除左侧栏相关样式，保留其他样式以备将来使用 */
</style>