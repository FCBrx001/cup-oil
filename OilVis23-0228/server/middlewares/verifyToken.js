// 正常验证token，如果token错误，返回401
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(403).send('没有提供 token');
  }

  const token = authHeader.split(' ')[1];  // 获取 'Bearer' 之后的 token

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(401).send('无效的 token');
    }
    req.user = user;  // 将解码后的用户信息存入 req 对象
    next();
  });
}


module.exports = verifyToken;


// //跳过验证
// const jwt = require('jsonwebtoken');

// function verifyToken(req, res, next) {
//   // 跳过验证，直接允许所有请求通过
//   console.log('跳过token验证，允许访问:', req.path);
  
//   // 添加一个默认用户，以防后续代码依赖用户信息
//   req.user = {
//     username: 'admin',
//     role: 'admin'
//   };
  
//   next();
// }

// module.exports = verifyToken;


