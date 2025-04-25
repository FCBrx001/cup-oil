<template>
    <div  style="width:100%;height:100%">
        <div :id="elId" style="width:100%;height:100%">
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

                data:[
                    {
                        name: '茂名站',
                        value:25,
                        children: [
                            {name: '阀门内漏',value:3},
                            {name: '清管',value:4},
                            {name: '甩泵',value:7},
                            {name: '阀门打开',value:6},
                            {name: '阀门关闭',value:2},
                            {name: '其他工况',value:3} ]
                    },
                    {
                        name: '阳江站',
                        value:30,
                        children: [
                            {name: '阀门内漏',value:5},
                            {name: '清管',value:8},
                            {name: '甩泵',value:4},
                            {name: '阀门打开',value:6},
                            {name: '阀门关闭',value:2},
                            {name: '其他工况',value:5} ]
                    },
                    {
                        name: '恩平站',
                        value:35,
                        children: [
                            {name: '阀门内漏',value:10},
                            // {name: '清管',value:2},
                            // {name: '甩泵',value:2},
                            {name: '阀门打开',value:8},
                            {name: '阀门关闭',value:7},
                            {name: '其他工况',value:10} ]
                    },
                    {
                        name: '鹤山站',
                        value:16,
                        children: [
                            {name: '阀门内漏',value:4},
                            {name: '清管',value:7},
                            {name: '甩泵',value:2},
                            // {name: '阀门打开',value:2},
                            // {name: '阀门关闭',value:2},
                            {name: '其他工况',value:3} ]
                    },
                    {
                        name: '江门站',
                        value:18,
                        children: [
                            //{name: '阀门内漏',value:2},
                            {name: '清管',value:6},
                            {name: '甩泵',value:4},
                            {name: '阀门打开',value:3},
                            {name: '阀门关闭',value:2},
                            {name: '其他工况',value:3} ]
                    },
                    // {
                    //     name: '高明站',
                    //     value:15,
                    //     children: [
                    //         {name: '阀门内漏',value:2},
                    //         {name: '清管',value:2},
                    //         {name: '甩泵',value:2},
                    //         {name: '阀门打开',value:2},
                    //         //{name: '阀门关闭',value:2},
                    //         {name: '其他工况',value:2} ]
                    // },
                    // {
                    //     name: '三水站',
                    //     value:25,
                    //     children: [
                    //         {name: '阀门内漏',value:10},
                    //         {name: '清管',value:3},
                    //         {name: '甩泵',value:1},
                    //         {name: '阀门打开',value:3},
                    //         {name: '阀门关闭',value:5},
                    //         {name: '其他工况',value:3} ]
                    // },
                    // {
                    //     name: '花都站',
                    //     value:15,
                    //     children: [
                    //         {name: '阀门内漏',value:2},
                    //         {name: '清管',value:2},
                    //         {name: '甩泵',value:2},
                    //         {name: '阀门打开',value:2},
                    //         {name: '阀门关闭',value:2},
                    //         {name: '其他工况',value:2} ]
                    // },
                    
                ],


                chartWidth:470,
                chartHeight:280,
                
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
			    this.charts.on("click", this.eConsole);
                this.charts.setOption({
                    series: {
                        type: 'sunburst',
                        // emphasis: {
                        //     focus: 'ancestor'
                        // },
                        data: this.data,
                        radius: ['20%', '90%'],
                        label: {
                            rotate: 'radial'
                        }
                    }
			    },true);
			    
            },

            
        },
        watch:{
            

        }
    }
</script>
