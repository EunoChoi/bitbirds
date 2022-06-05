import { all, fork, takeEvery, takeLatest, put, delay, call } from "redux-saga/effects";

//서버에게 요청을 하기위한 axios
import axios from 'axios';

//log in action, change nickname, delete follower
import {
    LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
    CHANGE_NICKNAME_REQUEST, CHANGE_NICKNAME_FAILURE, CHANGE_NICKNAME_SUCCESS,
    DELETE_FOLLOWER_REQUEST,
    DELETE_FOLLOWER_SUCCESS,
    DELETE_FOLLOWER_FAILURE
} from "../reducers/user";
//log out action
import { LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE } from "../reducers/user";
//sign up action
import { SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE } from "../reducers/user";
//follow action
import { FOLLOW_REQUEST, FOLLOW_SUCCESS, FOLLOW_FAILURE } from "../reducers/user";
//follwing action
import { UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS, UNFOLLOW_FAILURE } from "../reducers/user";
//load my info
import { LOAD_MY_INFO_REQUEST, LOAD_MY_INFO_SUCCESS, LOAD_MY_INFO_FAILURE } from "../reducers/user";
//load user info
import { LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE } from "../reducers/user";


//load my info
function loadMyInfoAPI() {
    return axios.get('/user');
}
function* loadMyInfo() {
    try {
        const result = yield call(loadMyInfoAPI);

        if (result.data) {
            yield put({
                type: LOAD_MY_INFO_SUCCESS,
                data: result.data,
            });
        }
        //세션에 로그인 정보가 없어서 서버로부터 null값을 받은 경우
        else {
            yield put({
                type: LOAD_MY_INFO_FAILURE,
                error: '세션에 로그인 정보가 없습니다.',
            });
        }
    }
    catch (err) {
        yield put({
            type: LOAD_MY_INFO_FAILURE,
            error: err.name,
        });
    }
}

//load other user info
function loadUserAPI(data) {
    return axios.get(`/user/${data.userId}`);
}
function* loadUser(action) {
    try {
        const result = yield call(loadUserAPI, action.data);

        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: LOAD_USER_FAILURE,
            error: err,
        });
    }
}


//log in
function logInAPI(data) {
    //백엔드 서버에 요청, sagas/index.js에서 baseurl을 설정했기때문에 /user/logIn만 적는다
    return axios.post('/user/login', data);
}
function* logIn(action) {

    try {
        //action.data가 logInAPI의 인자로 들어간다 , call(함수, 함수의 매개변수들..);
        //굳이 call이라는 effect를 사용하는 이유? call로 수행해야 작업이 끝날때까지 기다렸다가 다음 작업(동기)       
        //call 동기 함수 호출, call 내부 함수가 끝날때 까지 기다렸다가 리턴

        //응답값이 result로 들어간다. 
        const result = yield call(logInAPI, action.data);


        //결과를 받은 다음 받은 결과를 put(), put은 action을 dispatch
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data,
        });
    }
}

//log out
function logOutAPI() {
    return axios.post('/user/logout');
}
function* logOut() {
    try {
        yield call(logOutAPI);

        yield put({
            type: LOG_OUT_SUCCESS,
        });
    }
    catch (err) {
        yield put({
            type: LOG_OUT_FAILURE,
            error: err.response.data,
        });
    }
}
//sign up, action.data를 인자로 받아서 요청시 사용
function signUpAPI(data) {
    //axios를 통해서 브라우저에서 백엔드서버(로컬호스트 3065로 post 요청)
    //get, delete요청은 데이터를 못넘기는데 post, put, fatch 요청의 경우 데이터를 넘길 수 있다
    //data는 email, password를 지니는 객체이므로 route에서 req.body.email, req.body.password로 사용가능하다
    return axios.post('/user', data);
}
function* signUp(action) {
    //서버로 부터 받는 응답이 200번대인 경우
    try {
        //signUpApi 함수 실행을 action.data 인자를 가지고 실행
        //yield call을 사용해서 문법이 약간 다르다
        yield call(signUpAPI, action.data);

        yield put({
            type: SIGN_UP_SUCCESS,
        });
    }
    // 서버로 부터 받는 응답이 400번대, 500번대인 경우
    catch (err) {
        yield put({
            type: SIGN_UP_FAILURE,
            //res.status(403).send('error message');백엔드에서 보낸 값이 SIGN_UP_FAILURE 액션의 action.data.error 값이 된다.
            error: err.response.data,
        });
    }
}

//change nickname
function changeNicknameAPI(data) {
    return axios.patch(`/user/nickname`, data);
}
function* changeNickname(action) {
    try {
        const result = yield call(changeNicknameAPI, action.data);
        yield put({
            type: CHANGE_NICKNAME_SUCCESS,
            data: result.data,
        });
    }
    catch (error) {
        yield put({
            type: CHANGE_NICKNAME_FAILURE,
            error: error.response.data,
        });
    }
}


//follow
function followAPI(data) {
    return axios.patch(`user/${data.userId}/follow`);
}
function* follow(action) {
    try {
        const result = yield call(followAPI, action.data);

        yield put({
            type: FOLLOW_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: FOLLOW_FAILURE,
            error: err.response.data,
        });
    }
}

//unfollow
function unFollowAPI(data) {
    return axios.delete(`user/${data.userId}/unfollow`);
}
function* unFollow(action) {
    try {
        const result = yield call(unFollowAPI, action.data);

        yield put({
            type: UNFOLLOW_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: UNFOLLOW_FAILURE,
            error: err.response.data,
        });
    }
}
//delete follower
function deleteFollowerAPI(data) {
    return axios.delete(`user/${data.userId}/follower`);
}
function* deleteFollower(action) {
    try {
        const result = yield call(deleteFollowerAPI, action.data);

        yield put({
            type: DELETE_FOLLOWER_SUCCESS,
            data: result.data,
        });
    }
    catch (err) {
        yield put({
            type: DELETE_FOLLOWER_FAILURE,
            error: err.response.data,
        });
    }
}


// rootSaga 내부에서 실행되는 generator function들이 바로 실행되는 것이 아니라
// LOG_IN 액션이 끝날때까지 기다리고 login 함수를 실행하는 등 마치 이벤트 리스너처럼 작동한다. 
//이벤트 리스너와 비슷하지만 1회용이라는 치명적인 단점이 존재한다
//한번 로그인 했다가 로그아웃하면 이벤트 리스너가 사라지는것과 같음
//while을 사용해서 계속 작동하는 이벤트 리스너처럼 동작하도록 만들 수 있다
//또는 while 대신에 takeEvery를 사용한다
//takeEvery를 사용하면 모든 요청을 다 실행하므로 실수로 두번 클릭하는거 방지가 안된다
//방지하기 위해서 takeLatest를 사용한다
//앞에 완료된것도 취소되는것이 아니라 동시에 로딩중인 것들중 앞에것을 취소한다
//프론트에서만 앞 로딩중인 것을 취소
function* watchChangeNickname() {
    yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}
function* watchLogIn() {
    //LOG_IN_REQUEST action이 디스패치되면 먼저 reducer에서 상태가 변경, 
    //이후 generator function인 login 함수가 실행된다
    //console.log로 확인했더니 reducer 부분이 먼저 실행됨
    //LOG_IN_REQUEST 액션이 디스패치될때 data가 login의 인자로 따라간다

    yield takeLatest(LOG_IN_REQUEST, logIn);
}
function* watchLogOut() {
    //LOG_OUT_REQUEST action이 디스패치되면 먼저 reducer에서 상태가 변경,
    //이후 generator function인 logout 함수가 실행된다
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}
//SIGN_UP_REQUEST reducer action 발생시 signUp 함수 실행
function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}
function* watchFollow() {
    yield takeLatest(FOLLOW_REQUEST, follow);
}
function* watchUnFollow() {
    yield takeLatest(UNFOLLOW_REQUEST, unFollow);
}
function* watchDeleteFollower() {
    yield takeLatest(DELETE_FOLLOWER_REQUEST, deleteFollower);
}
function* watchLoadMyInfo() {
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}
function* watchLoadUser() {
    yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

//watchLogIn, watchLogOut function을 fork해서 
//LOG_IN_REQUEST, LOG_OUT_REQUEST action이 디스패치 되는지 감지하는 중(리스터와 비슷하게)
export default function* userSaga() {
    //login, logout을 takeLatest를 사용한 generator function으로 실행 대기
    yield all([
        //fork 비동기 함수 호출, fork 내부 함수 결과를 그냥 요청보내고 안기다리고 바로 다음 실행
        fork(watchChangeNickname),
        fork(watchLoadMyInfo),
        fork(watchLoadUser),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUp),
        fork(watchFollow),
        fork(watchUnFollow),
        fork(watchDeleteFollower),
    ]);
}