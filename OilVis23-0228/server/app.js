var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var RT = require('./routes/flow_router')
var Judge = require('./routes/login_router')
var Popup = require('./routes/popup_router')
var OilBT = require('./routes/OilbatchTrack_router')
var RealMonitor = require('./routes/realmonitor_router')
var par_get = require('./routes/paramsGet')
var hpDg_get = require('./routes/huangpuDongguanGet')
var elevation_get = require('./routes/elevationDataGet')
var prediction_get = require('./routes/predictionDataGet')
var app = express();
var verifyToken = require('./middlewares/verifyToken'); 
// view engine setup
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: secretKey,  // 用于加密 session 的密钥
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // 如果使用 HTTPS，secure 应该设置为 true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 添加CORS支持
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "dist"
)));
app.use('/Judge', Judge)
app.use('/elevation',elevation_get)
app.use('/prediction',prediction_get)
app.use('/hpdg',hpDg_get)  // 移到token验证之前，允许无token访问
app.use(verifyToken);
app.use('/RT',RT)
app.use('/Popup',Popup)
app.use('/OilBT',OilBT)
app.use('/RealMonitor',RealMonitor)
app.use('/parget',par_get)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


