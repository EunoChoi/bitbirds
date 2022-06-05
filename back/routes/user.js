const express = require('express');
const { Op } = require('sequelize');

const bcrypt = require('bcrypt');
const passport = require('passport');

//db를 export하는 models/index.js파일에서 시퀄라이즈로 생성한 모델을 불러온다, db.User를 구조분해 할당해서 User를 불러왔다
const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


const router = express.Router();

//라우터의 요청 처리는 router.메소드(url, 미들웨어, 미들웨어...); 꼴로 이루어진다
//미들웨어안에 인자가 비어있는 next()가 적혀있다면 next()접근시 다음 미들웨어로 넘어가게 된다.
//따라서 isLoggedIn 미들웨어가 중간이 들어있다면 로그인이 되어있을때만 그 다음 미들웨어를 실행한다.

//회원가입
router.post('/', isNotLoggedIn, async (req, res, next) => { //post, /user
    //await을 사용해서 User.create가 모두 끝난 다음에야 다음줄이 실행, 비동기로 꼬이는 것 방지
    //비동기가 사용되는 경우는 try로 감싸서 에러를 검출하도록 한다
    try {
        //회원가입 정보 저장 전에 중복이 있는지, 회원가입이 가능한지 확인해야 한다
        //똑같은 이메일을 사용한 유저가 존재한다면 찾아서 exUser에 넣는다
        const exUser = await User.findOne({
            where: {
                //saga로 부터 보내진 data.email을 req.body.email로 사용 가능. 중간에 미들웨어가 바꿔주었다
                email: req.body.email,
            }
        });
        //기존 유저가 존재한다면
        if (exUser) {
            //리턴을 써서 한번의 응답으로 라우터가 종료되도록
            //응답에는 데이터를 보낼 수 도 있지만 상태코드도 보낼 수 있다. 200:성공, 300번대 : 리다이렉트, 400번대 : 클라에러, 500번대 : 서버에러
            return res.status(403).send('이미 사용중인 이메일입니다');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); //숫자는 10~13사용 클수록 보안성이 좋아지지만 생성 시간도 길어진다
        await User.create({
            //req.body는 요청시 받은 data, 미들웨어를 추가해야 사용가능하다
            email: req.body.email,
            nickname: req.body.nickname,
            //password : req.body.password, //비밀번호를 그대로 저장하면 보안이 위험, bcrypt 라이브러리로 해쉬화해서 저장한다. 
            password: hashedPassword,
        });
        //차단은 브라우저가 차단하는건데 허용하도록 하는것은 서버에서,,,
        // 백엔드 서버로 오는 요청이 모든 도메인에서 오는것 허용
        // 미들에어 설치로 더 쉽게 cors 문제 해결 가능
        // res.setHeader('Access-Control-Allow-Origin', '*'); 
        res.status(201).send('ok');//성공 status 201, 생성됨을 뜻한다
    }
    catch (error) {
        console.log(error);
        next(error);//next를 통해서 에러를 보내면 브라우저에서 에러 확인 가능, 서버에러이므로 status 500이다
    }

});

//로그인 정보 불러오기(쿠키로 새로고침시 로그인 유지)
router.get('/', async (req, res, next) => { // get, /user
    try {
        //로그인 쿠키가 브라우저에 존재한다면 req.user에 정보가 담겨있지만
        //로그인 쿠키가 브라우저에 없다면 오류가 난다. 따라서 if로 확실하게 거른다
        if (req.user) {
            //fullUser를 가져온다
            const fullUserWithoutPassword = await User.findOne({

                where: {
                    id: req.user.id,// id로 찾은 유저 정보에 정보를 추가한다
                },

                // attribute : ['id', 'nickname', 'email'], // id, nickname, email만
                attributes: {
                    exclude: ['password']// 비밀번호만 빼고 모두
                },
                include: [
                    {
                        model: Post,
                        attributes: ['id'],//id만 불러온다
                    },
                    {
                        model: User,
                        as: 'Followings',
                        attributes: ['id', 'nickname'], //id, ninckname만 불러온다
                    },
                    {
                        model: User,
                        as: 'Followers',
                        attributes: ['id', 'nickname'], //id, ninckname만 불러온다
                    }]
            })
            return res.status(200).json(fullUserWithoutPassword);
        }
        else {
            return res.status(200).json(null);
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
})

//다른 유저 정보 가져오기 
router.get('/:userId', async (req, res, next) => { // get, /user/1
    try {
        //fullUser를 가져온다
        const fullUserWithoutPassword = await User.findOne({
            where: {
                id: req.params.userId,
            },
            attributes: {
                exclude: ['password']// 비밀번호만 빼고 모두
            },
            include: [
                {
                    model: Post,
                    attributes: ['id'],//id만 불러온다
                },
                {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'], //id, ninckname만 불러온다
                },
                {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'], //id, ninckname만 불러온다
                }]
        })
        const data = fullUserWithoutPassword.toJSON();
        //개수로 값 변경한 json으로 응답
        data.Posts = data.Posts.length;
        data.Followers = data.Followers.length;
        data.Follwings = data.Followings.length;

        return res.status(200).json(data);

    } catch (error) {
        console.error(error);
        next(error);
    }
})

//로그인 (passport 사용)
router.post('/login', isNotLoggedIn, (req, res, next) => {// 모듈 확장 // post, /user/login
    // 요청을 받았을때 req.body.email, req.body.password도 딸려왔다. 이 값으로 로그인 전략 수행
    // (백엔드 에러,성공정보,클라이언트 에러) done값 이용해서 로그인 에러상태 확인 후 처리
    passport.authenticate('local', (err, user, info) => {
        //local 전략을 통해서 로그인 시도
        //로그인 성공했다면 user에 사용자 정보가 들어있다
        //백엔드에서 에러 발생했는가?
        if (err) {
            console.error(err);
            next(err);
        }
        //클라이언트에서 에러 발생했는가?
        if (info) {
            //클라이언트에서 로그인 잘못한경우 401 상태로 응답한다
            //console.error(info);
            return res.status(401).send(info.reason);
        }

        //req.setHeader('쿠키','abcd');
        //req.login -> passport를 통한 실질적인 로그인, req.login, passport.serializeUser 실행되면서 서버가id만 들고있게됨
        //req.login(유저정보, error callback function)
        return req.login(user, async (loginErr) => {
            if (loginErr) {
                console.log(loginErr);
                return next(loginErr);
            }
            // await 빠트리면 오류난다
            const fullUserWithoutPassword = await User.findOne({

                where: {
                    id: user.id,// id로 찾은 유저 정보에 정보를 추가한다
                },

                // attribute : ['id', 'nickname', 'email'], // id, nickname, email만
                attributes: {
                    exclude: ['password']// 비밀번호만 빼고 모두
                },
                include: [
                    {
                        model: Post,
                        attributes: ['id'],//id만 불러온다
                    },
                    {
                        model: User,
                        as: 'Followings',
                        attributes: ['id', 'nickname'], //id, ninckname만 불러온다
                    },
                    {
                        model: User,
                        as: 'Followers',
                        attributes: ['id', 'nickname'], //id, ninckname만 불러온다
                    }]
            })
            //서버통신하여 서버에서 로그인이 성공했다는 정보를 클라에 응답
            return res.status(200).json(fullUserWithoutPassword);//사용자 정보를 클라이언트로 보낸다
        })
    })(req, res, next);
    // 왜 뒤에 왜 붙지?, passport.authenicate()가 함수를 리턴해주기 때문에 그 함수를 다시 실행하기 위한 매개변수??
});

//로그아웃
router.post('/logout', isLoggedIn, (req, res) => { // post, /user/logout
    req.logout();
    req.session.destroy();
    res.send('ok');
});

//닉네임 변경, 변결할 닉네임을 데이터로 받았겠지? 아마 req.body.nickname에 담길듯
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    console.log('nick' + req.body.nickname);
    try {
        await User.update({ //로그인된 user id로 유저 모델에서 유저를 찾는다
            nickname: req.body.nickname
        }, {
            where: {
                id: req.user.id,
            }
        });

        res.status(200).json({ nickname: req.body.nickname });

    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

//follow
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {// /user/2/follow
    try {
        //follow 할 대상 유저 검색
        const user = await User.findOne({
            where: {
                id: req.params.userId,
            }
        })
        await user.addFollowers(req.user.id);

        res.status(200).json({ id: parseInt(req.params.userId, 10) });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
})

//unfollow
router.delete('/:userId/unfollow', isLoggedIn, async (req, res, next) => {// /user/2/unfollow
    try {
        //unfollow 할 대상 유저 검색
        const user = await User.findOne({
            where: {
                id: req.params.userId,
            }
        })
        //관계메소드 사용, 상대방의 팔로워 리스트에서 자신을 삭제
        await user.removeFollowers(req.user.id);

        res.status(200).json({ id: parseInt(req.params.userId, 10) });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
})

// delete follower
router.delete('/:userId/follower', isLoggedIn, async (req, res, next) => {// /user/2/follower
    try {
        //unfollow 할 대상 유저 검색
        const user = await User.findOne({
            where: {
                id: req.params.userId,
            }
        })
        //관계메소드 사용, 상대방의 팔로잉 리스트에서 자신을 삭제
        await user.removeFollowings(req.user.id);

        res.status(200).json({ id: parseInt(req.params.userId, 10) });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
})

//유저 포스트 불러오기
router.get('/:userId/posts', async (req, res, next) => {
    try {

        //lastId 조건 추가를 위한 where 객체, userId 조건도 추가
        const where = { UserId: parseInt(req.params.userId, 10) };

        //초기로딩이 아닐때, 초기 로딩일때는 lastId가 0이므로 false, 쿼리스트링 이용
        if (parseInt(req.query.lastId, 10)) {
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
        }


        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC'], //불러온 comment도 정렬
            ],
            include: [
                {
                    model: Post,
                    as: 'Retweet', //RetweetId로 관계된 Post 불러옴
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'nickname'],
                        },
                        {
                            model: Image,
                        },
                    ],
                },
                {
                    model: User,//게시글 작성자
                    attribute: ['id', 'nickname'],
                },
                {
                    model: User, //좋아요 누른 사람
                    as: 'Likers', //모델에서 가져온대로 설정
                    attribute: ['id', 'nickname'],
                },
                {
                    model: Image, //게시글의 이미지
                },
                {
                    model: Comment, //게시글에 달린 댓글
                    include: [
                        {
                            model: User, //댓글의 작성자
                            attribute: ['id', 'nickname'],
                        }
                    ],
                }
            ],
        });
        res.status(201).json(posts);//saga에서 데이터를 받는다
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;