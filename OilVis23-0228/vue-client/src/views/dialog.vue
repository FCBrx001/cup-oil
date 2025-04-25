<template>
    <div>
    <el-dialog title="修改提示" :visible.sync="dialogFormVisible" >
      <el-form
        :model="userForm"
        ref="userForm"
        label-position="left"
      >
        <el-form-item label="工况类型" prop="warncheckId" >
          
            <el-select v-model="userForm.warncheckId" size="500">
              <el-row>
                <el-col>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
              </el-col>
                </el-row>
            </el-select>
          
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fail">取 消</el-button>
        <el-button type="primary" @click="warn_correct(userForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {MessageBox} from 'element-ui'
import {eventBus} from '../main'
export default {
  data() {
    return {
      
      //弹框数据
      warndata:[],
      warnId:202202001,
      warncheckId:0,
      dialogFormVisible:false,
      warn_type:['','阀门内漏','清管','甩泵','阀门打开','阀门关闭','正常','其他工况'],
      
      loading: false,  //这个属性控制刷不刷新
      list: [], //数组
      userForm: {},
      dialogFormVisible: false,
      result:'',
      options: [  //下拉框选项
        {
          value: "0",
          label: "阀门内漏"
        },
        {
          value: "1",
          label: "清管"
        },
        {
          value: "2",
          label: "甩泵"
        },
        {
          value: "3",
          label: "阀门打开"
        },
        {
          value: "4",
          label: "阀门关闭"
        },
        {
          value: "5",
          label: "正常"
        },
        {
          value: "6",
          label: "其他工况"
        }
        
      ]
    };
  },
  methods:{

    warn_check(){
				let warnId = this.warnId
				this.$axios({
					mrthid:'get',
					url:'/Popup/warn_check',
					params:{
						warnId:warnId
					}
				}).then(res=>{
					//判断传回值，接入弹框
					this.warndata = res.data   //将传回的data数组赋值给this.warndata,为了传到dialog中
					this.warnId++
					//console.log('测试：',res)
					if(res.data[0].warn_type!=0)
					{
						this.warncheckId = res.data[0].warn_type
						this.tankuang(this.warncheckId)
					}
				})
			},

      warn_check2(){
        console.log('进入warn_check')
				let warnId = this.warnId
				this.$axios({
					mrthid:'get',
					url:'/Popup/warn_check',
					params:{
						warnId:warnId
					}
				}).then(res=>{
					//判断传回值，接入弹框
					this.warndata = res.data   //将传回的data数组赋值给this.warndata,为了传到dialog中
					this.warnId++
					//console.log('测试：',res)
					if(res.data[0].warn_type!=0)
					{
						this.warncheckId = parseInt(res.data[0].warn_type)
						console.log('warncheckId',this.warncheckId)
						this.$message.success('恩平站工况警告！')
						eventBus.$emit('warncheckId',this.warncheckId)
						//this.tankuang(this.warncheckId)
					}
				})
			},


			success() {
				MessageBox("工况报警确认成功！","确认提示",)
			},
      success_change() {
				MessageBox("工况报警修改成功！","确认提示",)
			},
			tankuang(chenkid) {
				MessageBox({
					title: `${this.warn_type[chenkid]}工况警告！！！`,
					message: '     工况判断是否正确？   （提示：错误请点击更改）',
					showCancelButton: true,
					confirmButtonText:'确定',
					cancelButtonText:'更改'
				}).then(() => {     //then确定
          
					this.success()
          
				}, () => {          //更改
          this.openAdd(this.warndata)
					//this.addSdialog(this.warndata)
					//this.addDetailNormal()
				});
			},
      openAdd(warndata) {
      //将从后端传到pro再闯到dialog中的warndata的warnId,方便修改时传回
        this.warnId = warndata[0].warnId
        console.log('dialog中的warndata:',this.warnId)
        this.dialogFormVisible = true; 
      },







      fail() {
        MessageBox("修改失败！","提示" )
      },
  
    //设置定时器
    Time_warncheck(){
        this.timer=setInterval(()=>{
            //this.get_heatmap();
            this.warn_check2()
            //console.log('123')
        },10000)
    },
    //清除定时器
    dget(){
        console.log('清除定时器，结束数据获取！')
        clearInterval(this.timer)
    },
    
  	warn_correct(form) {
      //console.log('修改结果',form.sex)
      //warn_correctnum++是因为数据库中0是正常，2.3.4分别为 泄漏报警、压力报警、温度报警
      //与前端差1，所以传回的值要加1才正确
      //
      var warn_correctnum = form.warncheckId
      warn_correctnum++
      console.log(`修改结果：${this.warnId}号警告修改为${this.warn_correctnum}`)

      let warnId = this.warnId
      //this.loading = true;
      this.$axios({
        mrthid:'get',
        url:'/Popup/warn_correct',
        params:{
          warnId:warnId,
          warn_correctnum:warn_correctnum
        }
      }).then(res=>{
        if(res.data == 'success')
        {
          console.log('返回结果：',res)
          this.dialogFormVisible=false
          this.success_change()
        }else{
          this.fail()
        }
      })
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