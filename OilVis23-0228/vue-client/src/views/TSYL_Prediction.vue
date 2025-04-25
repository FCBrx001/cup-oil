<template>
  <div class="StationBox">
    <div class="Sleft">
      <h2>管段选择</h2>
      <el-menu class="el-menu-vertical-demo" default-active="1" style="background-color: #2b2f45;height: 0px;">
        <el-row>
          <el-col :span="24">
            <div 
              v-for="(segment, index) in pipeSegments" 
              :key="index"
              class="segment-item"
              @mouseenter="handleHover(segment)"
              @mouseleave="handleLeave"
            >
              <el-menu-item 
                :index="(index + 1).toString()" 
                @click="mmyjPage"
                style="border-radius: 5px;padding: 5px 5px 5px 10px;"
              >
                <span class="segment-text">
                  {{ segment.start }}
                  <i class="el-icon-d-arrow-right flow1"></i>
                  <i v-for="i in 2" :key="i" class="el-icon-d-arrow-right flow2"></i>
                  {{ segment.end }}
                </span>
              </el-menu-item>
              <img 
                :src="segment.imageUrl" 
                alt="测试图片" 
                class="segment-image"
              >
              <div class="status-container">
                <div class="status-box">
                  <span class="status-dot" :class="{ 'status-stopped': segment.state === '停输' }"></span>
                  <span class="status-text">{{ segment.state }}</span>
                </div>
                <div class="status-box">
                  <span class="status-dot" :class="{ 'status-normal': segment.isNormal, 'status-abnormal': !segment.isNormal }"></span>
                  <span class="status-text">{{ segment.isNormal ? '正常' : '异常' }}</span>
                </div>
              </div>
              <!-- <el-button type="primary" @click="goToDetail(segment)">查看详情</el-button> -->
              <div v-if="hoverSegment === segment" class="hover-tooltip">
                管段：{{ segment.start }} - {{ segment.end }}
              </div>
            </div>
          </el-col>
        </el-row>
      </el-menu>
    </div>
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
          state: '停输', // 统一为 state 字段
          isNormal: false  //该阶段是否正常
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
}

.Sleft {
  margin-top: 50px;
  border-radius: 10px;
  height:1000px;
  border-right: 2px solid #4a5470;
  width: 300px;
  overflow-y: scroll;
  background-color: #2b2f45; 
  transition: width 0.3s ease;

  h2 {
    color: #fff;
    padding: 10px;
    border-bottom: 1px solid #4a5470;
    text-align: center;
    margin: 0;
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .Sleft {
    width: 80px;
    &:hover {
      width: 300px;
    }
  }
}

.segment-item {
  padding: 15px;
  margin: 10px;
  background-color: #3c415e;
  border-radius: 8px;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
}

.segment-text {
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  border-radius: 5px;
  gap: 8px;
}

.segment-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin: 10px 0;
}

.status-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #4a5470;
  border-radius: 4px;
}

.status-box {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ffffff;
}

.status-icon {
  width: 18px;
  height: 18px;
}

.status-text {
  font-size: 0.9rem;
}

.hover-tooltip {
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  position: relative;
  top: 10px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.status-stopped {
  background-color: #ff4d4f;
  box-shadow: 0 0 5px #ff4d4f;
}

.status-normal {
  background-color: #52c41a;
  box-shadow: 0 0 5px #52c41a;
}

.status-abnormal {
  background-color: #faad14;
  box-shadow: 0 0 5px #faad14;
}
</style>