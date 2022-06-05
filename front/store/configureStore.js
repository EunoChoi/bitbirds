
import { createWrapper } from 'next-redux-wrapper';
//redux
import { compose, applyMiddleware } from 'redux';
import { createStore } from 'redux';
//redux-devtools-extension
import { composeWithDevTools } from 'redux-devtools-extension';
// redux saga
import createSagaMiddleware from '@redux-saga/core';


//redux thunk
// import thunkMiddleware from 'redux-thunk';

//reducers/index.js 내부 rootReducer 함수가 존재하면 reducer를 가져온다
import rootReducer from '../reducers';
//rootSaga, rootReducer처럼 sagas/index.js를 만들고 rootSaga 코드 작성
import rootSaga from '../sagas';


//thunk에서 착안해서 커스텀 미들웨어 생성, action이 실행되기 전에 콘솔로그에 출력
const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    console.log('loggerMiddleware : ', action);
    return next(action);
}

const configureStore = () => {
    //middle ware
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware, loggerMiddleware];



    //개발모드에선 composeWithDevTools state변화 히스토리를 살펴볼 수 있다
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(applyMiddleware(...middlewares));


    //state와 reducer를 포함하는 것이 store
    //reducers/index.js 내부 rootReducer를 인자로 store를 만든다, enhancer인자로 middleWare 추가
    const store = createStore(rootReducer, enhancer);
    //rootSaga 실핼되도록 연결
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};


//reducer를 통해서 생성한 store를 이용해서 컴포넌트들을 감싸줄 wrapper를 만든다
const wrapper = createWrapper(configureStore,
    {
        debug: process.env.NODE_ENV === 'development',
    }
);

export default wrapper;
