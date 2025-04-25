// 引入Express和Router
const { Router } = require('express');
// 创建一个Router实例
let login_router = new Router();
const jwt = require('jsonwebtoken');
const uri = 'mongodb://localhost:27017';
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('成功连接到 MongoDB');
    const db = client.db('user');  // 替换为你的数据库名称
    return db;
  } catch (error) {
    console.error('连接 MongoDB 失败', error);
  }
}
// 定义路由
login_router.post('/login', async (req, res) => {
  try {
    const { user, password, captcha  } = req.body;  // 从请求体中获取数据
    if (!user || !password) {
      return res.status(400).send({ error: '缺少 user 或 password 参数' });
    }
    const loginuser = user;
    const pass = password;
    const captcha_code = captcha 

    const bcrypt = require('bcryptjs');
    if (req.session.captcha !== captcha_code) {
      return res.send({
        message: '验证码错误',
      });
    }
    // 用户注册时对密码进行哈希处理
    // const saltRounds = 10;  // 加盐轮次
    // const hashedPassword = await bcrypt.hash(pass, saltRounds);
    const db = await connectToDatabase();
    const usersCollection = db.collection('useraccount');  // 使用你的集合 "useraccount"
    // const result = await usersCollection.insertOne({
    //   username: loginuser,
    //   password: hashedPassword,  // 存储加密后的密码
    // });
     // 查询用户
     const getuser = await usersCollection.findOne({ username: loginuser });
     if (!getuser) {
      // 用户名不存在
      return res.send({ message: '用户名不存在' });
    }
     const isPasswordValid = await bcrypt.compare(pass, getuser.password);
     if (!isPasswordValid) {
      // 密码错误
      return res.send({ message: '用户名或密码错误' });
    }
    // res.send({ message: '登录成功' });
    console.log('接收到的用户:', loginuser);
    console.log('密码:', pass);
    // 检查用户参数是否存在
    // 生产token标识
    const token = jwt.sign({ username: loginuser }, 'your_jwt_secret', { expiresIn: '1h' });
    res.send({
      message: '校验成功',
      token: token,
    });
  } catch (error) {
    // 捕捉所有异常，并返回 500 错误
    console.error('服务器内部错误:', error);
    res.status(500).send({ error: '服务器内部错误' });
  }
});

// 生成登录验证码
const svgCaptcha = require('svg-captcha');
login_router.get('/check', (req, res) => {
  try {
    const captcha = svgCaptcha.create();  // 生成验证码
    if (!req.session) {
      throw new Error('Session 未配置或不可用');
    }
    req.session.captcha = captcha.text;   // 将验证码文本存储到 session 中
    res.type('svg');
    res.status(200).send(captcha.data);   // 返回验证码图片
    console.log("验证码生成成功:", captcha.text);
  } catch (error) {
    console.error("验证码生成或处理失败:", error);
    res.status(500).send({ error: '服务器内部错误' });
  }
});

module.exports = login_router;
