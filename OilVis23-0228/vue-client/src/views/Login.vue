<template>
  <div>
    <div class="head">
      <div class="head_title">
        <img src="../assets/img/title-left.png" style="margin-top:.5rem;">
        <!-- <span style="font-size:3rem;margin:0px;text-align:center;">管道工况智能监测系统</span> -->
        <span style="font-size:3rem;margin:0px;text-align:center;">成品油管道水力计算软件</span>
        <img src="../assets/img/title-right.png" style="margin-top:.5rem">
      </div>
    </div>
    <div id="login-container">
      <h3 class="card-title" style="text-align: center;font-size: 28px;color: #343a40;margin-bottom: 5px;">管网智能监测系统</h3>
      <p class="card-description" style="text-align: center;font-size: 18px;color: #a7a7a7;margin-bottom: 25px;">
        SCAdmin Monitoring System
      </p>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm"
        inline>
        <el-form-item label="账号" prop="user">
          <el-input type="text" v-model="ruleForm.user" autocomplete="off"
            style="width: 320px;font-size: 20px;"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" :label-style="{ fontSize: '16px' }">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"
            style="width: 320px;font-size: 20px;"></el-input>
        </el-form-item>
        <el-form-item label="校验" prop="code" :label-style="{ fontSize: '16px' }">
          <el-input type="text" v-model="ruleForm.code" autocomplete="off"
            style="width: 200px;font-size: 20px;top: -10px;"></el-input>
          <img :src="captchaUrl" @click="refreshCaptcha" alt="验证码" style="cursor: pointer;width: 130px; height: 40px;">
        </el-form-item>
        <el-form-item style="margin-left: 24%;">
          <el-button type="primary" @click="submitForm('ruleForm')"
            style="font-size: 20px;border-radius: 30px;width: 320px;">登入系统</el-button>
          <!-- <el-button @click="resetForm('ruleForm')" style="font-size: 20px;margin-left: 50px;border-radius: 30px;width: 150px;">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
export default {
  name: "login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账户'));
      } else {
        if (this.ruleForm.pass !== '') {
          this.$refs.ruleForm.validateField('pass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        user: '',
        pass: '',
        code: ''
      },
      rules: {
        user: [
          { validator: validatePass, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        code: [
        { validator: validatePass3, trigger: 'blur' }
        ]
        // age: [
        //   { validator: checkAge, trigger: 'blur' }
        // ]
      },
      isLogin:false,
      captchaUrl: '',  // 验证码图片的 URL
    };
  },
  methods: {
    submitForm(formName) {
      let _this = this;
      //axios发送用户名密码进行校验
      this.$axios({
        method: 'post',
        url: '/Judge/login',
        data: {
          user: _this.ruleForm.user,
          password: _this.ruleForm.pass,
          captcha: _this.ruleForm.code
        }
      }).then(res => {
        let user = res.data;
        if (user["message"] === "校验成功") {
          const token = user['token'];
          sessionStorage.setItem('token', token);
          _this.$router.push("/home");
        } 
        else if(user["message"] === "验证码错误") {
          this.$message.error("验证码错误");
          _this.refreshCaptcha();
        }
        else {
          this.$message.error("账号或密码错误");
          _this.refreshCaptcha();
        }
      })
    },
    refreshCaptcha() {
      this.$axios({
        method: 'get',
        url: '/Judge/check',  // 后端生成验证码的接口
        responseType: 'blob'   // 期待返回二进制数据（Blob）
      })
      .then(response => {
        const blob = new Blob([response.data], { type: 'image/svg+xml' });  // 创建 Blob 对象
        this.captchaUrl = URL.createObjectURL(blob);  // 生成 Blob URL
      })
      .catch(error => {
        console.error('获取验证码失败:', error);
      });
    },
  },
  mounted(){
    this.refreshCaptcha();
	},
}
</script>
<style lang="less">
body {
  margin: 0;
  background-image: url('../assets/img/interact.png');
  background-size: cover;
  /* 图片覆盖整个页面 */
  background-position: left center;
  /* 向左居中对齐 */  
  background-repeat: no-repeat;
  /* 避免图片重复 */
}

#login-container {
  width: 580px;
  height: 360px;
  background: #e5e9f2;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -290px;
  margin-top: -170px;
  border-radius: 5px;
  padding-top: 20px;
  padding-right: 0px;
}
.el-form-item__label {
  font-size: 20px;
  /* 设置你希望的字体大小 */
}
</style>
