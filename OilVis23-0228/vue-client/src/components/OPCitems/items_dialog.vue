<template>
    <div>
    <el-dialog title="选择监测点" :visible.sync="dialogFormVisible" >
      <div style="width:30%">
        <el-input
          v-show="show"
          v-model="input"
          clearable
          placeholder="请输入监测点信息"
          @keyup.enter.native="handleQuery"
          >
          <i
          slot="prefix"
          class="el-input__icon el-icon-search"
          @click="handleQuery"
          ></i>
        </el-input>
      </div>
      <el-form
        :model="Form"
        ref="Form"
        label-position="left"
      >
        <el-form-item label="监测点信息">
          <div style="width:40%;float:left">
            <el-table
              :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              :stripe="stripe"
              :row-key="getRowKeys"
              :current-page.sync="currentPage"
              height="500px"
              border
              @row-click="handleClick"
              >
              <el-table-column
                prop="name"
                label="Branches"
                >
              </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :page-sizes="[10, 20, 30]"
                  :page-size="pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
              </el-pagination>
            </div>
          </div>
          <div style="width:40%;margin-left:1rem;float:left">
            <el-table
              ref="table"
              @selection-change="handleSelectionChange1"
              :data="tableData1.slice((currentPage1-1)*pagesize1,currentPage1*pagesize1)"
              :stripe="stripe1"
              :row-key="getRowKeys1"
              :current-page.sync="currentPage1"
              height="500px"
              border>
              <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="Items"
                >
              </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :page-sizes="[10, 20 , 30, 40, 50]"
                  :page-size="pagesize1"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total1">
              </el-pagination>
            </div>
          </div>
          
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
        brenchname:'',
        Form: {
          name:'',
        },
        show:false,
        stripe:true,
        stripe1:true,
        rowindex:0,
        currentPage:1,
        currentPage1:1,
        pagesize:10,
        input:'',
        pagesize1:10,
        dialogFormVisible:false,
        data:'',
        total:0,
        total1:0,
        time:'',
        timer:'',
        options: [],//下拉框选项
        tableData:[],
        tableData1:[],
        multipleSelection:[],
        Selection:[],
        values:[],
        keys:[],
        
      }
    },
    created(){
    },
    methods:{
      /**
       * 回车搜索
       */
      handleQuery(){
        this.input.toString()
        if(this.input===''||this.input===null){
          this.tableData1=[]
          for(var i=0;i<this.values.length;i++){
            var x={
              name:this.values[i],
            }
            this.tableData1.push(x)
        }
          this.total1=this.values.length
        }
        let names=this.values.filter(el=>el===this.input)
        // console.log(names)
        this.tableData1=[]
        for(var i=0;i<names.length;i++){
            var x={
              name:names[i],
            }
            this.tableData1.push(x)
        }
        // console.log(this.tableData1)
        this.total1=names.length
      },

      /**
       * 获取Brench行key
       */
      getRowKeys(row){
        return row.orderId;
      },

      /**
       * 获取Items行key
       */
      getRowKeys1(row){
        return row.id;
      },
      
      /**
       * 弹框入口
       */
      openItems(data) {
        this.tableData=[]
        for(var i=0;i<data.length;i++){
            var x={
              name:data[i],
            }
            this.tableData.push(x)
        }
        this.total=data.length
        this.dialogFormVisible = true;
        return new Promise((resolve,reject)=>{
          resolve(data)
        })
      },


      /**
       * 对Brench进行选择
       */
      handleClick(row){
        this.brenchname=row.name
        let that=this
        this.$axios({
          mrthid:'get',
          url:'/opc/conBrench',
          // url:'/opc/conBrench',
          params:{
            position:row.name,
          }
        }).then(res=>{

          // that.keys= Object.keys(res.data)
          that.values = Object.values(res.data)
          that.tableData1=[]
          for(var i=0;i<that.values.length;i++){
            var x={
              name:that.values[i],
            }
            that.tableData1.push(x)
          }
          this.total1=that.values.length
          this.show=true
        })
      },

      /**
       * Item选择操作
       */
      handleSelectionChange1(val){
        this.multipleSelection=val
      },

      /**
       * 确认操作
       */
      success_change() {
        var that=this
        this.dialogFormVisible = false
        this.Selection=[]
        for(var i=0;i<this.multipleSelection.length;i++){
          // console.log(this.multipleSelection[i].name)
          var index = this.keys.indexOf()
          this.Selection.push(this.brenchname+'$'+this.multipleSelection[i].name)
        }
        this.$refs.table.clearSelection();
        // this.$router.replace('/home')
        this.timer=setInterval(()=>{
          this.$axios({
            mrthid:'get',
            url:'/opc/conItems',
            params:{
              itemGroups:that.itemsgroup,
              // itemGroups:that.Selection,
            }
          }).then(res=>{
            //执行成功后
          }) 
        },1000)
        // MessageBox("批次添加成功成功！","确认提示")
    },

    /**
     * 取消操作
     */
    fail(){
      this.dialogFormVisible = false
    },

    /**
     * item页面大小设置
     */
    handleSizeChange1(val){
      // this.$refs.table.toggleRowsSelection(this.multipleSelection,true)

      this.pagesize1=val;
    },

    /**
     * brench页面大小设置
     */
    handleSizeChange(val) {
      this.pagesize=val;
    },

    /**
     * brench页面切换设置
     */
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    /**
     * item页面切换设置
     */
    handleCurrentChange1(val){
      // let selectItem=[]
      // this.tableData.forEach()
      // this.$refs.table.toggleRowsSelection(this.multipleSelection,true)
      this.currentPage1 = val;
    }
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
    width: 55px;
}
</style>


