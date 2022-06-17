import { all, fork, call, delay, put, takeLatest } from "redux-saga/effects";

//서버에게 요청을 하기위한 axios
import axios from 'axios';

//retweet
import { RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE } from "../reducers/post";
//load post
import { LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE } from "../reducers/post";
//load user post
import { LOAD_USERPOST_REQUEST, LOAD_USERPOST_SUCCESS, LOAD_USERPOST_FAILURE } from "../reducers/post";
//image
import { UPLOAD_IMAGE_REQUEST, UPLOAD_IMAGE_SUCCESS, UPLOAD_IMAGE_FAILURE } from "../reducers/post";

//add post
import { ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE } from "../reducers/post";
//delete post
import { DELETE_POST_REQUEST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE } from "../reducers/post";

//add comment
import { ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE } from "../reducers/post";
//delete comment
import { DELETE_COMMENT_REQUEST, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAILURE } from "../reducers/post";

//like
import { LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE } from "../reducers/post";
//unlike
import { UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE } from "../reducers/post";
//to me
import { ADD_POST_TO_ME, DELETE_POST_TO_ME } from "../reducers/user";



//load post
function loadPostAPI(lastId) {
    return axios.get(`/posts?lastId=${lastId}`); //lastId가 null인경우 0을 사용
    //초기 로딩시 리덕스 state의 mainPosts의 길이가 0 
    //그냥 불러오기만 하면 되는거 같아서 따로 데이터를 서버에 안보내도 될거 같지만
    //서버에 지금까지 몇개의 게시글을 불러왔는지 알려주기 위한 값을 쿼리스트링 방식으로 보낸다
}
function* loadPost(action) {
    try {
        const result = yield call(loadPostAPI, action.lastId);
        //db에서 얻어낸 post 정보를 활용

        yield put({
            type: LOAD_POST_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: LOAD_POST_FAILURE,
            error: err.name,
        });
    }
}

//load user post
function loadUserPostAPI(data) {
    return axios.get(`/user/${data.userId}/posts?lastId=${data.lastId}`);
    //lastId가 null인경우 0을 사용
    //초기 로딩시 리덕스 state의 mainPosts의 길이가 0 
    //그냥 불러오기만 하면 되는거 같아서 따로 데이터를 서버에 안보내도 될거 같지만
    //서버에 지금까지 몇개의 게시글을 불러왔는지 알려주기 위한 값을 쿼리스트링 방식으로 보낸다
}
function* loadUserPost(action) {
    try {
        const result = yield call(loadUserPostAPI, action.data);
        //db에서 얻어낸 post 정보를 활용

        yield put({
            type: LOAD_USERPOST_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: LOAD_USERPOST_FAILURE,
            error: err.name,
        });
    }
}


//add post
function addPostAPI(data) {
    //FormData객체를 보내기 때문에 바로 data로 보내야 한다
    return axios.post('/post', data);
}
function* addPost(action) {
    //action에서 data꺼내서 addPostAPI로 전달된다, 흐름 파악 잘해야함
    try {
        //게시글 추가가 성공일때 추가한 게시글이 result에 담긴다. 
        const result = yield call(addPostAPI, action.data);
        console.log(result);

        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });

        // 유저 리듀서 상태 업데이트, 포스트 배열에 추가된 포스트 아이디가 추가된다
        yield put({
            type: ADD_POST_TO_ME,
            data: result.data.id,
        });
    }
    catch (err) {
        yield put({
            type: ADD_POST_FAILURE,
            error: err.response,
        });
    }
}

//retweet
function retweetAPI(data) {
    return axios.post(`/post/${data.postId}/retweet`, data);
}
function* retweet(action) {
    //action에서 data꺼내서 addPostAPI로 전달된다, 흐름 파악 잘해야함
    try {
        const result = yield call(retweetAPI, action.data);

        yield put({
            type: RETWEET_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: RETWEET_FAILURE,
            error: err.response,
        });
    }
}

//delete post
function deletePostAPI(data) {
    return axios.delete(`/post/${data}`);
}
function* deletePost(action) {
    try {
        const result = yield call(deletePostAPI, action.data.postId);


        //추가된 postId 이용해서 더미 포스트 생성하고 상태 업데이트
        yield put({
            type: DELETE_POST_SUCCESS,
            data: result.data.postId,
        });

        // 유저 리듀서 상태 업데이트, 포스트 배열에 추가된 포스트 아이디가 추가된다
        yield put({
            type: DELETE_POST_TO_ME,
            data: result.data.postId,
        });
    }
    catch (err) {
        yield put({
            type: DELETE_POST_FAILURE,
            error: err.response.data,
        });
    }
}
//add Comment
function addCommentAPI(data) {
    //url에 comment가 달리는 post의 id를 추가한다
    return axios.post(`/post/${data.postId}/comment`, data);
}
function* addComment(action) {
    //action에서 data꺼내서 addPostAPI로 전달된다, 흐름 파악 잘해야함
    try {
        const result = yield call(addCommentAPI, action.data);
        console.log(result);

        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: err.response.data,
        });
    }
}

//upload image
function uploadImageAPI(data) {
    //form data를 원형으로 보내야하기 때문에 보내는 데이터를 객체로 변환하는 과정에 중간에 발생하면 안된다
    return axios.post(`/post/images`, data);
}
function* uploadImage(action) {
    try {
        const result = yield call(uploadImageAPI, action.data);

        yield put({
            type: UPLOAD_IMAGE_SUCCESS,
            data: result.data,
        });

    }
    catch (err) {
        yield put({
            type: UPLOAD_IMAGE_FAILURE,
            error: err.response.data,
        });
    }
}


//like Post, 좋아요 기능은 url 뭐로 설정 하지? /post/postid/like
function likePostAPI(data) {
    //수정이므로 patch 메소드를 사용
    //백엔드로 전달되는 값이 객체가 아닌 단순 값이여서 url만으로 데이터 파악 가능, 굳이 data를 전달해줄 필요가 없다
    //용량을 아끼기 위해 params 사용, req.params.~ 사용
    return axios.patch(`/post/${data}/like`);
}
function* likePost(action) {
    try {
        const result = yield call(likePostAPI, action.data);//action.data에 post.id 들어있다
        //result = { PostId : , UserId : }
        yield put({
            type: LIKE_POST_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: LIKE_POST_FAILURE,
            error: err.response,
        });
    }
}
//unlike Post
function unLikePostAPI(data) {
    return axios.delete(`/post/${data}/like`);
}
function* unLikePost(action) {
    try {
        const result = yield call(unLikePostAPI, action.data);//action.data에 post.id 들어있다

        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: UNLIKE_POST_FAILURE,
            error: err.response,
        });
    }
}

function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet);
}
//보통은 takeLatest로 사용하고 서버에서 중복된 데이터를 검증함
function* watchloadPost() {
    yield takeLatest(LOAD_POST_REQUEST, loadPost);
}
function* watchloadUserPost() {
    yield takeLatest(LOAD_USERPOST_REQUEST, loadUserPost);
}
function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);//throttle n초동안 딱 한번만 실행가능, throttle 사용해서 오류 발생했었다
}
function* watchDeletePost() {
    yield takeLatest(DELETE_POST_REQUEST, deletePost);
}
function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
function* watchDeleteComment() {
    yield takeLatest(DELETE_COMMENT_REQUEST, deletePost);
}
function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnLikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}

function* watchUploadImage() {
    yield takeLatest(UPLOAD_IMAGE_REQUEST, uploadImage);
}

export default function* postSaga() {
    yield all([
        fork(watchRetweet),

        fork(watchloadPost),
        fork(watchloadUserPost),

        fork(watchAddPost),
        fork(watchDeletePost),

        fork(watchAddComment),
        fork(watchDeleteComment),

        fork(watchLikePost),
        fork(watchUnLikePost),

        fork(watchUploadImage),
    ]);
}