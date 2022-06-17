//express 사용하여 서버 구동
//express를 사용하면 좀더 구조적으로 코드 작성 가능

const express = require('express');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');

const cors = require('cors');
const db = require('./models');//models 폴더 내부 index.js의 export인 db를 불러온다
const passport = require('passport');
const passportConfig = require('./passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

const app = express();//http 모듈에서 createServer 처럼 서버를 생성


dotenv.config();

//시퀄라이즈로 생성한 db 연결
db.sequelize.sync().then(() => {
    console.log('db 연결 성공');
}).catch(console.error);

//함수를 export 하는 파일을 require로 받아와서 그 함수를 실행
passportConfig();


//익스프레스 서버 미들웨어 추가, 라우터 추가 코드보다 위에 작성되어야 한다.

//프론트에서 url을 통해 백엔드 디렉토리에 접근하기 위한 미들웨어, 로컬호스트/로 접근
app.use('/', express.static(path.join(__dirname, 'uploads')));

//cors 오류 방지를 위한 미들웨어
app.use(cors({
    origin: true,
    // origin: 'http://bitbirds.site',
    credentials: true,
}));
app.use(express.json()); //프론트에서 json 형태로 보낸 데이터를 req.body에 넣는 역할을 한다
app.use(express.urlencoded({ extended: true })); //프론트에서 form submit 방식으로 보낸 데이터를 req.body에 넣는 역할을 한다
//세션, 쿠키 사용을 위한 미들웨어들
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET, //이거 통해서 랜덤 토큰이 생성된다. 코드가 털리면 해킹 가능
    //서로 다른 pc간 쿠키값을 주고 받기 위한 설정
    cookie: {
        httpOnly: true,
        secure: false,
        domain: process.env.NODE_ENV === 'production' && '.bitbirds.site',
    }
}));
app.use(passport.initialize());
app.use(passport.session());

//api 설계
//api 설계, 라우터 추가
app.get('/', (req, res) => {
    res.send('hello express node mon!');
});

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);



//로컬호스트 3065로 서버를 실행, 이 서버에 프론트엔드 코드에서 접근해서 데이터를 주고받는다
//aws 80포트 뚤어둠
// let backPort = 100;
// if (process.env.NODE_ENV === 'production') {
//     backPort = 80;
// }
// else if (process.env.NODE_ENV === 'development') {
//     backPort = 3065;
// }

// app.listen(backPort, () => {
//     console.log('server on', backPort, process.env.NODE_ENV);
// });

app.listen(80, () => {
    console.log('server on at 80 port');
});