<template>
    <div>
    <el-dialog title="添加信息" :visible.sync="dialogFormVisible" >
        <el-form
            :model="Form"
            ref="Form"
            label-position="left"
        >
            <el-form-item label="油品种类">
              <el-select 
                v-model="Form.name" 
                size="500" 
                placeholder="请选择种类"
                @change="changeselect(Form.name)">
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
        <el-button type="primary" @click="success_change">确 定</el-button>
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
          table:['mm-yj','yj-ep','ep-hs','hs-jm','gg-ss'],
          Form: {
            name:'',
            value: '',
            label:''
          },
          stripe:true,
          rowindex:0,
          warnId:202202001,
          dialogFormVisible:false,
          data:'',
          total:0,
          time:'',
          options: [{
            label:'0#柴油',
            value:'0#柴油'
          },{
            label:'92#汽油',
            value:'92#汽油'
          },{
            label:'95#汽油',
            value:'95#汽油'
          }],//下拉框选项
          tableData:[],
          sure_name:'',
          index:0,
          stationnames:['阳江','恩平','鹤山','江门','高明','三水','花都','南海']
        }
    },
    methods:{
        openAdd(data) {
          // this.options=data.name
          // this.time=data.time
          // this.data=data.value
          // this.rowindex=data.
          let stationname = data.name.slice(data.name.length-2,data.name.length) 
          this.rowindex = this.stationnames.indexOf(stationname)
          this.index = data.index
          this.dialogFormVisible = true;
          return new Promise((resolve,reject)=>{
              resolve(data)
          })
        },
        changeselect(value){
          // console.log("selected data",value)
          this.sure_name = value
        },
        success_change() {
          var that=this
          this.dialogFormVisible = false
          this.$axios({
            mrthid:'get',
            url:'/OilBT/input',
            params:{
              station:this.rowindex,
              index:that.index,
              data:that.sure_name
            }
          }).then(res=>{
            console.log(res)
          })
          MessageBox("批次修改成功！","确认提示")
        },
        fail(){
          this.dialogFormVisible = false
        },
        handleSizeChange(val) {
            this.pagesize=val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
    }
}
</script>
<style>
.el-pager li {
    padding: 0 4px;
    font-size: 13px;
    min-width: 2.5px;
    height: 28px;
    line-height: 28px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    width: 90px;
}
</style>


