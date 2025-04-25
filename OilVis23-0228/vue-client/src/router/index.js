//配置路由相关的信息
import Vue from 'vue';
import Router from 'vue-router';
import login from '@/views/Login';
import home from '@/views/home'
import roothome from '@/views/roothome'
import GK_Station from '@/views/GK_Station'
import TSYL_Prediction from '@/views/TSYL_Prediction'
import Station from '@/views/Station'
import StationHome from '@/views/StationHome'
import StationPage from '@/views/StationPage'
import OPCConnect from '@/views/OPCConnect'
import PipeCapacityCalculation from '@/views/PipeCapacityCalculation'
import mm_Page from '../components/GK_Page/mm_page.vue'
import yj_Page from '../components/GK_Page/yj_page.vue'
import ep_Page from '../components/GK_Page/ep_page.vue'
import hs_Page from '../components/GK_Page/hs_page.vue'
import jm_Page from '../components/GK_Page/jm_page.vue'
import ss_Page from '../components/GK_Page/ss_page.vue'
import hd_Page from '../components/GK_Page/hd_page.vue'
import nh_Page from '../components/GK_Page/nh_page.vue'
import gm_Page from '../components/GK_Page/gm_page.vue'
import mmyj_Page from '../components/PP_Page/mmyj_Page';
//添加test_chart路由
import test_chart from '@/views/test_chart'
// import jtslOptimize from '@/views/JTSL'
//1.通过Vue.use()插件，安装插件
Vue.use(Router)
//2.创建router对象
/*const routes=[]
const router=new Router({
  routes
})
export default router
//3.将router对象传入Vue实例
*/
const originalPush = Router.prototype.push
//修改原型对象中的push方法
  Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  //配置路由和组件之间的对应关系
  routes: [
    {
      path:'/',
      name:'home',
      redirect:'/home'
    },
    {
    	path: '/login',
    	component: login,
      meta:{
        title:'登录页面'
      },
    },
    {
    	path: '/home',
    	component: home,
      meta: { requiresAuth: true }, // 添加meta属性标识需要认证
      children:[{
        path:'/',
        name:'roothome',
        component:roothome,
        meta:{
          title:'成品油智能检测-首页'
        }
      },
      {
        path:'GK_Station',
        name:'GK_Station',
        component:GK_Station,
        meta:{
          title:'工况警告-茂名站'
        },
        children:[{
          path:'/',
          name:'mm_page',
          component:mm_Page,
          meta:{
            title:'工况警告-茂名站'
          },
        },{
          path:'yj_page',
          name:'yj_page',
          component:yj_Page,
          meta:{
            title:'工况警告-阳江站'
          },
        },{
          path:'ep_page',
          name:'ep_page',
          component:ep_Page,
          meta:{
            title:'工况警告-恩平站'
          },
        },{
          path:'hs_page',
          name:'hs_page',
          component:hs_Page,
          meta:{
            title:'工况警告-鹤山站'
          },
        },{
          path:'jm_page',
          name:'jm_page',
          component:jm_Page,
          meta:{
            title:'工况警告-江门站'
          },
        },{
          path:'gm_page',
          name:'gm_page',
          component:gm_Page,
          meta:{
            title:'工况警告-高明站'
          },
        },{
          path:'ss_page',
          name:'ss_page',
          component:ss_Page,
          meta:{
            title:'工况警告-三水站'
          },
        },{
          path:'hd_page',
          name:'hd_page',
          component:hd_Page,
          meta:{
            title:'工况警告-花都站'
          },
        },{
          path:'nh_page',
          name:'nh_page',
          component:nh_Page,
          meta:{
            title:'工况警告-南海站'
          },
        }]
      },
      {
        path:'TSYL_Prediction',
        name:'TSYL_Prediction',
        component:TSYL_Prediction,
        meta:{
          title:'茂名-阳江管段压力预警'
        },
        children:[{
          path:'/',
          name:'mmyj_page',
          component:mmyj_Page,
          meta:{
            title:'茂名-阳江管段压力预警'
          },
        }]
      },
      {
        path:'Station',
        component:Station,
        children:[{
          path:'/',
          name:'StationHome',
          component:StationHome,
          meta:{
            title:'批次水力-全线'
          },
        },{
          path:'StationPage/:start/:end/:station',
          name:'StationPage',
          component:StationPage,
          meta:{
            title:'批次水力-管段'
          },
        },]
      },
      {
        path:'pipe-capacity',
        name:'PipeCapacityCalculation',
        component:PipeCapacityCalculation,
        meta:{
          title:'石油停输管容量计算'
        }
      },
      {
        path:'test_chart',
        name:'test_chart',
        component:test_chart,
        meta:{
          title:'测试图表'
        }
      }
    ]
    }
  ],

  mode:'history',//默认hash模式
  LinkActiveClass:'active',
  //获取原型对象上的push函数
  
})
// 全局前置守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = sessionStorage.getItem('token');
  if (requiresAuth && !isAuthenticated) {
    next({ path: '/login' });
  } else {
    document.title = to.meta.title || '默认标题'; // 设置页面标题
    next();
  }
});

export default router;