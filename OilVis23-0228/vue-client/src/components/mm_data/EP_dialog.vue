<template>
    <div>
    <el-dialog title="修改提示" :visible.sync="dialogFormVisible" >
      <el-form
        :model="userForm"
        ref="userForm"
        label-position="left"
      >
        <el-form-item label="工况类型">
            <el-select v-model="userForm.value" size="500">
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
import { eventBus } from '../../main'
export default {
    data(){
        return{
            userForm: {
              value: '',
              label:''
            },
            warnId:202202001,
            dialogFormVisible:false,
            
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
              }],
        
        }
    },
    methods:{
        openAdd() {
      //将从后端传到pro再闯到dialog中的warndata的warnId,方便修改时传回
            //this.warnId = warndata[0].warnId
            console.log('dialog中的warndata:')
            this.dialogFormVisible = true; 
        },
        success_change() {
          this.dialogFormVisible = false
          MessageBox("工况报警修改成功！","确认提示",)
        },
        warn_correct(form) {
          //console.log('修改结果',form.sex)
          //warn_correctnum++是因为数据库中0是正常，2.3.4分别为 泄漏报警、压力报警、温度报警
          //与前端差1，所以传回的值要加1才正确
          //
          console.log('选中值',form.value)
          var warn_correctnum = form.value
          warn_correctnum++
          //console.log(`修改结果：${this.warnId}号警告修改为${this.warn_correctnum}`)

          eventBus.$emit('checked_event',parseInt(form.value))

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
        },
        fail()
        {

        }
    }
}
</script>
<style lang="less" scoped>

</style>


