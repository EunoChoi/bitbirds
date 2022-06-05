import { all, fork } from 'redux-saga/effects';


import postSaga from './post';
import userSaga from './user';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;

//generator function이용
export default function* rootSaga() {
    //처음 .next()를 실행하면 all을 리턴
    //all은 배열을 받고, 배열 내부 모든 것을 실행[동시 실행 가능하도록]
    //fork는 함수를 실행, fork랑 call은 다르다
    //모두 실행은 하는데 각 함수가 특정 액션이 끝나기를 기다리기 때문에 이벤트 리스너 처럼 동작

    //saga는 합치는게 reducer보다 비교적 간단하다
    yield all([
        fork(userSaga),
        fork(postSaga),
    ]);
}
