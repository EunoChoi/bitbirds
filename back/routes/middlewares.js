//미들웨어를 직접 만든다, 미들웨어는 (req, res, next)를 통해서 동작

//로그인 되어있는지 확인, 로그인이 되어있을때만 로그아웃이 가능하도록
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {//req.user로 검사도 가능, 로그인한 상태이면 req.user안에 user 정보가 들어가있다
        console.log('로그인 상태');
        next();//인자에 에러가 들어있으면 에러를 처리하러 가지만 그냥 next()로 사용되면 다음 미들웨어로 간다
    } else {
        res.status(401).send('로그인이 필요합니다.');
    }
};
//로그아웃 되어있는지 확인, 로그아웃이 되어있을때만 로그인이 가능하도록
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('로그아웃 상태');
        next();
    } else {
        res.status(401).send('로그인을하지 않은 사용자만 접근 가능합니다.');
    }
};