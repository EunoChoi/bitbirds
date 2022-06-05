const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');//구조분해할때 이름 변경 Strategy -> LocalStrategy
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
    //passport.use(new LocalStrategy(객체, callback function);
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        //email은 req.body.email, password는 req.body.password를 뜻함
        //앞서 정한 nameField와, passwordField로 로그인 전략 수행
        try {
            //입력한 email이 서버에 존재하는지 확인
            const user = await User.findOne({
                where: {
                    email: email,
                }
            });
            //이메일이 일치하는 사용자가 없는 경우
            if (!user) {
                //passport에서는 응답을 보내주지는 않고 일단 done으로 결과를 판단
                return done(null, false, { reason: '존재하지 않는 이메일입니다.' })
                //done(서버 에러, 성공실패, 클라이언트 에러)으로 값을 전달
                //login api에서 사용, passport.athentication('로컬', (done에서 전달받은 값)=>{매개변수 이용 함수}})
            }
            //email이 일치로 찾았던 user의 password와 입력된 password를 비교
            const result = await bcrypt.compare(password, user.password);
            //비밀번호가 일치한 경우
            if (result) {
                //user 정보를 가지고 routes/user.js 에서 done 콜백 시작 
                return done(null, user, null);
            }
            //비밀번호가 일치하지 않는 경우
            return done(null, false, { reason: '비밀번호가 올바르지 않습니다.' });
        }
        //비동기 과정중 에러 발생, 즉 서버에러 발생한 경우
        catch (error) {
            console.error(error);
            return done(error, null, null);
        }

    }));
};