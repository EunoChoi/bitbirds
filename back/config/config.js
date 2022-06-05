//.env에 저장됨 값을 사용하기 위해서 .js파일로 만들고 export하였다

const dotenv = require('dotenv');
dotenv.config();
//.env 파일의 값을 불러오는 dotenv 모듈의 함수

module.exports = {
  "development": {
    "username": "root",
    //.env 파일 내부에 적어둔 DB_PASSWORD 값을 가져온다
    "password": process.env.DB_PASSWORD,
    "database": "react-bitbird",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-bitbird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-bitbird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}