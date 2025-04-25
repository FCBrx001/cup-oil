<!-- 折线图 -->
<template>	
  <div class="newChartground">
		<div class="main_title2">
            <el-button style="background:#2C58A6;width:100%;color:#fff;font-size: 18px;font-weight: 600;" round @click="back">{{name+'站当前信息'}}</el-button> 
        </div>
    <div>
        <div class="info boxstyle">
            <div class="info-main">
                <ul>
                    <li><span>当前管道压力(MPa)</span><p>{{this.press_a}}</p></li>
                    <li><span>当前流量(m^3/h)</span><p>{{this.ll_a}}</p></li>
                    <li><span>当前管道温度(℃)</span><p>{{this.tem_a}}</p></li>
                    <li><span>当前油品密度(kg/m^3)</span><p>835</p></li>
                </ul>
            </div>
        </div>
    </div>
    
  </div>
  
</template>
<script>
import { eventBus } from '../../main';
export default {
    props: {
            name:{
            type:String,
            default:'茂名'
            },
			// 样式 - 1
			chartWidth:{
				type: Number,
				default:500
			},
			chartHeight:{
				type: Number,
				default:500
			},
		},
    data(){
        return{
            titleText:'恩平站当前信息',
            press: [4.0,4.3,4.2,4.25,4.45,4.5,4.21,4.23,4.0,4.15],
            ll:[1224,1230,1215,1210,1246,1235,1234,1233,1230,1210],
            tem:[22.4,24.9,23.6,25.0,24.6,22.7,25.0,23.4,24.3,24.6],
            md:[835.745,835.895,835.756,835.654,835.665,835.895,835.756,835.654,835.665,835.576],
            press_a:101,
            ll_a:20,
            tem_a:40,
            md_a:0.745,
            id:0,
            dialogtrue:true
        }
    },
    methods:{
        back(){
            
            console.log('back函数',this.dialogtrue)
            eventBus.$emit('dialogtrue',this.dialogtrue)
        },

        d(){
            this.timer=setInterval(()=>{
                //this.get_heatmap();
                this.circle(this.id)
                this.id = (this.id+1)%10
            },3000)
        },

        //清除定时器
        dget(){
            console.log('清除定时器，结束数据获取！')
            clearInterval(this.timer)
        },
        circle(i){
                this.press_a = this.press[i]
                this.ll_a = this.ll[i]
                this.tem_a = this.tem[i]
                this.md_a = this.md[i]       
        }
    },
    mounted(){
        this.d()
    }
}
</script>