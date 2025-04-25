<template>
    <div class="page">
        <div class="head">
            <div class="head_title">
                <img src="../assets/img/title-left.png" style="margin-top:.5rem;">
                <!-- <span style="font-size:3rem;margin:0px;text-align:center;">管道工况智能监测系统</span> -->
                <span style="font-size:3rem;margin:0px;text-align:center;">成品油管道水力计算软件</span>
                <img src="../assets/img/title-right.png" style="margin-top:.5rem">
            </div>
        </div>
        <div class="header">
            <div class="left nav" style="background:#585eaa;display:inline-block">
            </div>
            <div class="header_center">
                <el-menu mode="horizontal" background-color="transparent" text-color="rgba(255,255,255,0.8)"
                    active-text-color="#1a9bfc" style="height:4rem;" class="custom-menu">
                    <el-menu-item index="home" @click="homeClick">
                        <span class="menu-item-text">首页</span>
                    </el-menu-item>
                    <el-menu-item index="home/Station" @click="Station">
                        <span class="menu-item-text">批次水力</span>
                    </el-menu-item>
                    <el-menu-item index="home/GK_Station" @click="testLogin">
                        <span class="menu-item-text">工况警告</span>
                    </el-menu-item>
                    <el-menu-item index="home/TSYL_Prediction" @click="TSYL_Prediction">
                        <span class="menu-item-text">停输压降</span>
                    </el-menu-item>
                    <el-menu-item index="home/pipe-capacity" @click="pipeCapacity">
                        <span class="menu-item-text">停输管容量</span>
                    </el-menu-item>
                    <el-menu-item index="home/test_chart" @click="testChart">
                        <span class="menu-item-text">单元测试</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="right nav" style="background:#585eaa">
                <el-button type="primary" icon="el-icon-right" style="font-size: 20px;margin-top: 7px;margin-left: 75%;"
                    @click="LoginOut">退出</el-button>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
import batchtracking from '../components/OilbatchTracking/batchtracking.vue'
import { eventBus } from '../main';

export default {
    name: 'Diagram',
    components: {
        'batchtracking': batchtracking,
    },
    data() {
        return {
            //批次跟踪数据库表名
            tableId: 0,
            tablename: ['mm-yj', 'yj-ep', 'ep-hs', 'hs-jm', 'gg-ss'],
            oildata: [],//5个地理区间数据
            num: 0,
            datamm: [],
            datayj: [],
            dataep: [],
            datahs: [],
            datagm: [],
            data1: [],
            disyj: [],
            disep: [],
            dishs: [],
            disgm: [],
            Dmm: {},
            Dyj: {},
            Dep: {},
            Dhs: {},
            Dgm: {},
            activeMenuIndex: ''
        }
    },
    created() {
        this.$axios({
            method: 'get',
            url: '/opc/conItems',
        }).then(res => {
            console.log("开始采集数据")
        })
    },
    mounted() {
        // 初始化时设置当前路由对应的菜单激活状态
        this.activeMenuIndex = this.$route.name;
    },
    watch: {
        $route: {
            immediate: true,
            handler(newRoute) {
                this.activeMenuIndex = newRoute.name;
            }
        }
    },
    methods: {
        homeClick() {
            this.$router.push('/home');
            this.activeMenuIndex = 'home';
        },
        testLogin() {
            this.$router.push('/home/GK_Station');
            this.activeMenuIndex = 'home/GK_Station';
        },
        Station() {
            this.$router.push('/home/Station');
            this.activeMenuIndex = 'home/Station';
        },
        TSYL_Prediction() {
            this.$router.push('/home/TSYL_Prediction');
            this.activeMenuIndex = 'home/TSYL_Prediction';
        },
        pipeCapacity() {
            this.$router.push('/home/pipe-capacity');
            this.activeMenuIndex = 'home/pipe-capacity';
        },
        testChart() {
            this.$router.push('/home/test_chart');
            this.activeMenuIndex = 'home/test_chart';
        },
        LoginOut() {
            const h = this.$createElement;
            this.$msgbox({
                title: '退出登录',
                message: h('p', null, [
                    h('span', null, '您确定要退出登录吗？ '),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中...';
                        setTimeout(() => {
                            sessionStorage.removeItem('token');
                            sessionStorage.removeItem('user');  // 如果有存储用户信息，可以同时清除
                            done();
                            setTimeout(() => {
                                instance.confirmButtonLoading = false;
                                this.$router.push('/login');
                            }, 300);
                        }, 1500);
                    } else {
                        done();
                    }
                }
            }).then(action => {
                this.$message({
                    type: 'info',
                    message: '退出成功！'
                });
            });
        }
    },
    beforeDestroy() {
        // 页面销毁后同时清除定时器，避免占用内存
        // clearInterval(this.timer)
        // this.timer=null;
        // this.ws.close()
    }, //生命周期 – 销毁之前
}
</script>
<style lang="less">
/* 添加在样式文件的开头 */
/* 防止浏览器自动填充样式影响 */
button:-webkit-autofill,
button:-webkit-autofill:hover,
button:-webkit-autofill:focus,
button:-webkit-autofill:active {
    -webkit-transition-delay: 9999s;
    transition-delay: 9999s;
    -webkit-transition: color 9999s ease-out, background-color 9999s ease-out;
    transition: color 9999s ease-out, background-color 9999s ease-out;
}

.el-button {

    &:focus,
    &:visited,
    &:active,
    &:-webkit-autofill {
        background-color: inherit !important;
        color: inherit !important;
    }
}

/* 确保菜单项样式不受影响 */
.custom-menu .el-menu-item {

    &:focus,
    &:visited,
    &:active,
    &:-webkit-autofill {
        background-color: transparent !important;
    }

    &.is-active {
        background-color: rgba(255, 255, 255, 0.15) !important;
        color: #1a9bfc !important;
    }
}

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

.router-link-active {
    color: aqua
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
}

//设置鼠标悬停时el-submenu的样式
.el-submenu .el-submenu__title:hover {
    background-color: #585eaa !important;
    color: #38B2FF !important;
}

.el-menu-item {
    height: 3rem;
    line-height: 2.5rem;
    font-size: 1.5rem;
}

.el-menu-item:hover {
    background-color: #585eaa !important;
    color: #38B2FF !important;
}

.el-menu-item.is-active {
    background: #38B2FF !important;
}

/* 添加新的样式 */
.header_center {
    height: 100%;
    display: flex;
    background-color: #585eaa;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0rem;
}

.custom-menu {
    border-bottom: none !important;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.custom-menu .el-menu-item {
    height: 100%;
    line-height: 3.5rem;
    padding: 0 2rem;
    margin: 0 0.5rem;
    font-size: 1.4rem;
    font-weight: 500;
    position: relative;
    transition: all 0.3s ease;
}

.custom-menu .el-menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: #CDCDB4 !important;
}

.custom-menu .el-menu-item.is-active {
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: #CDCDB4 !important;
}

.home:hover {
    background-color: #00CDCD !important;
    color: #fff !important;
}

.home.is-active {
    background-color: #00CDCD !important;
    color: #fff !important;
}

.custom-menu .el-menu-item.is-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #1a9bfc;
    border-radius: 2px;
}

.menu-item-text {
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
    font-weight: 600;
}

.custom-menu .el-menu-item:hover .menu-item-text {
    transform: translateY(-2px);
    text-shadow: 0 0 10px rgba(26, 155, 252, 0.3);
}

/* 添加菜单项的图标动画效果 */
.custom-menu .el-menu-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(78, 205, 196, 0.1), rgba(26, 155, 252, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
}

.custom-menu .el-menu-item:hover::before {
    opacity: 1;
}

/* 添加菜单项的悬浮阴影效果 */
.custom-menu .el-menu-item {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin: 0 0.5rem;
}

/* 优化菜单项的间距 */
.custom-menu .el-menu-item:not(:last-child) {
    margin-right: 1rem;
}
</style>