// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import dashboard from './views/dashboard'
// import jtslOptimize from './views/JTSL'
import 'jquery'
import './utils/jquery.sparkline'
import './utils/jquery.sparkline.min'
import App from './App.vue'
import router from './router'// 自动导入router文件夹下的index文件
import store from './store'

// import * as echarts from 'echarts'
// Vue.prototype.$echarts = echarts

// step1：引入 axios
import Axios from 'axios'
// step3：使每次请求都会带一个 /api 前缀
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import {VueJsonp} from 'vue-jsonp'
Vue.use(VueJsonp)
import {
  QWebChannel
} from './qwebchannel.js'
// Vue.prototype.$store=store
// 使用封装的request模块
// import {request} from './network/request.js'
import '@/assets/theme/common.css'
import '@/assets/theme/home.css'
import '@/assets/theme/animation.css'
import '@/assets/theme/teststation.css'
import '@/assets/theme/station.css'
import '@/assets/theme/jianlisw.css'
import '@/assets/theme/jianlixt.css'
import '@/assets/theme/public.css'
import axios from 'axios'

router.beforeEach((to,from,next)=>{
  if(to.meta.title){
    document.title = to.meta.title
  }
  next()
})
// step2：把axios挂载到vue的原型中，在vue中每个组件都可以使用axios发送请求,
// 不需要每次都 import一下 axios了，直接使用 $axios 即可
Vue.prototype.$axios = Axios;
Axios.defaults.baseURL='/api'

// 添加请求拦截器，自动添加token（除了登录和验证码接口）
Axios.interceptors.request.use(config => {
  // 排除不需要token的接口
  const excludeUrls = ['/Judge/login', '/Judge/check', '/hpdg/']
  const needsToken = !excludeUrls.some(url => config.url.includes(url))

  if (needsToken) {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})
Vue.use(ElementUI)
Vue.config.productionTip = false
// import { render } from 'node-sass'
// 方式一
// request({
//   url:'/home/multidata'
// },res=>{
//   console.log(res);
// },err=>{
//   console.log(err);
// })
// 方式二、三
// request({
//   url:'/home/multidata'
// }).then(res=>{
//   console.log(res);
// }).catch(err=>{
//   console.log(err);
// })
/* eslint-disable no-new */

export const eventBus = new Vue()

new Vue({
  el: '#app1', // index.html
  router, // 将router对象挂载到Vue实例
  store,
  render: h => h(App)
  // components: { dashboard},
  // template: '<dashboard/>'//如果el与template同时存在，vue会将template中的内容复制到el即app1当中
})
// 依赖less文件，在webpack.base.conf.js中进行loader配置，（测试）
// require('./assets/theme/test.less')
