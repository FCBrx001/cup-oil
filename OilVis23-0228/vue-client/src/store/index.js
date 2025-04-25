import Vue from 'vue'
import Vuex from 'vuex'
import {INCREMENT} from './mutations-type'
//1 安装插件
Vue.use(Vuex);
//2 创建对象
const moduleA={
    state:{
        name:'yangjingshu'
    },
    mutations:{

    },
    actions:{

    },
    getters:{

    }
}
const store=new Vuex.Store({
    state:{
        /*凡是一开始就定义在state中的属性（即提前在state中初始化的属性），都会被加入到响应式系统中，而响应式系统会监听属性的变化，
        当属性发生变化时，会通知所有用到该属性的地方，让其界面刷新。 
        */
        Dmm:{},
        Dyj:{},
        Dep:{},
        Dhs:{},
        Dgm:{},
        realtimedata:{},
        paramsData:{},
        positions:[]
    },
    /*在通过mutation更新数据的时候，我们有时候会希望携带一些额外的参数
    参数被称为是mutation的载荷（payload）
    如果需要传递多个参数，通常会以对象的形式传递，也就是payload是一个对象，这个时候可以再从对象中取出相关的信息 */
    /*不要在mutation中进行异步操作 */
    mutations:{
        positions(state,data){
            state.positions=data
        },
        oilDataChange(state,data){
            state.Dmm=data[0]
            state.Dyj=data[1]
            state.Dep=data[0]
            state.Dhs=data[1]
            console.log(state.Dmm,state.Dyj)
        },
        params(state,data){
            state.paramsData=data
        },
        realtimeConfigData(state,data){
            state.realtimedata=data
        },
        //方法,修改state对象里的参数
        parallelTitle(state,title){
            state.parallelTitle=title;
            //Vue.set(state.parallelTitle,title);
            console.log("22:",state.parallelTitle);
        },
        increment(state){//定义一个函数increment
            //在mutations中进行异步操作可以改变状态，但是无法进行状态跟踪，所以异步操作只能通过actions进行
            // setTimeout(() => {
            //     state.counter++;
            // }, 10000); 

            state.counter++;
        },
        /*['INCREMENT'](state){//定义一个函数INCREMENT
            state.counter++;
        },*/
        /*[INCREMENT](state){//使用导入的一个函数INCREMENT
            state.counter++;
        },*/
        decrement(state){
            state.counter--;
        },
        //mutation第一种提交风格
        incrementCount(state,count){
            state.counter2+=count;
        },
        updateInfo(state,name){
            /*通常情况下，vuex要求我们使用Mutations中的方法必须是同步方法
            主要的原因时当我们使用devtools时，devtools可以帮助我们捕捉mutation的快照
            但是如果是异步操作，那么devtools将不能很好的追踪这个操作什么时候会被完成。
             */
            // setTimeout(()=>{
            //     state.info.name=name
            // },1000)
            state.info.name=name
           // state.info['address']='洛杉矶';//该方式做不到新增属性的响应式
           // Vue.set(state.info,'address','洛杉矶');//可以响应
            //delete state.info.age //不是响应式
            //Vue.delete(state.info,'age');//可以响应
        },
        addStudent(state,stu){
            state.students.push(stu)
        }
        //mutation第二种提交风格
        // incrementCount(state,payload){
        //     state.counter+=payload.count;
        // },
        // linewidth(state){
        //     state.chartWidth=chartWidth;
        // }
    },
    /*action类似于mutation,但是是用来代替mutation进行异步操作的*/
    actions:{
        aUpdateInfo(context,payload){
            //错误代码：想要修改state必须通过mutation，否则无法跟踪状态改变
            // setTimeout(() => {
            //     context.state.info.name='codewhy'
            // }, 1000);
        //1
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                context.commit('updateInfo',payload);
                console.log(payload);
                resolve('11111');
            }, 1000);
        })
        //3
        // setTimeout(()=>{
        //     context.commit('updateInfo');
        //     console.log(payload.message);
        //     payload.success()
        // },1000)
         }
    },
    /*有时候，我们需要从store中获取一些state变异之后的状态，需要用getters */
    getters:{
        paralleltitle(state){
            return state.parallelTitle;
        },
        powerCounter(state){
            return state.counter*state.counter;
        },
        stuAgeover24(state){
            return state.students.filter(S=>S.age>24)
        },
        stuAgeover24Num(state,getters){//此处的第二个参数getters不论命名为什么，实际上都是getters
            return getters.stuAgeover24.length;
        },
        stuAgeover(state){
            return function(age){
                return state.students.filter(S=>S.age>age)
            }
        }
    },
    modules:{
        a:moduleA
    }
})
//3 导出store频率
export default store