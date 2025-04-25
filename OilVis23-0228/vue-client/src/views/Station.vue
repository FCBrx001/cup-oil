<template>
	<div class="StationBox">
		<div class="Sleft">
			<!-- <h1 align="center">管段选择</h1> -->
			<el-menu class="el-menu-vertical-demo" :default-active="activeindex">
				<el-row>
					<el-col>
						<el-menu-item index="1" style="font-size:2rem;" @click="StationHome">全线概览</el-menu-item>
						<el-menu-item index="2" style="font-size:2rem;" @click="StationPage">茂名->阳江</el-menu-item>
						<el-menu-item index="3" style="font-size:2rem;" @click="StationPage1">阳江->恩平</el-menu-item>
						<el-menu-item index="4" style="font-size:2rem;" @click="StationPage2">恩平->鹤山</el-menu-item>
						<el-menu-item index="5" style="font-size:2rem;" @click="StationPage3">鹤山->江门</el-menu-item>
						<el-menu-item index="6" style="font-size:2rem;" @click="StationPage4">江门->高明</el-menu-item>
						<el-menu-item index="7" style="font-size:2rem;" @click="StationPage5">高明->三水</el-menu-item>
						<el-menu-item index="8" style="font-size:2rem;" @click="StationPage6">三水->花都</el-menu-item>
						<el-menu-item index="9" style="font-size:2rem;" @click="StationPage7">三水->南海</el-menu-item>
						<el-menu-item index="10" style="font-size:2rem;" @click="StationPage8">南沙->顺德</el-menu-item>
						<el-menu-item index="11" style="font-size:2rem;" @click="StationPage9">顺德->江门</el-menu-item>
					</el-col>
				</el-row>
			</el-menu>
		</div>
		<router-view></router-view>
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
				activeindex:"1",
				distance: [
                '茂名','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
    '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
    '','','','','','','','','','','','','','阳江','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
    '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
    '','恩平','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','鹤山','','','','','','','','','',
    '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','江门','','','','','','','','','','','','','','','',
    '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','高明','','','','','','','','',
    '','','','','','','','','','','','','','','','','','','三水','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
    '','','','','', '','花都'
            ],
			distancenh: [
                '茂名','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','阳江','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','恩平','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','鹤山','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','江门','','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','高明','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','三水','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','南海'
            ],
            
			}
		},
		mounted(){
			
		},
		watch:{
		},
		methods: {
			StationHome(){
				this.$router.push({
					path:`/home/Station`
				})
			},
			StationPage(){
				let start=0
				let end=102
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'阳江'}`
				})
			},
			StationPage1(){
				let start=102
				let end=184
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'恩平'}`
				})
			},
			StationPage2(){
				let start=184
				let end=219
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'鹤山'}`
				})
			},
			StationPage3(){
				let start=219
				let end=262
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'江门'}`
				})
			},
			StationPage4(){
				let start=262
				let end=317
				console.log(4)
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'高明'}`
				})
			},
			StationPage5(){
				let start=317
				let end=344
				console.log(5)
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'三水'}`
				})
			},
			StationPage6(){
				let start=344
				let end=382
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'花都'}`
				})
			},
			StationPage7(){
				let start=382
				let end=425
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'南海'}`
				})
			},
			StationPage8(){
				let start=425
				let end=48+425
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'南沙'}`
				})
			},
			StationPage9(){
				let start=473
				let end=503
				this.$router.push({
					path:`/home/Station/StationPage/${start}/${end}/${'顺德'}`
				})
			},
		},
		created(){
		},
		beforeDestroy() {
		}, //生命周期 – 销毁之前
	
	}

</script>
<style lang="less">
body {
	margin: 0;
	padding: 0;
}

.el-menu {
	height: 70rem;
	background-color: #000c3b;
	border-right: none;
}

.el-menu.el-menu--horizontal {
	border: none;
}

label {
	text-align: center;
}

.el-submenu__title {
	height: 3rem;
	line-height: 2.5rem;
	font-size: 1.5rem;
}

.el-submenu__title.is-active {
	background: #38B2FF !important;
	color: rgb(0, 0, 0) !important;
}

//设置鼠标悬停时el-submenu的样式
.el-submenu .el-submenu__title:hover {
	background-color: #585eaa !important;
	color: #000000 !important;
}

.el-menu-item {
	color: #ffffff;
	height: 3rem;
	line-height: 2.5rem;
	font-size: 1.5rem;
}

.el-menu-item:hover {
	background-color: #585eaa !important;
	color: #000000 !important;
}

.el-menu-item.is-active {
	background: #38B2FF !important;
	color: #000000 !important;
}
</style>
