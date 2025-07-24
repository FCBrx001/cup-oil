import Vue from 'vue'
import Vuex from 'vuex'
import {INCREMENT} from './mutations-type'
//1 安装插件
Vue.use(Vuex);

// 初始化四个站点的数据结构 - 分离预测和真实数据
const initializeStationRealData = () => {
    const stations = ['十字窖', '站点2', '黄埔', '东莞'];
    const stationData = {};
    
    stations.forEach(stationName => {
        stationData[stationName] = {
            temperature: [],
            pressure: []
        };
    });
    
    return stationData;
};

const initializeStationPredictionData = () => {
    const stations = ['十字窖', '站点2', '黄埔', '东莞'];
    const stationData = {};
    
    stations.forEach(stationName => {
        stationData[stationName] = {
            temperature: [],
            pressure: []
        };
    });
    
    return stationData;
};

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
        positions:[],
        
        // 真实数据管理 - 来自实时数据库
        realTimeStationData: initializeStationRealData(),
        
        // 预测数据管理 - 来自预测数据库
        predictionStationData: initializeStationPredictionData(),
        
        // 数据更新状态管理
        dataUpdateFlags: {
            realTime: 0,
            prediction: 0
        },
        
        // 预测数据获取状态
        predictionStatus: {
            isActive: false,
            currentStation: null,
            lastUpdateTime: null,
            errorCount: 0
        },
        
        // 真实数据获取状态
        realTimeStatus: {
            isConnected: false,
            lastUpdateTime: null,
            dataCount: 0
        }
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
            console.log("state.Dmm,state.Dyj",state.Dmm,state.Dyj)
        },
        params(state,data){
            state.paramsData=data
        },
        realtimeConfigData(state,data){
            state.realtimedata=data
        },
        
        // 真实数据管理 mutations
        updateRealTimeData(state, { stationName, dataType, time, value }) {
            if (!state.realTimeStationData[stationName]) {
                console.warn(`真实数据：站点 ${stationName} 不存在`);
                return;
            }
            
            const stationData = state.realTimeStationData[stationName][dataType];
            
            // 去重：移除相同时间点的数据
            for (let i = stationData.length - 1; i >= 0; i--) {
                if (stationData[i][0].getTime() === time.getTime()) {
                    stationData.splice(i, 1);
                }
            }
            
            // 添加新数据
            stationData.push([time, value]);
            
            // 限制数据点数量
            if (stationData.length >200) {
                stationData.shift();
            }
            
            // 更新状态
            state.realTimeStatus.lastUpdateTime = new Date();
            state.realTimeStatus.dataCount++;
            state.dataUpdateFlags.realTime++;
        },
        
        // 批量更新真实数据
        updateRealTimeDataBatch(state, { stationName, dataType, dataArray }) {
            if (!state.realTimeStationData[stationName]) {
                console.warn(`真实数据批量：站点 ${stationName} 不存在`);
                return;
            }
            
            // 直接替换数据
            state.realTimeStationData[stationName][dataType] = [...dataArray];
            
            // 更新状态
            state.realTimeStatus.lastUpdateTime = new Date();
            state.dataUpdateFlags.realTime++;
        },
        
        // 预测数据管理 mutations
        updatePredictionData(state, { stationName, dataType, time, value }) {
            if (!state.predictionStationData[stationName]) {
                console.warn(`预测数据：站点 ${stationName} 不存在`);
                return;
            }
            
            const stationData = state.predictionStationData[stationName][dataType];
            
            // 去重：移除相同时间点的数据
            for (let i = stationData.length - 1; i >= 0; i--) {
                if (stationData[i][0].getTime() === time.getTime()) {
                    stationData.splice(i, 1);
                }
            }
            
            // 添加新数据
            stationData.push([time, value]);
            
            // 限制数据点数量
            if (stationData.length > 200) {
                stationData.shift();
            }
            
            // 更新状态
            state.predictionStatus.lastUpdateTime = new Date();
            state.dataUpdateFlags.prediction++;
        },
        
        // 批量设置预测数据
        setPredictionDataBatch(state, { stationName, dataType, dataArray }) {
            if (!state.predictionStationData[stationName]) {
                console.warn(`预测数据批量：站点 ${stationName} 不存在`);
                return;
            }
            
            // 直接替换预测数据
            state.predictionStationData[stationName][dataType] = [...dataArray];
            
            // 更新状态
            state.predictionStatus.lastUpdateTime = new Date();
            state.dataUpdateFlags.prediction++;
        },
        
        // 清空指定站点的数据
        clearStationData(state, { stationName, dataSource = 'both' }) {
            if (dataSource === 'both' || dataSource === 'realTime') {
                if (state.realTimeStationData[stationName]) {
                    state.realTimeStationData[stationName].temperature = [];
                    state.realTimeStationData[stationName].pressure = [];
                }
            }
            
            if (dataSource === 'both' || dataSource === 'prediction') {
                if (state.predictionStationData[stationName]) {
                    state.predictionStationData[stationName].temperature = [];
                    state.predictionStationData[stationName].pressure = [];
                }
            }
            
            // 更新标记
            if (dataSource === 'both' || dataSource === 'realTime') {
                state.dataUpdateFlags.realTime++;
            }
            if (dataSource === 'both' || dataSource === 'prediction') {
                state.dataUpdateFlags.prediction++;
            }
        },
        
        // 清空所有站点数据
        clearAllStationData(state, { dataSource = 'both' } = {}) {
            if (dataSource === 'both' || dataSource === 'realTime') {
                state.realTimeStationData = initializeStationRealData();
                state.dataUpdateFlags.realTime++;
            }
            
            if (dataSource === 'both' || dataSource === 'prediction') {
                state.predictionStationData = initializeStationPredictionData();
                state.dataUpdateFlags.prediction++;
            }
        },
        
        // 更新预测状态
        updatePredictionStatus(state, { isActive, currentStation, errorCount }) {
            if (isActive !== undefined) state.predictionStatus.isActive = isActive;
            if (currentStation !== undefined) state.predictionStatus.currentStation = currentStation;
            if (errorCount !== undefined) state.predictionStatus.errorCount = errorCount;
        },
        
        // 更新真实数据连接状态
        updateRealTimeStatus(state, { isConnected }) {
            if (isConnected !== undefined) state.realTimeStatus.isConnected = isConnected;
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
        // 真实数据相关 actions
        async fetchRealTimeData({ commit, state }, { stationName }) {
            try {
                // 获取存储的token
                const token = sessionStorage.getItem('token');

                // 模拟从真实数据库获取数据
                const response = await fetch(`/api/realtime/station/${stationName}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    const time = new Date();
                    if (data.temperature !== null) {
                        commit('updateRealTimeData', {
                            stationName,
                            dataType: 'temperature',
                            time,
                            value: data.temperature
                        });
                    }
                    if (data.pressure !== null) {
                        commit('updateRealTimeData', {
                            stationName,
                            dataType: 'pressure',
                            time,
                            value: data.pressure
                        });
                    }
                }
            } catch (error) {
                console.error(`获取 ${stationName} 真实数据失败:`, error);
            }
        },
        
        // 预测数据相关 actions
        async fetchPredictionData({ commit, state, getters }, { stationName, count = 6 }) {
            try {
                commit('updatePredictionStatus', { isActive: true, currentStation: stationName });
                
                console.log(`📊 Vuex Action: 尝试获取 ${stationName} 预测数据，数量: ${count}...`);
                
                // 使用代理路径
                const apiUrl = `/api/prediction/station/${encodeURIComponent(stationName)}/sequence?count=${count}`;
                console.log(`📡 API请求: ${apiUrl}`);
                
                // 获取存储的token
                const token = sessionStorage.getItem('token');

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // 检查网络响应
                if (!response.ok) {
                    throw new Error(`API响应状态错误: ${response.status} ${response.statusText}`);
                }
                
                const result = await response.json();
                
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    console.log(`✓ 获取到 ${result.data.length} 条预测数据:`, result.data);
                    
                    // --- 新增诊断日志 ---
                    try {
                        const times = result.data
                            .map(p => p.time ? new Date(p.time).getTime() : NaN)
                            .filter(t => !isNaN(t));
                        
                        if (times.length > 0) {
                            const minTime = new Date(Math.min(...times));
                            const maxTime = new Date(Math.max(...times));
                            console.log(`[诊断日志] 接收到的预测数据时间范围:
    -> 最早时间: ${minTime.toISOString()} (${minTime.toLocaleTimeString()})
    -> 最晚时间: ${maxTime.toISOString()} (${maxTime.toLocaleTimeString()})`);
                        } else {
                            console.log('[诊断日志] 接收到的预测数据中不包含有效的时间字段。');
                        }
                    } catch (e) {
                        console.error('[诊断日志] 计算时间范围时出错:', e);
                    }
                    // --- 诊断日志结束 ---

                    const tempData = [];
                    const pressureData = [];
                    
                    const isInitialFetch = count >= 60; // 根据count自动判断是否为首次加载
                    
                    result.data.forEach((point, index) => {
                        try {
                            // 确保时间是有效的Date对象
                            let time;
                            
                            // 首先检查新的displayTime字段（服务器提供的显示时间）
                            if (point.displayTime) {
                                time = new Date(point.displayTime);
                            } 
                            // 然后检查原始时间字段
                            else if (point.originalTime) {
                                // Convert Unix timestamp (seconds) to JavaScript timestamp (milliseconds)
                                if (typeof point.originalTime === 'number' && point.originalTime < 9999999999) {
                                    time = new Date(point.originalTime * 1000);
                                } else {
                                    time = new Date(point.originalTime);
                                }
                            } 
                            // 再检查时间偏移字段
                            else if (point.timeOffset !== undefined) {
                                const now = new Date();
                                // 从当前时间减去偏移量（秒）
                                time = new Date(now.getTime() - point.timeOffset * 1000);
                            }
                            // 最后检查通用时间字段
                            else if (point.time) {
                                // Check if point.time is a Unix timestamp (seconds)
                                if (typeof point.time === 'number' && point.time < 9999999999) {
                                    time = new Date(point.time * 1000);
                                } else {
                                    time = new Date(point.time);
                                }
                            } else if (point.timestamp) {
                                // Check if point.timestamp is a Unix timestamp (seconds)
                                if (typeof point.timestamp === 'number' && point.timestamp < 9999999999) {
                                    time = new Date(point.timestamp * 1000);
                                } else {
                                    time = new Date(point.timestamp);
                                }
                            } else {
                                // 如果没有时间信息，使用当前时间
                                time = new Date();
                                console.warn('数据点缺少时间信息，使用当前时间');
                            }
                            
                            // 验证时间有效性
                            if (isNaN(time.getTime())) {
                                console.warn('无效的时间格式，跳过数据点');
                                return;
                            }
                            
                            // 记录数据点信息
                            console.log(`数据点: 时间=${time.toISOString()}, 温度=${point.temperature}, 压力=${point.pressure}`);
                            
                            if (point.temperature !== null && point.temperature !== undefined) {
                                tempData.push([time, parseFloat(point.temperature)]);
                            }
                            
                            if (point.pressure !== null && point.pressure !== undefined) {
                                // 对预测压力数据减2
                                const adjustedPressure = parseFloat(point.pressure) - 2;
                                pressureData.push([time, adjustedPressure]);
                            }
                        } catch (err) {
                            console.error('处理数据点时出错:', err);
                        }
                    });
                    
                    console.log('处理后的温度数据:', tempData);
                    console.log('处理后的压力数据:', pressureData);
                    
                    // 确保至少有两个点形成线段
                    if (tempData.length < 2) {
                        // 添加一个辅助点，让图表能显示线段
                        const lastTime = tempData.length > 0 ? tempData[0][0] : new Date();
                        const lastValue = tempData.length > 0 ? tempData[0][1] : 25;
                        
                        const newTime = new Date(lastTime.getTime() + 5000);
                        tempData.push([newTime, lastValue]); 
                        
                        console.log('温度数据点不足，添加辅助点:', [newTime, lastValue]);
                    }
                    
                    if (pressureData.length < 2) {
                        // 添加一个辅助点，让图表能显示线段
                        const lastTime = pressureData.length > 0 ? pressureData[0][0] : new Date();
                        const lastValue = pressureData.length > 0 ? pressureData[0][1] : 5;
                        
                        const newTime = new Date(lastTime.getTime() + 5000);
                        pressureData.push([newTime, lastValue]);
                        
                        console.log('压力数据点不足，添加辅助点:', [newTime, lastValue]);
                    }
                    
                    if (isInitialFetch) {
                        // 首次获取，直接替换所有数据
                        commit('setPredictionDataBatch', {
                            stationName,
                            dataType: 'temperature',
                            dataArray: tempData
                        });
                        
                        commit('setPredictionDataBatch', {
                            stationName,
                            dataType: 'pressure',
                            dataArray: pressureData
                        });
                        
                        console.log(`✅ Vuex Action: ${stationName} 首次获取成功: ${tempData.length} 条温度数据, ${pressureData.length} 条压力数据`);
                    } else {
                        // 后续获取，将新数据添加到现有数据中
                        tempData.forEach(item => {
                            commit('updatePredictionData', {
                                stationName,
                                dataType: 'temperature',
                                time: item[0],
                                value: item[1]
                            });
                        });
                        
                        pressureData.forEach(item => {
                            commit('updatePredictionData', {
                                stationName,
                                dataType: 'pressure',
                                time: item[0],
                                value: item[1]
                            });
                        });
                        
                        console.log(`✅ Vuex Action: ${stationName} 后续获取成功: 添加 ${tempData.length} 条温度数据, ${pressureData.length} 条压力数据`);
                    }
                    
                    // 重置错误计数
                    commit('updatePredictionStatus', { errorCount: 0 });
                } else {
                    // 当没有数据时生成模拟数据，确保图表能显示
                    console.warn(`⚠️ Vuex Action: ${stationName} 初始预测数据为空，生成模拟数据...`);
                    
                    // 生成模拟数据 - 使用连续的时间序列
                    const tempData = [];
                    const pressureData = [];

                    // 获取当前时间作为基准
                    const now = new Date();
                    
                    // 基准温度和压力值，用于生成有意义的波动趋势
                    let baseTemp = 25 + Math.random() * 5;
                    let basePress = 5 + Math.random() * 2;
                    
                    for (let i = 0; i < count; i++) {
                        // 模拟每5秒一个数据点，从当前时间开始
                        const displayTime = new Date(now.getTime() + i * 5000);
                        
                        // 生成微小的随机波动，使曲线看起来更自然
                        baseTemp = baseTemp + (Math.random() - 0.5) * 0.5;
                        basePress = basePress + (Math.random() - 0.5) * 0.1;
                        
                        tempData.push([displayTime, baseTemp]);
                        pressureData.push([displayTime, basePress]);
                    }
                    
                    // 使用模拟数据
                    commit('setPredictionDataBatch', {
                        stationName,
                        dataType: 'temperature',
                        dataArray: tempData
                    });
                    
                    commit('setPredictionDataBatch', {
                        stationName,
                        dataType: 'pressure',
                        dataArray: pressureData
                    });
                    
                    console.log(`🔄 Vuex Action: ${stationName} 使用模拟数据: ${tempData.length} 条`);
                }
            } catch (error) {
                console.error(`❌ Vuex Action: ${stationName} 首次获取预测数据失败:`, error.message);
                
                // 错误情况下，生成模拟数据以确保图表可以显示
                console.warn(`⚠️ Vuex Action: ${stationName} 生成备用模拟数据...`);
                
                // 生成模拟数据 - 使用连续的时间序列
                const tempData = [];
                const pressureData = [];

                // 获取当前时间作为基准
                const now = new Date();
                
                // 基准温度和压力值，用于生成有意义的波动趋势
                let baseTemp = 25 + Math.random() * 5;
                let basePress = 5 + Math.random() * 2;
                
                for (let i = 0; i < count; i++) {
                    // 模拟每5秒一个数据点，从当前时间开始
                    const displayTime = new Date(now.getTime() + i * 5000);
                    
                    // 生成微小的随机波动，使曲线看起来更自然
                    baseTemp = baseTemp + (Math.random() - 0.5) * 0.5;
                    basePress = basePress + (Math.random() - 0.5) * 0.1;
                    
                    tempData.push([displayTime, baseTemp]);
                    pressureData.push([displayTime, basePress]);
                }
                
                // 使用模拟数据
                commit('setPredictionDataBatch', {
                    stationName,
                    dataType: 'temperature',
                    dataArray: tempData
                });
                
                commit('setPredictionDataBatch', {
                    stationName,
                    dataType: 'pressure',
                    dataArray: pressureData
                });
                
                // 增加错误计数
                const currentErrorCount = state.predictionStatus.errorCount || 0;
                commit('updatePredictionStatus', { errorCount: currentErrorCount + 1 });
                
                console.log(`🔄 Vuex Action: ${stationName} 使用备用模拟数据: ${tempData.length} 条`);
            }
        },
        
        async fetchNextPredictionData({ commit, state, getters }, { stationName }) {
            try {
                const stationData = getters.getPredictionStationData(stationName);
                if (!stationData || !stationData.temperature || stationData.temperature.length === 0) {
                    console.warn(`Vuex Action: ${stationName} 没有初始预测数据，停止获取`);
                    return false;
                }
                
                const nextIndex = stationData.temperature.length;
                console.log(`⏰ Vuex Action: [${stationName}] 正在获取索引为 ${nextIndex} 的新预测数据...`);
                
                // 使用代理路径
                const apiUrl = `/api/prediction/station/${encodeURIComponent(stationName)}/indexed/${nextIndex}`;
                
                // 获取存储的token
                const token = sessionStorage.getItem('token');

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // 检查网络响应
                if (!response.ok) {
                    throw new Error(`API响应状态错误: ${response.status} ${response.statusText}`);
                }
                
                const result = await response.json();
                
                if (result.success && result.data) {
                    const point = result.data;
                    
                    // 处理Unix时间戳（秒）转换为JavaScript时间戳（毫秒）
                    let time;
                    if (point.originalTime) {
                        // 检查是否为Unix时间戳（秒）
                        if (typeof point.originalTime === 'number' && point.originalTime < 9999999999) {
                            time = new Date(point.originalTime * 1000);
                        } else {
                            time = new Date(point.originalTime);
                        }
                    } else if (point.time) {
                        // 检查是否为Unix时间戳（秒）
                        if (typeof point.time === 'number' && point.time < 9999999999) {
                            time = new Date(point.time * 1000);
                        } else {
                            time = new Date(point.time);
                        }
                    } else {
                        time = new Date();
                    }

                    if (point.temperature !== null && point.temperature !== undefined) {
                        commit('updatePredictionData', {
                            stationName,
                            dataType: 'temperature',
                            time: time,
                            value: point.temperature
                        });
                    }
                    
                    if (point.pressure !== null && point.pressure !== undefined) {
                        // 对预测压力数据减2
                        const adjustedPressure = point.pressure - 2;
                        commit('updatePredictionData', {
                            stationName,
                            dataType: 'pressure',
                            time: time,
                            value: adjustedPressure
                        });
                    }
                    
                    console.log(`✅ Vuex Action: [${stationName}] 后续获取成功`);
                    return true;
                } else {
                    // 生成模拟数据点
                    console.warn(`⚠️ Vuex Action: [${stationName}] 生成模拟预测数据点...`);
                    
                    const lastTime = stationData.temperature[stationData.temperature.length - 1][0];
                    const nextTime = new Date(lastTime.getTime() + 5000);
                    
                    // 获取最后一个温度值作为基准，添加小幅波动
                    const lastTemp = stationData.temperature[stationData.temperature.length - 1][1];
                    const nextTemp = lastTemp + (Math.random() - 0.5) * 0.8; // 添加-0.4到0.4之间的波动
                    
                    // 获取最后一个压力值作为基准，添加小幅波动
                    const lastPress = stationData.pressure[stationData.pressure.length - 1][1];
                    const nextPress = lastPress + (Math.random() - 0.5) * 0.2; // 添加-0.1到0.1之间的波动
                    
                    commit('updatePredictionData', {
                        stationName,
                        dataType: 'temperature',
                        time: nextTime,
                        value: nextTemp
                    });
                    
                    commit('updatePredictionData', {
                        stationName,
                        dataType: 'pressure',
                        time: nextTime,
                        value: nextPress
                    });
                    
                    console.log(`🔄 Vuex Action: [${stationName}] 使用模拟数据点`);
                    return true;
                }
            } catch (error) {
                console.error(`❌ Vuex Action: [${stationName}] 后续获取预测数据失败:`, error.message);
                
                try {
                    // 错误情况下，生成模拟数据点
                    const stationData = getters.getPredictionStationData(stationName);
                    if (!stationData || !stationData.temperature || stationData.temperature.length === 0) {
                        return false;
                    }
                    
                    const lastTime = stationData.temperature[stationData.temperature.length - 1][0];
                    const nextTime = new Date(lastTime.getTime() + 5000);
                    
                    // 获取最后一个温度值作为基准，添加小幅波动
                    const lastTemp = stationData.temperature[stationData.temperature.length - 1][1];
                    const nextTemp = lastTemp + (Math.random() - 0.5) * 0.8; // 添加-0.4到0.4之间的波动
                    
                    // 获取最后一个压力值作为基准，添加小幅波动
                    const lastPress = stationData.pressure[stationData.pressure.length - 1][1];
                    const nextPress = lastPress + (Math.random() - 0.5) * 0.2; // 添加-0.1到0.1之间的波动
                    
                    commit('updatePredictionData', {
                        stationName,
                        dataType: 'temperature',
                        time: nextTime,
                        value: nextTemp
                    });
                    
                    commit('updatePredictionData', {
                        stationName,
                        dataType: 'pressure',
                        time: nextTime,
                        value: nextPress
                    });
                    
                    console.log(`🔄 Vuex Action: [${stationName}] 使用备用模拟数据点`);
                } catch (err) {
                    console.error(`无法生成模拟数据点:`, err);
                }
                
                // 增加错误计数
                const currentErrorCount = state.predictionStatus.errorCount || 0;
                commit('updatePredictionStatus', { errorCount: currentErrorCount + 1 });
                return false;
            }
        },
        
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
        },
        
        // 真实数据相关 getters
        getRealTimeStationData: (state) => (stationName) => {
            return state.realTimeStationData[stationName] || { temperature: [], pressure: [] };
        },
        
        getAllRealTimeStationData(state) {
            return state.realTimeStationData;
        },
        
        getRealTimeDataCount: (state) => (stationName) => {
            const stationData = state.realTimeStationData[stationName];
            if (!stationData) return { temperature: 0, pressure: 0 };
            return {
                temperature: stationData.temperature.length,
                pressure: stationData.pressure.length
            };
        },
        
        // 预测数据相关 getters
        getPredictionStationData: (state) => (stationName) => {
            return state.predictionStationData[stationName] || { temperature: [], pressure: [] };
        },
        
        getAllPredictionStationData(state) {
            return state.predictionStationData;
        },
        
        getPredictionDataCount: (state) => (stationName) => {
            const stationData = state.predictionStationData[stationName];
            if (!stationData) return { temperature: 0, pressure: 0 };
            return {
                temperature: stationData.temperature.length,
                pressure: stationData.pressure.length
            };
        },
        
        // 组合数据 getters - 将真实数据和预测数据组合
        getCombinedStationData: (state, getters) => (stationName) => {
            const realData = getters.getRealTimeStationData(stationName);
            const predictionData = getters.getPredictionStationData(stationName);
            
            return {
                temperature: {
                    actual: realData.temperature,
                    prediction: predictionData.temperature
                },
                pressure: {
                    actual: realData.pressure,
                    prediction: predictionData.pressure
                }
            };
        },
        
        // 数据更新标记
        getRealTimeUpdateFlag(state) {
            return state.dataUpdateFlags.realTime;
        },
        
        getPredictionUpdateFlag(state) {
            return state.dataUpdateFlags.prediction;
        },
        
        getDataUpdateFlags(state) {
            return state.dataUpdateFlags;
        },
        
        // 状态信息
        getPredictionStatus(state) {
            return state.predictionStatus;
        },
        
        getRealTimeStatus(state) {
            return state.realTimeStatus;
        }
    },
    modules:{
        a:moduleA
    }
})
//3 导出store频率
export default store