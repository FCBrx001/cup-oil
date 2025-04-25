<template>
  <div>
    <el-dialog title="修改提示" :visible.sync="dialogFormVisible" style="width:50%;margin-left:25%" @close='closeDialog'>
      <el-form
        :model="userForm"
        ref="userForm"
        label-position="left"
      >
        <el-form-item label="MOV012阀门状态">
            <el-select v-model="userForm.valve_state" size="500" placeholder="---">
              <el-row>
                <el-col>
              <el-option
                v-for="item in valve_state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
              </el-col>
                </el-row>
            </el-select>
          
        </el-form-item>
        <el-form-item label="MOV012阀门内漏">
            <el-select v-model="userForm.valve_leakage" size="500" placeholder="---">
              <el-row>
                <el-col>
              <el-option
                v-for="item in valve_leakage"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
              </el-col>
                </el-row>
            </el-select>
          
        </el-form-item>
        <el-form-item label="清管状态">
            <el-select v-model="userForm.pig_state" size="500" placeholder="---">
              <el-row>
                <el-col>
              <el-option
                v-for="item in pig_state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
              </el-col>
                </el-row>
            </el-select>
          
        </el-form-item>
        <!-- <el-form-item label="主输泵状态">
            <el-select v-model="userForm.pump_state" size="500" placeholder="---">
              <el-row>
                <el-col>
              <el-option
                v-for="item in pump_state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
              </el-col>
                </el-row>
            </el-select>
          
        </el-form-item> -->
        <el-form-item label="其他工况：" label-width="140px">
            <el-input v-model="userForm.other_state" style="width:47%"></el-input>
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
              valve_state:'',
              valve_leakage:'',
              pig_state:'',
              pump_state:'',
              other_state:''
            },
            row:{},
            // warnId:202202001,
            dialogFormVisible:false,
            
            valve_state:[
              {
                value: "open",
                label: "打开"
              },
              {
                value: "close",
                label: "关闭"
              },
              {
                value: "---",
                label: "---"
              }
            ],
            valve_leakage:[
              {
                value: "normal",
                label: "正常"
              },
              {
                value: "leakage",
                label: "内漏"
              },
              {
                value: "---",
                label: "---"
              }
            ],
            pig_state:[
              {
                value: "JMZpig",
                label: "清管"
              },
              {
                value: "normal",
                label: "正常"
              },
              {
                value: "---",
                label: "---"
              }
            ],
            pump_state:[
              {
                value: "pump2_stop_working",
                label: "泵压力异常"
              },
              {
                value: "normal",
                label: "正常"
              },
              {
                value: "---",
                label: "---"
              }
            ],
        }
    },
    methods:{
        closeDialog(){
          eventBus.$emit('close','load')
        },
        openAdd(row) {
      //将从后端传到pro再闯到dialog中的warndata的warnId,方便修改时传回
            //this.warnId = warndata[0].warnId
            this.row = row
            console.log('更改当前行',row)
            this.dialogFormVisible = true; 
            // res.send('123')
        },
        
        
        warn_correct(form) {
          console.log('选中值',form)
          this.$axios({
            mrthid:'get',
            url:'/Popup/warn_correct',
            params:{
              uuid:this.row.uuid,
              stationname:'花都',
              collectionold:'label',
              new_valve_state:form.valve_state,
              new_valve_leakage:form.valve_leakage,
              new_pig_state:form.pig_state,
              new_pump_state:form.pump_state,
              valve_state:this.row.valve_state,
              valve_leakage:this.row.valve_leakage,
              pig_state:this.row.pig_state,
              pump_state:this.row.pump_state,
              other_state:this.userForm.other_state,
              datetime:this.row.datetime
            }
          }).then(res=>{
            if(res.data == 'success')
            {
              console.log('返回结果：',res)
              this.dialogFormVisible=false
            }else{
              this.fail()
            }
          })
        },
        fail()
        {
          MessageBox("工况报警修改失败！","确认提示",)
        }
    }
}
</script>
<style lang="less" scoped>

</style>


