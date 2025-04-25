<template>
    <div> 
        <div :id="elid" :style="{'width':chartWidth+'px','height':chartHeight+'px'}">  
        </div>
    </div>
</template>


<script>
    import uuidv1 from 'uuid/v1'
    import * as echarts from 'echarts'
    //import {MessageBox} from 'element-ui'
    
    import { requireFileAsExpression } from 'webpack/lib/ParserHelpers'

    export default{
        name: "App",
        data(){
            return {

                chartWidth:800,
                chartHeight:560,
                // 图标坐标，预先调好每个点的坐标
                nodes:[{
                    x: 450,
                    y: 600,
                    nodeName: 'A',
                    svgPath: require("./Images/nanhai.png"),
                    symbolSize: [600,300],
                    position: 'inside'
                }
                ],
                // 描线，根据一组的点来描线
                chartsdata: {
                    nodes: [],
                    
                }, 
                data:[
                        { value: 40, name: '茂名站' },
                        { value: 38, name: '阳江站' },
                        { value: 32, name: '恩平站' },
                        { value: 30, name: '鹤山站' },
                        { value: 28, name: '江门站' },
                        { value: 26, name: '高明站' },
                        { value: 30, name: '三水站' },
                        { value: 22, name: '花都站' }
                        ],
                elid:'',
            }
        },
        mounted(){
            //this.drawchart()
            //注意写法!!!
            this.initchart()
            this.loadchart()
            window.onresize = ()=>{
                console.log('123')
                this.charts.resize()
            }
        },
        
        created(){
            this.elid = uuidv1() //获取随机id
        },
        methods: {
            initchart(){
                // 把描点加入charts数组里面
                var length = this.nodes.length;
                console.log('nodes的长度',length);
                for (var j = 0; j < length; j++) {
                    const {
                        x,
                        y,
                        nodeName,
                        svgPath,
                        symbolSize,
                        position
                    } = this.nodes[j];
                    var node = {
                        nodeName,
                        value: [x, y],
                        symbolSize: symbolSize || 50,
                        symbol: 'image://' + svgPath,
                        itemStyle: {
                            color: '#b2b2b2',
                        },
                        label: {
                            position: position
                        }
                    }
                    this.chartsdata.nodes.push(node)
                }
            },
            loadchart(){
                console.log('工艺数据：',this.chartsdata.nodes);
                
                this.charts = echarts.init(document.getElementById(this.elid),'dark');
                //this.charts.clear();
                this.charts.setOption({
                    backgroundColor: "transparent",
                    xAxis: {
                        min: 0,
                        max: 1000,
                        show: false,
                        type: 'value'
                    },
                    yAxis: {
                        min: 0,
                        max: 1000,
                        show: false,
                        type: 'value'
                    },
                    series: [{
                        
                        type: 'graph',  // 描点
                        coordinateSystem: 'cartesian2d',
                        // label: {
                        //     show: true,
                        //     // position: 'left',
                        //     color: '#79B6FF',
                        //     fontSize: 10,
                        //     formatter: function (item) {
                        //         return item.data.nodeName
                        //     }
                        // },
                        data: this.chartsdata.nodes,
                        silent: true
                    }, {
                        
                        type: 'lines',  // 描线
                        polyline: true,
                        coordinateSystem: 'cartesian2d',
                        lineStyle: {
                        type: 'solid',
                        width: 2,
                        color: '#2950F1',
                        curveness: 0.8
                        },
                        effect: {
                        show: true,
                        trailLength: 0.6,
                        symbol: 'arrow',  // 箭头动画效果
                        color: '#ffffff',
                        period: 8,
                        symbolSize: 4,
                        constantSpeed: 50,  // 固定速度
                        },
                        data: this.chartsdata.linesData
                    }]
                })
                this.charts.on('click',{seriesType: 'graph',name:"AA"},function(){
                    console.log('参数输出：AA')
                })
                this.charts.on('click',{seriesType: 'graph',name:"BB"},function(){
                    console.log('参数输出：BB')
                })
                this.charts.on('click',{element: 'CC'},function(){
                    console.log('参数输出：CC')
                })
            }
            
        }
    }
</script>
