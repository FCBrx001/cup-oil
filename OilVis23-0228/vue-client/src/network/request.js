import axios from 'axios'

//方式一
// export function request(config,success,failure){
//     //创建axios的实例
//     const instance=axios.create({
//         baseURL:'http://123.207.32.32:8000',//路径地址
//         timeout:5000
//     })
//     //发送真正的网络请求
//     instance(config).then(res=>{
//         //console.log(res);
//         success(res);//回调函数
//     }).catch(err=>{
//         //console.log(err);
//         failure(err);//回调函数
//     })
// }
//方式二
// export function request(config){
//     return new Promise((resolve,reject)=>{
//         //1、创建axios的实例
//         const instance=axios.create({
//             baseURL:'http://123.207.32.32:8000',
//             timeout:5000
//         })
//         //发送真正的网络请求
//         instance(config)
//             .then(res=>{
//                 console.log("11111");
//                 resolve(res);
//             })
//             .catch(err=>{
//                 reject(err);
//             })
//     })
// }
//方式三
export function request(config){
    //1、创建axios的实例
    const instance=axios.create({
        baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',//路径地址
        timeout:10000
    })
    //2、axios的拦截器
    instance.interceptors.request.use(config=>{
        console.log(config);
        //什么时候需要用到拦截器?
        //1、比如config中的一些信息不符合服务器的要求
        //2、比如每次发送网络请求时，都希望在界面中显示一个请求
        //3、某些网络请求（比如登录(token)），必须携带一些特殊的信息
        return config;//拦截后得还回去
    },err=>{
        console.log(err);
    })
    //2.2响应拦截
    instance.interceptors.response.use(res=>{
        //console.log(res);
        return res.data;
    },err=>{
        //console.log(err);
    })
    //3、发送真正的网络请求
    return instance(config);
}
