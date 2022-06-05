import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

//reducers
import user from './user';
import post from './post';


//async action creator [비동기 액션 생성자], redux saga할때 나온다


//action creator, dispatch에서 사용하면 된다
export const action_login = (data) => {
    return {
        type: 'LOG_IN',
        data,
    };
}
export const action_logout = () => {
    return {
        type: 'LOG_OUT',
    };
}

// index reducer file 따로 안만들고 바로 combine에서 적은 경우
// const rootReducer = combineReducers({
//     index: (state = {}, action) => {
//         switch (action.type) {
//             case HYDRATE:
//                 console.log('HYDRATE', action);
//                 return { ...state, ...action.payload };
//             default:
//                 return state;
//         }
//     },
//     user,
//     post,
// });
const rootReducer = (state, action) => {
    switch (action.type) {
        case HYDRATE:
            console.log('HYDRATE', action);
            return action.payload;
        default: {
            const combineReducer = combineReducers({
                user,
                post
            });
            return combineReducer(state, action);
        }
    }
}



export default rootReducer;
