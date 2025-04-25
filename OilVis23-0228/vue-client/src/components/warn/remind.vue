<!-- 折线图 -->
<template>
    <div  style="width:100%;height:100%">
        <div :id="elId" style="width:100%;height:100%;float:left">
        </div>
        <!-- <div style="width:25%;height:100%;float:left">
            <el-table
            
            :data="tableData"
            
            :header-cell-style="{fontFamly:'Arial',fontSize:'17px',background:'white',color:'black',height:'60px'}"
            :cell-style="{fontSize:'16px',background:'white',color:'black',height:'73px'}"
            style="width: 100%;">
            <el-table-column
                prop="date"
                label="预计到站时间"
                
                >
            </el-table-column>
            </el-table>
        </div> -->
    </div>
</template>

<script>
"use strict"; 
import uuidv1 from 'uuid/v1'
import * as echarts from 'echarts'
import { eventBus } from '../../main'
  export default {
		name:'batchtrackingoverview',
		data(){
			return{
				/*子组件向父组件传递数据 */
                elId: '',
                times:1,
                num:0,
                dis:{
                    '茂名-阳江':116800,
                    '阳江-恩平':94400,
                    '恩平-鹤山':39900,
                    '鹤山-江门':48600,
                    '江门-高明':64800,
                    '高明-三水':32100,
                    '三水-花都':45700,
                    '三水-南海':52800,
                    '顺德-江门':35800,
                    '南沙-顺德':55100,
                    
                },
                stationname:['阳江','恩平','鹤山','江门','高明','三水','花都','南海','顺德','南沙'],
                stationdis:[116800,94400,39900,48600,64800,32100,45700,52800,35800,55100],
                data0:[0,0,0,0,0,0,0,0,0,0],
                data92:[0,0,0,0,0,0,0,0,0,0],
                data95:[0,0,0,0,0,0,0,0],
                // dataname:['','','','','','','',''],
                // dataColor:['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa'],
                dataColor2:['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa'],
                color:['#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF'],
                data1:[],
                options:{},
                insert_color:[
                    ['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa'],
                    ['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa'],
                    ['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa']
                ],
                raw_color:[['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa'],
                    ['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa'],
                    ['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa']],
                raw_series:[],
                pc_num:[1,1,1,1,1,1,1,1,1]
			}
		},
		created(){
   			this.elId = uuidv1() //获取随机id
            var that =this 
            this.options={
                title: {
                    text: '是否即将到站',
                    subtext: '',
                    textStyle:{
                        color:"white",
                        fontSize:25,
                        fontWeight:600,
                        fontFamily:'Arial',
                        position:[10,10]
                    },
                    top:'5%',
                    left:'75%'
                
                },
                animation:false,
                legend:{
                    orient:'horizontal', 
                    top:'5%',
                    left:'0%',
                    show:true,
                    textStyle:{
                        fontSize:25,
                        fontWeight:600,
                        color:'white'
                    },
                    selectedMode:false,
                    data:[{
                        name:'0#柴油',
                        itemStyle:{
                            color:'#FAC858'
                        }
                    },{
                        name:'92#汽油',
                        itemStyle:{
                            color:'#73C0DE'
                        }
                    },{
                        name:'95#汽油',
                        itemStyle:{
                            color:'#EE6666'
                        }
                    }]
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter:function (params) {
                        let str =   `<div style='display: flex;justify-content: space-between;margin-bottom: 12px'>
                                        <span>${params[0].axisValue}</span>
                                    </div>`;
                        let data,color,name;
                        str += `<p style="display: flex;justify-content: space-between;align-items: center;">`;
                        let sum = 0
                        for(let i=0; i<params.length; i++){
                            let series = params[i];
                            console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", series)
                            if(series.color!='#aaaaaa' && series.data != ""){
                                // console.log(params)
                                // console.log(that.pc_num,params[0].axisValue,data*that.dis[params[0].axisValue]/100000)
                                data = series.value
                                sum += data
                                color = series.color
                                switch(color){
                                    case '#FAC858':
                                        name='0#柴油'
                                        break;
                                    case '#73C0DE':
                                        name='92#汽油'
                                        break;
                                    case '#EE6666':
                                        name='95#汽油'
                                        break;
                                    default:
                                        name = '暂时未检测油品'
                                        break;
                                }
                                if(data*that.dis[params[0].axisValue]/100 >= that.dis[params[0].axisValue]){
                                    str += `<span style="margin-right: 20px">
                                            <span style=\"display:inline-block;margin-right:4px;border-radius:6px;width:6px;height:6px;background-color: ${color};"\></span>
                                            <span >${name}</span>
                                        </span>
                                        <span>已到站</span>
                                    </p>`;
                                }else{
                                    if(i!=that.pc_num[params[0].dataIndex]-1)
                                    {
                                        str += `<span style="margin-right: 20px">
                                                <span style=\"display:inline-block;margin-right:4px;border-radius:6px;width:6px;height:6px;background-color: ${color};"\></span>
                                                <span >${name}</span>
                                            </span>
                                            <span>${"距离上游站场"+(sum*that.dis[params[0].axisValue]/100000).toFixed(1)}</span>
                                            <span> km</span>
                                        </p>`;
                                    }else{
                                        str += `<span style="margin-right: 20px">
                                                <span style=\"display:inline-block;margin-right:4px;border-radius:6px;width:6px;height:6px;background-color: ${color};"\></span>
                                                <span >${name}</span>
                                            </span>
                                            <span>${"距离下游站场"+(data*that.dis[params[0].axisValue]/100000).toFixed(1)}</span>
                                            <span> km</span>
                                        </p>`;
                                    }
                                }
                                
                            }
                        }
                        return str;
                    }
                },
                grid: {
                    left: '3%',
                    right: '30%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: {
                    type:'value',
                    max:100,
                    show: false, //不显示x轴相关信息
                    
                },
                yAxis: [
                    {
                        show: true,
                        type: 'category',
                        data: ['南沙-顺德','顺德-江门','三水-南海','三水-花都','高明-三水','江门-高明','鹤山-江门', '恩平-鹤山', '阳江-恩平', '茂名-阳江'],
                        axisTick: { show: false }, //不显示刻度线
                        axisLabel: {
                            rich: {
                                nt: {
                                    color:"white",
                                    align: 'left',
                                    fontSize:25,
                                    fontWeight:'400',
                                }
                            },
                            formatter: function(value, index) {
                                //console.log(value,index)
                                return  '{img'+index+'|}' +'\n   {nt|' + value+ '}'
                            }
                        },
                        axisLine: {
                            show: false,
                        },
                    },
                
                ],
                series: [
                    {
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','14%'],
                        data: [
                            { value: 1048,itemStyle:{color:this.color[0]} },
                            
                        ],
                        label:false
                    },
                    
                    {
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','22.5%'],
                        data: [
                            { value: 1048,itemStyle:{color:this.color[1]} },
                            
                        ],
                        label:false
                    },

                    {
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','31%'],
                        data: [
                            { value: 1048,itemStyle:{color:this.color[2]} },
                            
                        ],
                        label:false
                    },
                    
                    {
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','39.5%'],
                        data: [
                            { value: 1048,itemStyle:{color:this.color[3]} },
                            
                        ],
                        label:false
                    },
                    
                    {
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','48%'],
                        data: [
                            { value: 1048,itemStyle:{
                                    color:this.color[4]
                                    } 
                                    },
                            
                        ],
                        label:false
                    },
                    
                    {
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','56.5%'],
                        data: [
                            { value: 1048,itemStyle:{color:this.color[5]
                                    }},
                        ],
                        label:false
                    },{
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','65%'],
                        data: [
                            { value: 1048,itemStyle:{
                                    color:this.color[6]
                                    } },
                            
                        ],
                        label:false
                    },{
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','73.5%'],
                        data: [
                            { 
                                value: 1048,
                                itemStyle:{
                                    color:this.color[7]
                                }
                            },
                            
                        ],
                        label:false
                    },{
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','82%'],
                        data: [
                            { value: 1048,itemStyle:{
                                    color:this.color[8]
                                    }},
                        ],
                        label:false
                    },{
                        zlevel: 1.5,
                        animation:false,
                        type: 'pie',
                        radius: '4%',
                        center:['86.5%','90.5%'],
                        data: [{
                            value: 1048,
                            itemStyle:{
                                color:this.color[9]
                            }},
                        ],
                        label:false
                    },{
                    name: '0#柴油',
                    z: 1,
                    yAxisIndex: 0,
                    type: 'bar',
                    stack:'total',
                    data: ['','','','','','','','','',''],
                    showBackground:true,
                    backgroundStyle:{
                        color:"#aaaaaa",
                        borderRadius: 5,
                    },
                    // 修改第一条柱子的圆角
                    itemStyle: {
                        normal: {
                            barBorderRadius:5,
                            color: function(params){
                                return that.insert_color[0][params.dataIndex]
                            },
                        },
                        // color 可以修改柱子的颜色
                        // color:"orange"
                    },
                    // 柱子之间的间距
                    barCategoryGap: 5,
                    // 柱子之间的宽度
                    barWidth: 20,
                    // 显示柱子内的文字
                },{
                    name: '92#汽油',
                    z: 1,
                    yAxisIndex: 0,
                    type: 'bar',
                    stack:'total',
                    data: ['','','','','','','','','',''],
                    showBackground:true,
                    backgroundStyle:{
                        color:"#aaaaaa",
                        borderRadius: 5,
                    },
                    // 修改第一条柱子的圆角
                    itemStyle: {
                        normal: {
                            barBorderRadius:5,
                            color: function(params){
                                return that.insert_color[1][params.dataIndex]
                            }
                        },
                        // color 可以修改柱子的颜色
                        // color:"orange"
                    },
                    // 柱子之间的间距
                    barCategoryGap: 5,
                    // 柱子之间的宽度
                    barWidth: 20,
                    // 显示柱子内的文字
                },{
                    name: '95#汽油',
                    z: 1,
                    yAxisIndex: 0,
                    type: 'bar',
                    stack:'total',
                    data: ['','','','','','','','','',''],
                    showBackground:true,
                    backgroundStyle:{
                        color:"#aaaaaa",
                        borderRadius: 5,
                    },
                    // 修改第一条柱子的圆角
                    itemStyle: {
                        normal: {
                            barBorderRadius:5,
                            color: function(params){
                                return that.insert_color[2][params.dataIndex]
                            }
                        },
                        // color 可以修改柱子的颜色
                        // color:"orange"
                    },
                    // 柱子之间的间距
                    barCategoryGap: 5,
                    // 柱子之间的宽度
                    barWidth: 20,
                    // 显示柱子内的文字
                }],
            }
  		},
		/*只要计算属性，这个function内部，所用到的任何data中的数据发送了变化，就会立即重新计算这个计算属性的值； */
		computed:{
		},
		mounted(){
            this.drawBar(this.elId)
            var that=this
            eventBus.$on('oilDataChange',async result =>{
                // await new Promise((resolve,reject)=>{
                    // this.insert_color=this.raw_color
                    let data1=this.$store.state.paramsData
                    this.pc_num=[1,1,1,1,1,1,1,1,1]
                    let D_s = [data1.STN03_00_DI001A,data1.STN04_00_DI001A,data1.STN05_00_DI001A,data1.STN06_00_DI001A,data1.STN19_00_DI001A,data1.STN20_00_DI001A,data1.STN22_00_DI001A,data1.STN21_00_DI001A,data1.STN06_00_DI303,data1.STN07_00_DI001A]
                    let D_e = [data1.STN02_00_DI002A,data1.STN03_00_DI001A,data1.STN04_00_DI001A,data1.STN05_00_DI001A,data1.STN06_00_DI002A,data1.STN19_00_DI001A,data1.STN20_00_DI001A,data1.STN20_00_DI001A,data1.STN07_00_DI001A,data1.STN08_00_II001]
                    for(let i=0;i<result.length;i++){
                        this.getBardata(result[i],result.length-i-1,D_s[i],D_e[i])
                    }
                    for(let i=0;i<this.insert_color.length;i++){
                        if(!this.options.series[10+i].itemStyle.normal.hasOwnProperty('color')){
                            
                            this.options.series[10+i].itemStyle.normal.color=function(params){
                                return that.insert_color[that.insert_color.length-1][params.dataIndex]
                            }
                        }
                        
                        // this.options.series[10+i].itemStyle
                    }
                    // this.raw_series = this.options.series
                    // this.raw_color = this.insert_color
                    // this.getBardata(result[1],1)
                    // this.getBardata(result[4],2)
                    // this.getBardata(result[5],3)
                    // this.getBardata(result[7],4)
                //    console.log(this.options.series)
                
                    this.charts.setOption(this.options);
                //     resolve()
                // })
                
                
            })
		},
		watch:{
		},
		methods: {
            getBardata(data,index,D_s,D_e){
                var that =this
                var result_data = this.stationdis[9 - index]
                // console.log(data,index,result_data)
                var flag = 0
                result_data -= data.data[0]
                for(let i = data.name.length-1;i>=0;i--){
                    let color = '#aaaaaa'
                    that.pc_num[index]++
                    var data1 
                    if(i!=data.name.length-1){
                        data1 = (data.data[i]-data.data[i+1])/this.stationdis[9-index]*100
                    }else{
                        data1 = data.data[i]/this.stationdis[9-index]*100
                    }
                    switch(data.name[i]){
                        case '0#柴油':
                            color='#FAC858'
                            // this.dataColor[index] =color
                            // this.dataname[index] = '0#柴油'
                            break;
                        case '92#汽油':
                            color='#73C0DE'
                            // this.dataColor[index] = color
                            // this.dataname[index] = '92#汽油'
                            break;
                        case '95#汽油':
                            color='#EE6666'
                            // this.dataColor[index] = color
                            // this.dataname[index] = '95#汽油'
                            break;
                        default:
                            color = '#aaaaaa'
                            break;
                    }
                    if(data.name.length-i >= that.insert_color.length){
                        that.options.series[10+data.name.length-i-1].data[index] = data1
                        that.insert_color[flag][index] = color
                        flag++
                        let insert_data =  JSON.parse(JSON.stringify([ '','','','','','','','','','']));
                        let Insert_Color = JSON.parse(JSON.stringify(['#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa','#aaaaaa']));
                        that.insert_color.push(Insert_Color)
                        let length = that.insert_color.length-1
                       
                        let pipe = {
                            z: 1,
                            name:flag,
                            yAxisIndex: 0,
                            stack:'total',
                            type: 'bar',
                            data: insert_data,
                            showBackground:true,
                            backgroundStyle:{
                                color:"#aaaaaa",
                                borderRadius:5
                            },
                            // 修改第一条柱子的圆角
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 5,
                                    color: function(params){
                                        return Insert_Color[params.dataIndex]
                                    },
                                },
                                // color 可以修改柱子的颜色
                                // color:"orange"
                            },
                            // 柱子之间的间距
                            barCategoryGap: 5,
                            // 柱子之间的宽度
                            barWidth: 20,
                            // 显示柱子内的文字
                        }
                        let objCopy = JSON.parse(JSON.stringify(pipe));
                        that.options.series.push(objCopy)
                    }else{
                        that.options.series[10+data.name.length-i-1].data[index] = data1
                        that.insert_color[flag][index] = color
                        flag++
                        // if(index === 6){
                        //     console.log(that.options.series)
                        // }
                    }
                }
                // console.log(9-index,result_data,this.stationdis[9-index])
                if (result_data == this.stationdis[9-index]){
                    let color
                    if(D_s > 780){
                        color = '#FAC858'
                    }else{
                        if(D_e > 780){
                            color = '#EE6666'
                        }else{
                            color = '#73C0DE'
                        }
                    }
                    // console.log(this.options.series[10+data.name.length])
                    this.options.series[10+data.name.length].data[index] = result_data /this.stationdis[9-index]*100
                    that.insert_color[data.name.length][index] = color
                    this.options.series[9-index].data[0].itemStyle.color = '#aaaaaa'
                }
                else if(result_data > 2000 && result_data != this.stationdis[9-index]){
                    // console.log(index,D_s,D_e)
                    let color
                    if(D_s > 780){
                    color = '#FAC858'
                }else if(data.name[0] == '0#柴油'){
                    color = '#73C0DE'
                    
                }else{
                    if(D_s > 745){
                        color = '#EE6666'
                    }else{
                        color = '#73C0DE'
                    }
                }
                    // console.log(this.options.series[10+data.name.length])
                    this.options.series[10+data.name.length].data[index] = result_data /this.stationdis[9-index]*100
                    that.insert_color[data.name.length][index] = color
                    this.options.series[9-index].data[0].itemStyle.color = '#00FF00'
                }else if(result_data<=2000 && result_data > 0.001){
                    this.options.series[9-index].data[0].itemStyle.color = '#FF0000'
                }else{
                    this.options.series[9-index].data[0].itemStyle.color = '#aaaaaa'
                }
            },
			drawBar(id){
			    if(this.times==1){
				   this.charts = echarts.init(document.getElementById(id));
				   this.times++;
			    }
			    this.charts.clear();
			    this.charts.on("click", this.eConsole);
                var that=this
                this.charts.on('mouseover', function (params) {     
                    alert("111")
                    eventBus.$emit('stop',params)
                })
                this.charts.on('globalout',function(params){
                    eventBus.$emit('start',params)
                })
			},
            
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>

