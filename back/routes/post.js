const express = require('express');
const { Post, Comment, Image, User, Hashtag } = require('../models'); //Post model을 불러온다
const { isLoggedIn } = require('./middlewares');

const multer = require('multer');
const path = require('path'); //path는 노드에서 기능하는 기능
const fs = require('fs');//파일 시스템 조작 가능한 모듈

const router = express.Router();

try {
    //upload폴더가 존재하는지 확인
    fs.accessSync('uploads');
} catch (err) {
    console.log('upload folder do not exist')
    fs.mkdirSync('uploads');
}


//multer를 이용해서 이미지 업로드
const upload = multer({//객체를 옵션으로 가진다
    //업로드한 이미지를 어디에 저장할지, 일단 디스크에 저장
    storage: multer.diskStorage({
        destination(req, file, done) { //저장위치 결정 함수
            done(null, 'uploads');
        },
        filename(req, file, done) { //파일명 결정 함수
            const ext = path.extname(file.originalname); //파일 확장자 추출
            const basename = path.basename(file.originalname, ext); //path에서 파일명 추출
            done(null, basename + '_' + new Date().getTime() + ext); //파일명 + 시간 + 확장자 
        }
    }),
    limits: {
        fileSize: 20 * 1024 * 1024 //20MB, MB=2^10*바이트, KM=2^3*바이트
    },

})
//이미지 업로드, 포스트 올릴때 글과 이미지 올리는 라우터가 따로 존재한다. 
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => { //한번의 파일첨부에서 여러개 올릴때 array
    //router.post('/images', isLoggedIn, upload.single('image'), async (res, req, next) //한번의 파일첨부에서 1개 올릴때 array
    // router.post('/images', isLoggedIn, upload.fields('image'), async (res, req, next) //여러번의 파일첨부에서 여러개 올릴때 array
    //front/components/PostInputForm.js의 이미지파일 input 태그로 이미지를 올리면 위 코드 upload.array로 올라간다
    //멀터의 array 메소드를 통해서 이미지 폼 데이터의 이름을 결정, 저장 위치를 결정, 사이즈 결정 등이 이루어진다
    //멀터 거치면서 로컬에 이미지 파일이 저장되고 변환된 파일명을 프론트에 응답해 준다
    //응답한 파일명들로 state가 업데이트 된다

    console.log(req.files);
    res.json(req.files.map((v) => v.filename));//req.files에 이미 업로드된 이미지 파일의 정보가 담겨있다

});
//포스트 작성
//데이터를 추가할때 데이터의 형태를 갖추는 모든 모델 추가 필요하다(include)
//FormData로 받기 때문에 multer 즉 upload 사용, upload.array or fileds면 파일들을 받아오고 req.files에 담긴다, none은 텍스트고 req.body에 담긴다
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { //post, /post
    try {
        //클라이언트로 보내주기 위해서 post에 추가된 요소를 저장한다
        const post = await Post.create({
            //saga에서 보내는 데이터의 이름이 content여야 한다
            content: req.body.content,
            UserId: req.user.id,//로그인 했기 때문에 req.user에 user 정보가 들어있다, passport/index.js에서 
        });

        //게시글 텍스트에서 해쉬태그를 추출
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        //추출한 해쉬태그 모델 데이터 생성
        if (hashtags) {
            //await Promise.all(hashtags.map((tag)=>Hashtag.create({name : tag.slice(1).toLowerCase()})));
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
                where: { content: tag.slice(1).toLowerCase() }
            })));

            //게시글에 해쉬태그 연결
            //result가 [[태그1, true], [태그2, true], ...] 형식이므로 v[0]로
            //덩어리가 포스트에 해쉬태그로 연결됨
            await post.addHashtags(result.map((v) => v[0]));
        }


        //이미지 경로들을 db에 추가한다
        if (req.body.image) {//imagePaths로 부터 받은 path들이 담겨있다
            //이미지가 복수인 경우
            if (Array.isArray(req.body.image)) {
                //이미지 모델에 데이터 추가
                //Promise.all?
                const images = await Promise.all(req.body.image.map((i) => Image.create({ src: i })));
                //생성된 포스트 모델 데이터에 이미지 모델을 연결
                await post.addImages(images);
            }
            //이미지가 하나인 경우
            else {
                //이미지 모델에 데이터 추가
                const image = await Image.create({ src: req.body.image });
                //생성된 포스트 모델 데이터에 이미지 모델을 연결
                await post.addImages(image);
            }
        }

        //image, content 모두 포함된 포스트를 id를 통해 찾는다
        const fullPost = await Post.findOne({
            where: {
                id: post.id,
            },
            include: [{
                model: Image
            },
            {
                model: Comment,
                include: [{
                    model: User, //댓글 작성자
                    attributes: ['id', 'nickname'],
                }]
            },
            {
                model: User, //게시글 작성자
                attributes: ['id', 'nickname'],
            },
            {
                model: User, //좋아요 누른 사람
                as: 'Likers', //모델에서 가져온대로 설정
                attributes: ['id', 'nickname'],
            },
            ]
        })
        //image, content가 추가된 포스트 모델의 row를 리턴,
        //리턴 값으로 상태를 업데이트해서 브라우저에 띄어진다
        res.status(201).json(fullPost); //생성 성공 status 201
    } catch (error) {
        console.log('back error');
        console.error(error);
        next(error);
    }
});

//리트윗
router.post('/:postId/retweet', async (req, res, next) => {
    try {
        //우선 리트윗 버튼을 누른 post 찾기
        const targetPost = await Post.findOne({
            where: {
                id: req.params.postId,
            },
            include: [
                {
                    model: Post,
                    as: 'Retweet',
                }
            ],
        })
        //존재하지 않은 포스트의 리트윗 버튼을 누른경우(백도어로 접근시)

        if (!targetPost) {
            return res.status(403).send('postId가 올바르지 않습니다.');
        }

        //자신의 게시글의 리트윗 버튼을 누른 경우
        //include로 Retweet을 포함시켰기때문에 Retweet 모델에 접근가능,물론 RetweetId로 비교해서 처리도 가능
        //근데 굳이 RetweetId로 findOne해서 포스트찾고 그 게시글의 UserId를 찾는건 매우 비효율적, 바로 모델에 접근해서 확인하자
        //헷갈리지 말아야 할 사항 RetweetId는 오리진 즉 원본 게시글의 Id
        if ((targetPost.UserId === req.user.id) || (targetPost.Retweet && targetPost.Retweet.UserId === req.user.id)) {
            return res.status(403).send('자신의 게시글 혹은 자신의 게시글이 리트윗된 게시글 입니다');
        }

        //origin postId는 targetpost의 id 혹은 targetpost의 retweetid이다
        //타겟의 오리진 게시글이 있다면 그것의 아이디를 취함 아니면 그냥 타겟의 아이디를 취함
        const originPostId = targetPost.RetweetId || targetPost.id;

        //내가 해당 게시글을 리트위한적이 있는지 확인, 리트윗은 한번만 가능하도록 한다
        const isMyRetweetEver = await Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: originPostId,
            }
        })
        if (isMyRetweetEver) {
            return res.status(403).send('이미 리트윗한 게시글 입니다.');
        }

        //리트윗 포스트 생성, 리트윗을 만들면 리트윗 게시글의 RetweetId는 항상 원본id를 가르킨다
        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: originPostId,
            content: req.body.content,
        })

        //프론트에 넘겨주기 위해 오리진 포스트의 내용을 추가한다, include 
        const fullRetweet = await Post.findOne({
            where: {
                id: retweet.id,
            },
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
                    model: User, //게시글 작성자
                    attributes: ['id', 'nickname'],
                },
                {
                    model: User, //좋아요 누른 사람
                    as: 'Likers', //모델에서 가져온대로 설정
                    attributes: ['id', 'nickname'],
                },
                {
                    model: Comment,
                    include: [{
                        model: User, //댓글 작성자
                        attributes: ['id', 'nickname'],
                    }]
                }
            ]
        });
        return res.status(200).json(fullRetweet);

    } catch (err) {
        console.log(err);
        next(err);
    }
});

//포스트 삭제, 아직 완료 안함, async 까먹지말자!
router.delete('/:postId', async (req, res, next) => { //delete, /post/1
    try {
        // 해당 postId의 포스트 존재하는지 확인
        const post = await Post.findOne({
            where: {
                id: req.params.postId,
            }
        });
        if (!post) res.status(401).send('존재하지 않은 게시글입니다.');

        await Post.destroy({
            where: {
                id: req.params.postId, //params로 얻은 postId로 post 모델에서 해당하는 post를 찾는다
                UserId: req.user.id, //포스트 작성자와 현재 로그인한 유저의 id가 같은지 확인
            }
        })
        res.status(200).json({ postId: parseInt(req.params.postId) });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});


//댓글 작성
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => { //post, /post/1/comment
    // ':이름'을 입력해서 url로 파라미터를 받을 수 있다
    try {
        //postId에 맞는 게시글이 실제로 존재하는지 확인
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        //postId에 맞는 게시글이 존재 하지 않는 경우
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다');
        }

        //Comment 모델에 요소 추가
        const comment = await Comment.create({
            content: req.body.content,
            PostId: post.id,//req.params.postId 사용하면 문자열로 값이 정해진다
            UserId: req.user.id,
        });

        const fullComment = await Comment.findOne({
            where: {
                id: comment.id,
            },
            include: [{
                model: User,
            }],
        });

        res.status(201).json(fullComment); //생성 성공 status 201

    } catch (error) {
        //이때 에러나면 상태 500을 보냄
        console.error(error);
        next(error);
    }
});
//댓글 삭제, 구현 아직 X
router.delete('/:postId/comment/:commentId', isLoggedIn, async (req, res, next) => { //delete, /post/1/comment/2
    res.json({ test: true });
});


//포스트 좋아요, 좋아요를 어떤식으로 설정해서 표현가능할까?
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { //patch, /post/1/like
    try {
        //postid를 통해 게시글 존재여부 확인 
        const post = await Post.findOne({ where: { id: req.params.postId } })
        if (!post) {
            res.status(400).send('post가 존재하지 않음');
        }
        //관계 메소드 사용
        await post.addLikers(req.user.id); //현재 포스트에 로그인된 나를 좋아요한 사람에 추가
        res.json({ PostId: post.id, UserId: req.user.id });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
//포스트 좋아요 취소
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => { //delete, /post/1/like
    try {
        //postid를 통해 게시글 존재여부 확인 
        const post = await Post.findOne({ where: { id: req.params.postId } })
        if (!post) {
            res.status(400).send('post가 존재하지 않음');
        }
        //관계 메소드 사용
        await post.removeLikers(req.user.id); //현재 포스트에 로그인된 나를 좋아요한 사람에 추가
        res.json({ PostId: post.id, UserId: req.user.id });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});




module.exports = router;