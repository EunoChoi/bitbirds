const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

//함수를 export 하는 파일
module.exports = () => {
    //req.login과 동시에 실행, 백서버가 id 정보만 저장하여 가진다
    passport.serializeUser((user, done) => {
        //done(서버에러, 성공정보);
        done(null, user.id);
    });
    //user의 id로 유저 정보를 db에서 불러온다
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({
                where: {
                    id: id
                }
            })
            //done(서버에러, 성공정보);
            console.log('id', user);
            done(null, user) //req.user에 user 정보가 들어간다
        }
        catch (error) {
            console.log(error);
            done(error);
        }
    });

    //passport/local.js 파일이 export 하는 함수를 실행, 로컬 로그인 전략
    local();
};