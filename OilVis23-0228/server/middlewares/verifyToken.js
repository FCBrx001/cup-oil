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
