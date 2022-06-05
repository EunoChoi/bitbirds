//models/index.js 파일에서
//시퀄라이즈를 통해 노드와 mysql을 연동하고 db의 모델을 생성한다
//파일 내부 코드의 순서가 지켜져야 한다

const Sequelize = require('sequelize');

//현재 환경[development]이 env 변수로 들어간다
const env = process.env.NODE_ENV || 'development';

//즉 config.js에서 export하는 json객체[env]값이 config 변수로 들어간다
const config = require('../config/config.js')[env];

//비어있는 초기 db 생성
const db = {};

//시퀄라이즈 연결하기 위해 설정값을 넣은 시퀄라이즈
const sequelize = new Sequelize(config.database, config.username, config.password, config);

//소문자 시퀄라이즈, 대문자 시퀄라이즈?
//대문자 : require로 시퀄라이즈 라이브러리 불러온 것
//소문자 : new Sequelize(config 설정값)로 config 설정값들을 넣어 시퀄라이즈 라이브러리가 연결하고 생성한 객체
//이 소문자 시퀄라이즈 객체에 mysql과 시퀄라이즈 연결 정보가 담겨있다

//db에 만들어둔 모델 파일들을 추가
//comment.js가 함수로 export 되어있다. require로 불러와서 함수를 실행한다. 인자로 (sequelize, Sequelize)사용된다.
//시퀄라이즈 라이브러리가 생성한 소문자 시퀄라이즈 객체와 시퀄라이즈 라이브러리를 매개로 모델들을 생성
db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

//반복문 돌면서 추가한 모델들의 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
