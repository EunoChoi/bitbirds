

const express = require('express');
const { Op } = require('sequelize');

const { Post, Comment, Image, User } = require('../models'); //Post model을 불러온다
//const { isLoggedIn } = require('./middlewares');

const router = express.Router();

//포스트 불러오기, method : post, url : backPort/posts
router.get('/', async (req, res, next) => {
    try {
        /*
        //limit, offset 방식 고전적 방식, 데이터 누실 발생
        const posts = await Post.findAll({
            limit : 10,
            offset : 100, //101~110
            order : [['createAt'],['DESC']],
        }); //10개의 게시글들을 가져온다
        */


        //lastId 조건 추가를 위한 where 객체
        const where = {};

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

            //작성자 정보
            //post 모델과 user 모델의 관계설정을 이미 해두었기 때문에
            //post모델의 데이터를 불러올때 user데이터를 포함해서 불러오면 관계에 알맞은 user 모델의 데이터가 추가되서 불어와진다

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