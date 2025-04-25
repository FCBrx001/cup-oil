<template>
    <div> 
        <div :id="elid" :style="{width:'100%','height':chartHeight+'px'}">  
        </div>
    </div>
</template>


<script>
    import uuidv1 from 'uuid/v1'
    import * as echarts from 'echarts'
    import { eventBus } from '../../main';
    import {MessageBox} from 'element-ui'

    export default{
        name: "App",
        data(){
            return {

                chartWidth:500,
                chartHeight:500,

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
            this.drawchart()
        },
        
        created(){
            this.elid = uuidv1() //获取随机id
        },
        methods: {
            drawchart(){
                this.charts = echarts.init(document.getElementById(this.elid));
                this.charts.clear();
                this.charts.setOption({
                    tooltip: {
                        // trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                        }
                    },
                    series: [
                        {
                        name: '工况统计',
                        type: 'pie',
                        radius: [10, 130],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        emphasis: {
                            label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                            }
                        },
                        data: this.data
                        }
                    ]
                })
            }
            
        }
    }
</script>
