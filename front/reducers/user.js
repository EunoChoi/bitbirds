import produce from 'immer';

//user state
const initialState = {
    loadUserLoading: false, //다른 유저 정보 확인하기 위함
    loadUserDone: false,
    loadUserError: null,

    loadMyInfoLoading: false, //새로고침 시 로그인정보를 불러오는 state
    loadMyInfoDone: false,
    loadMyInfoError: null,

    logInLoading: false, //로그인 진행중, true일때 로딩창을 띄우기 위한 state
    logInDone: false,
    logInError: null,

    logOutLoading: false, //로그아웃 진행중, true일때 로딩창을 띄우기 위한 state
    logOutDone: false,
    logOutError: null,

    signUpLoading: false, //회원가입 진행중
    signUpDone: false,
    signUpError: null,

    followLoading: false, //팔로우 진행중
    followDone: false,
    followError: null,

    unFollowLoading: false, //언팔로우 진행중
    unFollowDone: false,
    unFollowError: null,

    deleteFollowerLoading: false, //언팔로우 진행중
    deleteFollowerDone: false,
    deleteFollowerError: null,

    changeNicknameLoading: false,
    changeNicknameDone: false,
    changeNicknameError: null,

    me: {
        // email: null,
        // password: null,
        // nickname: null,
        // Posts: [], // {postId : number}가 들어간다
        // Followers: [], //{ : string}가 들어간다
        // Followings: [], //{ : string}가 들어간다
    },
    otherUser: {},
    signUpDate: {},
    loginDate: {},
}




//action 정리

//load my info
export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

//load user
export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

//log in
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
//log out
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';
//sign up
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
//follow
export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';
//following
export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';
//delete follower
export const DELETE_FOLLOWER_REQUEST = 'DELETE_FOLLOWER_REQUEST';
export const DELETE_FOLLOWER_SUCCESS = 'DELETE_FOLLOWER_SUCCESS';
export const DELETE_FOLLOWER_FAILURE = 'DELETE_FOLLOWER_FAILURE';
//change nickname
export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';
//add, DELETE post
export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const DELETE_POST_TO_ME = 'DELETE_POST_TO_ME';





//컴포넌트, dispatch에서 사용할 action creator function
//log in
export const actionLogInRequest = (data) => {
    return {
        type: LOG_IN_REQUEST,
        data,
    };
}
//log out
export const actionLogOutRequest = () => {
    return {
        type: LOG_OUT_REQUEST,
    };
}
//성공, 실패 액션들은 saga에서 put에서 사용하기 때문에 dispatch를 위한 create action function을 만들필요가 없다

//sign up
export const actionSignUpRequest = () => {
    return {
        type: SIGN_UP_REQUEST,
    };
}

//follow
export const actionFollowRequest = () => {
    return {
        type: FOLLOW_REQUEST,
    };
}

//unfollow
export const actionUnFollowRequest = () => {
    return {
        type: UNFOLLOW_REQUEST,
    };
}




//user reducer, (이전상태, 액션) => 다음상태
const user = (state = initialState, action) => {
    //immer를 사용해서 state 대신 draft 이용,
    //draft로 불변성 어기듯이 코드 작성하면 불변성을 알아서 지켜준다. 
    return produce(state, (draft) => {
        switch (action.type) {

            //load my Info
            case LOAD_MY_INFO_REQUEST: {
                draft.loadMyInfoLoading = true;
                draft.loadMyInfoDone = false;
                draft.loadMyInfoError = null;
                break;
            }
            case LOAD_MY_INFO_SUCCESS: {
                // 로그인 성공했을때 요청해서 받아온 데이터를 User.me에 담는다
                draft.me = action.data;

                draft.loadMyInfoLoading = false;
                draft.loadMyInfoDone = true;
                draft.loadMyInfoError = null;

                draft.logInLoading = false;
                draft.logInDone = true;
                draft.logInError = null;
                break;
            }
            case LOAD_MY_INFO_FAILURE: {
                draft.loadMyInfoLoading = false;
                draft.loadMyInfoDone = false;
                draft.loadMyInfoError = action.error;
                break;
            }

            //load other user info
            case LOAD_USER_REQUEST: {
                draft.loadUserLoading = true;
                draft.loadUserDone = false;
                draft.loadUserError = null;
                break;
            }
            case LOAD_USER_SUCCESS: {
                // 로그인 성공했을때 요청해서 받아온 데이터를 User.me에 담는다
                draft.otherUser = action.data;

                draft.loadUserLoading = false;
                draft.loadUserDone = true;
                draft.loadUserError = null;
                break;
            }
            case LOAD_USER_FAILURE: {
                draft.loadUserLoading = false;
                draft.loadUserDone = false;
                draft.loadUserError = action.error;
                break;
            }

            //postToMe
            case ADD_POST_TO_ME: {
                draft.me.Posts.unshift({ id: action.data.postId });
                break;
            }
            case DELETE_POST_TO_ME: {
                const deleteIndex = draft.me.Posts.findIndex((v) => (v.id) === action.postId);
                draft.me.Posts.splice(deleteIndex, 1);
                break;
            }

            //logIn
            case LOG_IN_REQUEST: {
                draft.logInLoading = true;
                draft.logInError = null;
                draft.logInDone = false;
                break;
            }
            case LOG_IN_SUCCESS: {
                draft.me = action.data;

                draft.logInLoading = false;
                draft.logInDone = true;
                draft.logInError = null;
                break;
            }
            case LOG_IN_FAILURE: {
                alert(action.error);

                draft.me = null;

                draft.logInLoading = false;
                draft.logInDone = false;
                draft.logInError = action.error;
                break;
            }

            //logOut 
            case LOG_OUT_REQUEST: {
                draft.logOutLoading = true;
                draft.logOutError = null;
                draft.logOutDone = false;
                break;
            }
            case LOG_OUT_SUCCESS: {

                draft.logInDone = false;
                draft.me = null;

                draft.logOutLoading = false;
                draft.logOutDone = true;
                draft.logOutError = null;
                break;
            }
            case LOG_OUT_FAILURE: {

                draft.logOutLoading = false;
                draft.logOutDone = false;
                draft.logOutError = action.error;
                break;
            }

            //signUp
            case SIGN_UP_REQUEST: {
                draft.signUpLoading = true;
                draft.signUpDone = false;
                draft.signUpError = null;
                break;
            }
            case SIGN_UP_SUCCESS: {
                draft.signUpLoading = false;
                draft.signUpDone = true;
                draft.signUpError = null;
                break;
            }
            case SIGN_UP_FAILURE: {
                draft.signUpLoading = false;
                draft.signUpDone = false;
                draft.signUpError = action.error;
                break;
            }

            //change nickname
            case CHANGE_NICKNAME_REQUEST: {
                draft.changeNicknameLoading = true;
                draft.changeNicknameDone = false;
                draft.changeNicknameError = null;
                break;
            }
            case CHANGE_NICKNAME_SUCCESS: {
                draft.me.nickname = action.data.nickname;

                draft.changeNicknameLoading = false;
                draft.changeNicknameDone = true;
                draft.changeNicknameError = null;
                break;
            }
            case CHANGE_NICKNAME_FAILURE: {
                draft.changeNicknameLoading = false;
                draft.changeNicknameDone = false;
                draft.changeNicknameError = action.error;
                break;
            }


            //follow
            case FOLLOW_REQUEST: {
                draft.followLoading = true;
                draft.followDone = false;
                draft.followError = null;
                break;
            }
            case FOLLOW_SUCCESS: {
                draft.me.Followings.unshift(action.data);

                draft.followLoading = false;
                draft.followDone = true;
                draft.followError = null;
                break;
            }
            case FOLLOW_FAILURE: {
                draft.followLoading = false;
                draft.followDone = false;
                draft.followError = action.error;
                break;
            }
            //unfollow
            case UNFOLLOW_REQUEST: {
                draft.unFollowLoading = true;
                draft.unFollowDone = false;
                draft.unFollowError = null;
                break;
            }
            case UNFOLLOW_SUCCESS: {
                draft.me.Followings.splice(draft.me.Followings.findIndex((v) => (v.id === action.data.id)), 1);

                draft.unFollowLoading = false;
                draft.unFollowDone = true;
                draft.unFollowError = null;
                break;
            }
            case UNFOLLOW_FAILURE: {
                draft.unFollowLoading = false;
                draft.unFollowDone = false;
                draft.unFollowError = action.error;
                break;
            }

            //unfollow
            case DELETE_FOLLOWER_REQUEST: {
                draft.deleteFollowerLoading = true;
                draft.deleteFollowerDone = false;
                draft.deleteFollowerError = null;
                break;
            }
            case DELETE_FOLLOWER_SUCCESS: {
                draft.me.Followers.splice(draft.me.Followers.findIndex((v) => (v.id === action.data.id)), 1);

                draft.deleteFollowerLoading = false;
                draft.deleteFollowerDone = true;
                draft.deleteFollowerError = null;
                break;
            }
            case DELETE_FOLLOWER_FAILURE: {
                draft.deleteFollowerLoading = false;
                draft.deleteFollowerDone = false;
                draft.deleteFollowerError = action.error;
                break;
            }


            default: {
                break;
            }
        }
    });
}

export default user;
