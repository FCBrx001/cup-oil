<template>
    <div>
    <el-dialog title="修改提示" 
        :visible.sync="dialogVisible"
        @open="open()"
      >
      
    </el-dialog>
  </div>
</template>

<script>
import {MessageBox} from 'element-ui'
export default {
  data() {
    return {
      dialogVisible:false
      //弹框数据
      }
  },
      
  methods:{
  open(){

  },

    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: { text: '在Vue中使用echarts' },
            tooltip: {},
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    }
    
  },
  created() {
  },
  //生命周期 – 挂载完成（可以访问DOM元素）
  mounted() {
      //执行计时器函数
      this.Time_warncheck();
  },
  beforeCreate() {}, //生命周期 – 创建之前
  beforeMount() {}, //生命周期 – 挂载之前
  beforeUpdate() {}, //生命周期 – 更新之前
  updated() {}, //生命周期 – 更新之后
  beforeDestroy() {
  // 页面销毁后同时清除定时器，避免占用内存
      clearInterval(this.timer)
      this.timer=null;
  }, //生命周期 – 销毁之前
  destroyed() {}, //生命周期 – 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发

}
</script>

<style lang="less" scoped>

</style>