<template>
  <div>
    <el-form ref="form" v-model="form" label-width="80px">
    <el-form-item label="ip">
      <el-input v-model="form.ip"></el-input>
    </el-form-item>
    <el-form-item label="domain">
      <el-input v-model="form.domain"></el-input>
    </el-form-item>
    <el-form-item label="user">
      <el-input v-model="form.user"></el-input>
    </el-form-item>
    <el-form-item label="password">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="Clsid">
      <el-input v-model="form.Clsid"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
    <el-form-item label="text">
      <span>{{form.text}}</span>
    </el-form-item>
  </el-form>
  
  <opcdialog ref="opcdialog"/>
  </div>
</template>

<script>
import {eventBus} from '../main'
import opcdialog from '../components/OPCitems/items_dialog.vue'
export default {
  components: {
    "opcdialog":opcdialog
  },
  data() {
    return {
      form: {
        text:'',
        ip: '',
        domain: '',
        user: '',
        password: '',
        Clsid: '',
      },
      flag:1,
      itemsgroup:[
          //茂名站
          'MCC_GCS_COLLECTOR$STN02_00_FI022B','MCC_GCS_COLLECTOR$STN02_00_PI001','MCC_GCS_COLLECTOR$STN02_00_PI001A',
          'MCC_GCS_COLLECTOR$STN02_00_DI001A','MCC_GCS_COLLECTOR$STN02_00_PI012','MCC_GCS_COLLECTOR$STN02_00_PI012A',
          'MCC_GCS_COLLECTOR$STN02_00_PI013A','MCC_GCS_COLLECTOR$STN02_00_DI002A','MCC_GCS_COLLECTOR$STN02_00_FI021B',
          'MCC_GCS_COLLECTOR$STN02_00_TI002','MCC_GCS_COLLECTOR$STN02_00_ZLC013','MCC_GCS_COLLECTOR$STN02_00_ZLC014',
          'MCC_GCS_COLLECTOR$STN02_00_ZLC015',

          'MCC_GCS_COLLECTOR$STN02_00_PI014','MCC_GCS_COLLECTOR$STN02_00_PIC016',
          'MCC_GCS_COLLECTOR$STN02_00_PI301','MCC_GCS_COLLECTOR$STN02_00_PI009',
          'MCC_GCS_COLLECTOR$STN02_00_PI010A','MCC_GCS_COLLECTOR$STN02_00_PI010B',
          'MCC_GCS_COLLECTOR$STN02_00_PI015A','MCC_GCS_COLLECTOR$STN02_00_PI015B',
         // 'MCC_GCS_COLLECTOR$STN02_00_MOV013','MCC_GCS_COLLECTOR$STN02_00_MOV014','MCC_GCS_COLLECTOR$STN02_00_MOV015',

          //阳江站
          'MCC_GCS_COLLECTOR$STN03_00_FI003','MCC_GCS_COLLECTOR$STN03_00_FI004','MCC_GCS_COLLECTOR$STN03_00_FIQ004',
          'MCC_GCS_COLLECTOR$STN03_00_PI001','MCC_GCS_COLLECTOR$STN03_00_PI001A','MCC_GCS_COLLECTOR$STN03_00_DI001A',
          'MCC_GCS_COLLECTOR$STN03_00_TI001','MCC_GCS_COLLECTOR$STN03_02_FIQ201',
          'MCC_GCS_COLLECTOR$STN03_02_FIQ202','MCC_GCS_COLLECTOR$STN03_00_DI201',
          'MCC_GCS_COLLECTOR$STN03_00_DI202','MCC_GCS_COLLECTOR$STN03_00_PI008','MCC_GCS_COLLECTOR$STN03_00_PI008A',
          'MCC_GCS_COLLECTOR$STN03_00_PI009A','MCC_GCS_COLLECTOR$STN03_00_TI002',

          'MCC_GCS_COLLECTOR$STN03_00_PI010','MCC_GCS_COLLECTOR$STN03_00_PIC011','MCC_GCS_COLLECTOR$STN03_00_PI012A',
          'MCC_GCS_COLLECTOR$STN03_00_PI012B','MCC_GCS_COLLECTOR$STN03_00_PIC004','MCC_GCS_COLLECTOR$STN03_00_PI005',
          'MCC_GCS_COLLECTOR$STN03_00_PI014A','MCC_GCS_COLLECTOR$STN03_00_PI014B',
          
          //恩平站
          'MCC_GCS_COLLECTOR$STN04_00_FI004','MCC_GCS_COLLECTOR$STN04_00_PI001',
          'MCC_GCS_COLLECTOR$STN04_00_PI001A','MCC_GCS_COLLECTOR$STN04_00_DI001A','MCC_GCS_COLLECTOR$STN04_00_TI001',
          'STN04_COLLECTOR$STN04_02_FIC201','MCC_GCS_COLLECTOR$STN04_02_FIQ201',
          'STN04_COLLECTOR$STN04_02_FIC202','MCC_GCS_COLLECTOR$STN04_02_FIQ202',
          'MCC_GCS_COLLECTOR$STN04_02_FI201_DENSITY','MCC_GCS_COLLECTOR$STN04_02_FI202_DENSITY',
          'MCC_GCS_COLLECTOR$STN04_00_PI007','MCC_GCS_COLLECTOR$STN04_00_FIQ003','MCC_GCS_COLLECTOR$STN04_00_FI003',

          'MCC_GCS_COLLECTOR$STN04_00_PI004','MCC_GCS_COLLECTOR$STN04_00_PIC005',
          'MCC_GCS_COLLECTOR$STN04_00_PI006A','MCC_GCS_COLLECTOR$STN04_00_PI006B',

          //鹤山站
          'MCC_GCS_COLLECTOR$STN05_00_FI004','MCC_GCS_COLLECTOR$STN05_00_FI003','MCC_GCS_COLLECTOR$STN05_02_FIQ201',
          'MCC_GCS_COLLECTOR$STN05_02_FIQ202','MCC_GCS_COLLECTOR$STN05_00_FIQ003','MCC_GCS_COLLECTOR$STN05_00_PI001',
          'MCC_GCS_COLLECTOR$STN05_00_PI001A','MCC_GCS_COLLECTOR$STN05_00_DI001A','MCC_GCS_COLLECTOR$STN05_00_TI001',
          'STN05_COLLECTOR$STN05_02_FIC201','STN05_COLLECTOR$STN05_02_FIC202',
          'MCC_GCS_COLLECTOR$STN05_00_TI002',
          'MCC_GCS_COLLECTOR$STN05_00_DI201','MCC_GCS_COLLECTOR$STN05_00_DI202',
          'MCC_GCS_COLLECTOR$STN05_00_PI012B','MCC_GCS_COLLECTOR$STN05_00_PI011','MCC_GCS_COLLECTOR$STN05_00_PI011A',

          'MCC_GCS_COLLECTOR$STN05_00_PI004','MCC_GCS_COLLECTOR$STN05_00_PIC005','MCC_GCS_COLLECTOR$STN05_00_PIC007',
          'MCC_GCS_COLLECTOR$STN05_00_PI008','MCC_GCS_COLLECTOR$STN05_00_PI009A','MCC_GCS_COLLECTOR$STN05_00_PI009B',
          'MCC_GCS_COLLECTOR$STN05_00_PI006B','MCC_GCS_COLLECTOR$STN05_00_PI006A',

          //江门站
          'MCC_GCS_COLLECTOR$STN06_00_FI003','MCC_GCS_COLLECTOR$STN06_00_FIQ003','MCC_GCS_COLLECTOR$STN06_00_PI001',
          'MCC_GCS_COLLECTOR$STN06_00_PI001A','MCC_GCS_COLLECTOR$STN06_00_DI001A','MCC_GCS_COLLECTOR$STN06_00_TI001',
          'MCC_GCS_COLLECTOR$STN06_00_FI3301','MCC_GCS_COLLECTOR$STN06_00_FIQ3301',
          'MCC_GCS_COLLECTOR$STN06_00_FI3302','MCC_GCS_COLLECTOR$STN06_00_FIQ3302',
          'MCC_GCS_COLLECTOR$STN06_00_DI301','MCC_GCS_COLLECTOR$STN06_00_DI302',
          'MCC_GCS_COLLECTOR$STN06_00_PI006','MCC_GCS_COLLECTOR$STN06_00_PI006A',
          'MCC_GCS_COLLECTOR$STN06_00_DI303',
          'MCC_GCS_COLLECTOR$STN06_00_FIQ303','MCC_GCS_COLLECTOR$STN06_00_FIQ006',
          'MCC_GCS_COLLECTOR$STN06_00_TI002','MCC_GCS_COLLECTOR$STN06_00_FIC006',
          'STN06_COLLECTOR$STN06_02_FIC201','MCC_GCS_COLLECTOR$STN06_02_FIQ201',
          'STN06_COLLECTOR$STN06_02_FIC202','MCC_GCS_COLLECTOR$STN06_02_FIQ202',
          'MCC_GCS_COLLECTOR$STN06_02_DI201','MCC_GCS_COLLECTOR$STN06_02_DI202',
          'MCC_GCS_COLLECTOR$STN06_00_PI007','MCC_GCS_COLLECTOR$STN06_00_PI007A',
          'MCC_GCS_COLLECTOR$STN06_00_TI003','MCC_GCS_COLLECTOR$STN06_00_DI002A',

          'MCC_GCS_COLLECTOR$STN06_00_PI3302A','MCC_GCS_COLLECTOR$STN06_00_PI3302B',
          'MCC_GCS_COLLECTOR$STN06_00_PI008','MCC_GCS_COLLECTOR$STN06_00_PIC009',
          'MCC_GCS_COLLECTOR$STN06_00_PI010B','MCC_GCS_COLLECTOR$STN06_00_PI010B',

          //高明站
          'MCC_GCS_COLLECTOR$STN19_00_FI003','MCC_GCS_COLLECTOR$STN19_00_FIQ003','MCC_GCS_COLLECTOR$STN19_00_PI001',
          'MCC_GCS_COLLECTOR$STN19_00_PI001A','MCC_GCS_COLLECTOR$STN19_00_DI001A','MCC_GCS_COLLECTOR$STN19_00_TI001',
          'STN19_COLLECTOR$STN19_02_FIC201','MCC_GCS_COLLECTOR$STN19_02_FIQ201',
          'STN19_COLLECTOR$STN19_02_FIC202A','MCC_GCS_COLLECTOR$STN19_02_FIQ202A',
          'STN19_COLLECTOR$STN19_02_FIC202','MCC_GCS_COLLECTOR$STN19_02_FIQ202',
          'MCC_GCS_COLLECTOR$STN19_02_DI201','MCC_GCS_COLLECTOR$STN19_02_DI202A','MCC_GCS_COLLECTOR$STN19_02_DI202',
          'MCC_GCS_COLLECTOR$STN19_00_PI027','MCC_GCS_COLLECTOR$STN19_00_PI027A',
          'MCC_GCS_COLLECTOR$STN19_00_TI002',

          'MCC_GCS_COLLECTOR$STN19_00_PI004','MCC_GCS_COLLECTOR$STN19_00_PIC005',
          'MCC_GCS_COLLECTOR$STN19_00_PIC006A','MCC_GCS_COLLECTOR$STN19_00_PIC006B','MCC_GCS_COLLECTOR$STN19_00_PI022A',
          'MCC_GCS_COLLECTOR$STN19_00_PI036A','MCC_GCS_COLLECTOR$STN19_00_PI036B',
          'MCC_GCS_COLLECTOR$STN19_00_PI036C',
          
          //三水站
          'MCC_GCS_COLLECTOR$STN20_00_FI003','MCC_GCS_COLLECTOR$STN20_00_FI004','MCC_GCS_COLLECTOR$STN20_02_FIQ003',
          'MCC_GCS_COLLECTOR$STN20_00_PI001A','MCC_GCS_COLLECTOR$STN20_00_PI001B','MCC_GCS_COLLECTOR$STN20_00_PI001C',
          'MCC_GCS_COLLECTOR$STN20_00_DI001A','MCC_GCS_COLLECTOR$STN20_00_TI001','MCC_GCS_COLLECTOR$STN20_00_PI001',
          'STN20_COLLECTOR$STN20_02_FIC201','MCC_GCS_COLLECTOR$STN20_02_FIQ201','MCC_GCS_COLLECTOR$STN20_00_PI007',
          'STN20_COLLECTOR$STN20_02_FIC202','MCC_GCS_COLLECTOR$STN20_02_FIQ202','MCC_GCS_COLLECTOR$STN20_00_PI008',
          'MCC_GCS_COLLECTOR$STN20_02_DI201','MCC_GCS_COLLECTOR$STN20_02_DI202','MCC_GCS_COLLECTOR$STN20_00_TI002',

          'MCC_GCS_COLLECTOR$STN20_00_PI004','MCC_GCS_COLLECTOR$STN20_00_PIC005',
          'MCC_GCS_COLLECTOR$STN20_00_PI006A','MCC_GCS_COLLECTOR$STN20_00_PI006B',

          //花都站
          'MCC_GCS_COLLECTOR$STN22_00_FI003','MCC_GCS_COLLECTOR$STN22_00_PI001A',
          'MCC_GCS_COLLECTOR$STN22_00_DI001A','MCC_GCS_COLLECTOR$STN22_00_TI001','MCC_GCS_COLLECTOR$STN22_00_PI001',
          'STN22_COLLECTOR$STN22_02_FIC201','MCC_GCS_COLLECTOR$STN22_02_FIQ201',
          'STN22_COLLECTOR$STN22_02_FIC202','MCC_GCS_COLLECTOR$STN22_02_FIQ202',
          'MCC_GCS_COLLECTOR$STN22_00_DI201','MCC_GCS_COLLECTOR$STN22_00_DI202',

          'MCC_GCS_COLLECTOR$STN22_00_PI004','MCC_GCS_COLLECTOR$STN22_00_PIC005',
          'MCC_GCS_COLLECTOR$STN22_00_PI006A','MCC_GCS_COLLECTOR$STN22_00_PI006B',

          //南海站
          'MCC_GCS_COLLECTOR$STN21_00_FI001','MCC_GCS_COLLECTOR$STN21_00_PI001A',
          'MCC_GCS_COLLECTOR$STN21_00_DI001A','MCC_GCS_COLLECTOR$STN21_00_TI001','MCC_GCS_COLLECTOR$STN21_00_PI001',  
          'STN21_COLLECTOR$STN21_02_FIC201','MCC_GCS_COLLECTOR$STN21_02_FIQ201',
          'STN21_COLLECTOR$STN21_02_FIC202','MCC_GCS_COLLECTOR$STN21_02_FIQ202',
          'MCC_GCS_COLLECTOR$STN21_00_DI201','MCC_GCS_COLLECTOR$STN21_00_DI202',

          'MCC_GCS_COLLECTOR$STN21_00_PI004','MCC_GCS_COLLECTOR$STN21_00_PIC005',
          'MCC_GCS_COLLECTOR$STN21_00_PI006A','MCC_GCS_COLLECTOR$STN21_00_PI006B',

          ]
    }
  },
  mounted () {
    var that= this
    eventBus.$on('datatext',message=>{
      that.form.text=message
    })
  },
  methods: {
    onSubmit() {
      //珠三角Clsid: D885BDCD-51A1-4186-83AA-9554492C9085
      //this.$router.replace('/home')
      
		  let that = this

      this.timer=setInterval(()=>{
      that.$axios({
        mrthid:'get',
        url:'/opc/conItems',
      }).then(res=>{
        that.flag++
      })
       },10000)
      
      
    },
    cancel(){
      this.$axios({
        mrthid:'get',
        url:'/opc/testWrong',
      }).then(res=>{
        that.flag++
      })
    }
  }
}
</script>
