<template>
    <div id="app">
        起始点：
        <el-input 
        id="start"
        placeholder="请输入起始点"
        size="small"
        v-model="start"
        style="width: 150px">
        </el-input>
        终止点：
        <el-input
        id="finish"
        size="small"
        v-model="finish"
        placeholder="请输入终止点"
        style="width: 150px"
        >
        </el-input>
        <el-button @click="DDA">执行</el-button>
        <div :id="elid" :style="{'width':chartWidth+'px','height':chartHeight+'px'}">  
        </div>
    </div>
</template>


<script>
    import uuidv1 from 'uuid/v1'
    import * as echarts from 'echarts'
    export default{
        name: "App",
        data(){
            return {
                chartWidth:1200,
                chartHeight:500,
                data:'',
                datas:'',
                elid:'',
                flag:'',
                start: '',
                finish: ''
            }
        },
        created(){
            this.elid = uuidv1() //获取随机id
        },
        methods: {
            DDA: function(){
                var starts = this.start.split(" ");
                var finishs = this.finish.split(" ");
                var datasource = this.dd(starts[0],finishs[0], starts[1],finishs[1]);
                this.drawchart(starts,finishs,datasource); 
            },
            drawchart(start, finish, datasourse){
                this.charts = echarts.init(document.getElementById(this.elid));
                this.charts.clear();
			    this.charts.on("click", this.eConsole);
			    this.charts.setOption({
                    dataset: [{      
                        source: datasourse
                    }],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    xAxis: {
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    yAxis: {
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    series: [{
                        name: 'scatter',
                        type: 'scatter',
                        datasetIndex: 0
                    },
                    {
                        name: 'line',
                        type: 'line',
                        smooth: true,
                        data: [start,finish]
                    }]
                },true);
            },
            dd(x, x1, y, y1){
                this.datas = new Array();
                this.datas.push([x,y]);
                var m = (y1 - y) / (x1 - x);
                var k = y1 - m * x1;
                var Y,X;
                if(m<=1){
                    this.flag= m * x + k;
                    for(;x<x1;x++,this.flag+=m){
                        Y = Math.round(this.flag);
                        this.datas.push([x,Y]);
                    }
                }
                else{
                    this.flag= (y - k) / m;
                    for(;y<y1;y++,this.flag+=1/m){
                        X = Math.round(this.flag);
                        this.datas.push([X,y]);
                    }
                }
                this.datas.push([x1,y1]);
                return this.datas;
            }
        }
    }
</script>
