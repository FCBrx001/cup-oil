<template>
	<div class="StationBox">
		<div class="Sleft">
            <h1 align="center">站点选择</h1>
                <el-menu
                class="el-menu-vertical-demo"
				default-active="1"
                >
                    <el-row>
                        <el-col>
                            <el-menu-item index="1" @click="mmPage">茂名</el-menu-item>
                            <el-menu-item index="2" @click="yjPage">阳江</el-menu-item>
                            <el-menu-item index="3" @click="epPage">恩平</el-menu-item>
                            <el-menu-item index="4" @click="hsPage">鹤山</el-menu-item>
							<el-menu-item index="5" @click="jmPage">江门</el-menu-item>
							<el-menu-item index="6" @click="gmPage">高明</el-menu-item>
							<el-menu-item index="7" @click="ssPage">三水</el-menu-item>
							<el-menu-item index="8" @click="hdPage">花都</el-menu-item>
							<el-menu-item index="9" @click="nhPage">南海</el-menu-item>
                        </el-col>
                    </el-row>
                </el-menu>
        </div>
		<keep-alive>
		<router-view></router-view>
		</keep-alive>
	</div>
</template>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>

	import { eventBus } from '../main';
	export default {
		name: 'Diagram',
	    components: {
	    },
		data() {
			 return {
			 }
		},
		mounted(){
			this.gkdata()
		},
		watch:{
		},
		methods: {
			gkdata(){
				if (window.WebSocket) {
                    if(!this.ws){
						// this.ws = new WebSocket('ws://10.120.221.37:3001'); //宿舍
						// this.ws = new WebSocket('ws://192.168.1.103:3001'); //实验室
                        this.ws = new WebSocket('ws://127.0.0.1:3012');
                        this.ws.onopen = function () {
                            console.log('连接服务器成功')
                            // this.ws.socket.send('你好服务器')
                        }
                        this.ws.onmessage = function (e) {
							//console.log(typeof(e.data))
							var edata = Object.values(JSON.parse(e.data))
							//console.log('websocket返回数据',JSON.parse(e.data))
							//console.log('类型：',Object.values(edata))
							//console.log('mm_datawarn数据',edata[0][0].datetime)
							

                            eventBus.$emit('mm_datawarn',edata[0][0])
							eventBus.$emit('yj_datawarn',edata[1][0])
							eventBus.$emit('ep_datawarn',edata[2][0])
							eventBus.$emit('hs_datawarn',edata[3][0])
							eventBus.$emit('jm_datawarn',edata[4][0])
							eventBus.$emit('gm_datawarn',edata[5][0])
							eventBus.$emit('ss_datawarn',edata[6][0])
							eventBus.$emit('hd_datawarn',edata[7][0])
							eventBus.$emit('nh_datawarn',edata[8][0])
                        }
                        this.ws.onclose = function () {
                            console.log('连接已关闭')
                        }
                    }else {
                        alert("连接已建立")
                    }
				}
			},
			mmPage(){
				this.$router.push( '/home/GK_Station' )
			},
			yjPage(){
				this.$router.push( '/home/GK_Station/yj_Page' )
			},
			epPage(){
				this.$router.push( '/home/GK_Station/ep_Page' )
			},
			hsPage(){
				this.$router.push( '/home/GK_Station/hs_Page' )
			},
			jmPage(){
				this.$router.push( '/home/GK_Station/jm_Page' )
			},
			gmPage(){
				this.$router.push( '/home/GK_Station/gm_Page' )
			},
			ssPage(){
				this.$router.push( '/home/GK_Station/ss_Page' )
			},
			hdPage(){
				this.$router.push( '/home/GK_Station/hd_Page' )
			},
			nhPage(){
				this.$router.push( '/home/GK_Station/nh_Page' )
			}
		},
		created(){
		},
		beforeDestroy() {
			this.ws.close();
			this.ws=null
			console.log("关闭连接");
			next();
			eventBus.$off()
		}, //生命周期 – 销毁之前
	
	}

</script>
<style lang="less">
body {
    margin: 0;
    padding: 0;
}
.el-menu{
	height:70rem;
	background-color: #000c3b;
	border-right: none;
}
.el-menu.el-menu--horizontal{
  border: none;
}
label {
  text-align: center;
}
.el-submenu__title{
	height: 3rem;
	line-height: 2.5rem;
	font-size: 1.5rem;
}
.el-submenu__title.is-active {
  background: #38B2FF !important;
  color: rgb(0, 0, 0) !important;
}
//设置鼠标悬停时el-submenu的样式
.el-submenu .el-submenu__title:hover{
    background-color: #585eaa !important;
    color: #000000 !important;  
}
.el-menu-item {
	color:#fff;
	height: 3rem;
	line-height: 2.5rem;
	font-size: 1.5rem;
}
.el-menu-item:hover{
	background-color: #585eaa !important;
    color: #000000 !important;  
}
.el-menu-item.is-active{
	background: #38B2FF !important;
	color:#000000 !important;
}
</style>
