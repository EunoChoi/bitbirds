import produce from 'immer';

//retweet
export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';
//RETWEET
export const UPLOAD_IMAGE_REQUEST = 'UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_FAILURE = 'UPLOAD_IMAGE_FAILURE';
//remove image
export const REMOVE_IMAGE = 'REMOVE_IMAGE';
export const REMOVE_IMAGE_ALL = 'REMOVE_IMAGE_ALL';

//load post
export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';
//load user post
export const LOAD_USERPOST_REQUEST = 'LOAD_USERPOST_REQUEST';
export const LOAD_USERPOST_SUCCESS = 'LOAD_USERPOST_SUCCESS';
export const LOAD_USERPOST_FAILURE = 'LOAD_USERPOST_FAILURE';
//add post
export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';
//delete post
export const DELETE_POST_REQUEST = 'DELETE_POST_REQUEST';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE';
//add comment
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';
//delete comment
export const DELETE_COMMENT_REQUEST = 'EELETE_COMMENT_REQUEST';
export const DELETE_COMMENT_SUCCESS = 'EELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_FAILURE = 'EELETE_COMMENT_FAILURE';
//like post
export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';
//unlike post
export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';



//post state
const initialState = {
    hasMorePost: true,
    mainPosts: [],

    //retweet
    reTweetLoading: false,
    reTweetDone: false,
    reTweetError: null,

    //image upload path
    imagePaths: [],

    //image upload state
    imageUploadLoading: false,
    imageUploadDone: false,
    imageUploadError: null,

    //load Post를 나타내는 state
    loadPostLoading: false,
    loadPostDone: false,
    loadPostError: null,

    //add Post를 나타내는 state
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
    //delete Post를 나타내는 state
    deletePostLoading: false,
    deletePostDone: false,
    deletePostError: null,

    //add Comment를 나타내는 state
    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
    //delete Comment를 나타내는 state
    deleteCommentLoading: false,
    deleteCommentDone: false,
    deleteCommentError: null,

    //like post를 나타내는 state
    likePostLoading: false,
    likePostDone: false,
    likePostError: null,
    //like post를 나타내는 state
    unLikePostLoading: false,
    unLikePostDone: false,
    unLikePostError: null,
}







//post reducer, (이전상태, 액션) => 다음상태
const post = (state = initialState, action) => {

    //immer 사용, 불변성 지키지않으므로 return 사용하지 않고 그냥 바로 값을 바꾼다
    return produce(state, (draft) => {
        switch (action.type) {

            //retweet
            case RETWEET_REQUEST: {
                draft.reTweetLoading = true;
                draft.reTweetDone = false;
                draft.reTweetError = null;
                break;
            }
            case RETWEET_SUCCESS: {
                draft.mainPosts.unshift(action.data);

                draft.reTweetLoading = false;
                draft.reTweetDone = true;
                draft.reTweetError = null;
                break;
            }
            case RETWEET_FAILURE: {
                draft.reTweetLoading = false;
                draft.reTweetDone = false;
                draft.reTweetError = action.error.data;
                break;
            }

            //remove image
            case REMOVE_IMAGE: {
                draft.imagePaths.splice(action.data, 1);
                break;
            }
            case REMOVE_IMAGE_ALL: {
                draft.imagePaths = [];
                break;
            }


            //image upload
            case UPLOAD_IMAGE_REQUEST: {
                draft.uploadImageLoading = true;
                draft.uploadImageDone = false;
                draft.uploadImageError = null;
                break;
            }
            case UPLOAD_IMAGE_SUCCESS: {
                draft.imagePaths = action.data;

                draft.uploadImageLoading = false;
                draft.uploadImageDone = true;
                draft.uploadImageError = null;
                break;
            }
            case UPLOAD_IMAGE_FAILURE: {
                draft.uploadImageLoading = false;
                draft.uploadImageDone = false;
                draft.uploadImageError = action.error;
                break;
            }
            //add post
            case ADD_POST_REQUEST: {
                draft.addPostLoading = true;
                draft.addPostDone = false;
                draft.addPostError = null;
                break;
            }
            case ADD_POST_SUCCESS: {

                draft.mainPosts.unshift(action.data);

                draft.addPostLoading = false;
                draft.addPostDone = true;
                draft.addPostError = null;
                break;
            }
            case ADD_POST_FAILURE: {
                draft.addPostLoading = false;
                draft.addPostDone = false;
                draft.addPostError = action.error;
            }
            //load post, load user post
            case LOAD_USERPOST_REQUEST:
            case LOAD_POST_REQUEST: {
                draft.loadPostLoading = true;
                draft.loadPostDone = false;
                draft.loadPostError = null;
                break;
            }
            case LOAD_USERPOST_SUCCESS:
            case LOAD_POST_SUCCESS: {
                draft.loadPostLoading = false;
                draft.loadPostDone = true;
                draft.loadPostError = null;

                //불러온 포스트가 상단으로 가도록 객체를 병합
                draft.mainPosts = draft.mainPosts.concat(action.data);
                //서버로부터 받은 포스트의 수가 10개가 아니면 hasMorePost를 false로 변경해서 더이상 로드하지 않도록 한다
                draft.hasMorePost = (action.data.length === 10);
                break;
            }
            case LOAD_USERPOST_FAILURE:
            case LOAD_POST_FAILURE: {
                draft.loadPostLoading = false;
                draft.loadPostDone = false;
                draft.loadPostError = action.error;
            }


            //delete post
            case DELETE_POST_REQUEST: {
                draft.deletePostLoading = true;
                draft.deletePostDone = false;
                draft.deletePostError = null;
                break;
            }
            case DELETE_POST_SUCCESS: {
                //back으로 전달받은 action.data받은 postId를 이용해서 리덕스 상태 변경[mainPosts내 post 삭제] 진행
                const deleteIndex = draft.mainPosts.findIndex((v) => (v.id) === action.data);
                draft.mainPosts.splice(deleteIndex, 1);

                draft.deletePostLoading = false;
                draft.deletePostDone = true;
                draft.deletePostError = null;
                break;
            }
            case DELETE_POST_FAILURE: {
                draft.deletePostLoading = false;
                draft.deletePostDone = false;
                draft.deletePostError = action.error;
                break;
            }



            //add comment
            case ADD_COMMENT_REQUEST: {
                draft.addCommentLoading = true;
                draft.addCommentDone = false;
                draft.addCommentError = null;
                break;
            }
            case ADD_COMMENT_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex((v) => (v.id === action.data.PostId));//postId 대소문자 주의
                draft.mainPosts[postIndex].Comments.unshift(action.data);

                draft.addCommentLoading = false;
                draft.addCommentDone = true;
                draft.addCommentError = null;
                break;
            }
            case ADD_COMMENT_FAILURE: {
                draft.addCommentLoading = false;
                draft.addCommentDone = false;
                draft.addCommentError = action.error;
                break;
            }

            //like post
            case LIKE_POST_REQUEST: {
                draft.likePostLoading = true;
                draft.likePostDone = false;
                draft.likePostError = null;
                break;
            }
            case LIKE_POST_SUCCESS: {
                //서버로부터 받은 PostId로 해당하는 포스트 찾기
                const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
                //post.Likers.push(action.data.UserId); => X
                //Likers에 값 바로 담는게 아니라 객체로 담는다. 왜? 백엔드에서 모델 데이터 설정할때 형식 이렇게 정해짐
                post.Likers.push({ id: action.data.UserId });

                draft.likePostLoading = false;
                draft.likePostDone = true;
                draft.likePostError = null;
                break;
            }
            case LIKE_POST_FAILURE: {
                draft.likePostLoading = false;
                draft.likePostDone = false;
                draft.likePostError = action.error;
            }
            //unlike post
            case UNLIKE_POST_REQUEST: {
                draft.unLikePostLoading = true;
                draft.unLikePostDone = false;
                draft.unLikePostError = null;
                break;
            }
            case UNLIKE_POST_SUCCESS: {
                //서버로부터 받은 PostId로 해당하는 포스트 찾기
                const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
                //filter 사용해서 값 지우기
                //post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);

                //splice 사용해서 값 지우기
                const i = post.Likers.findIndex((v) => v.id === action.data.UserId);
                post.Likers.splice(i, 1);


                draft.unLikePostLoading = false;
                draft.unLikePostDone = true;
                draft.unLikePostError = null;
                break;
            }
            case UNLIKE_POST_FAILURE: {
                draft.unLikePostLoading = false;
                draft.unLikePostDone = false;
                draft.unLikePostError = action.error;
            }


            default: {
                break;
            }
        }
    });

    //immer를 사용하지 않은 경우의 코드, 불변성 지켜야할 필요가 있다
    // switch (action.type) {
    //     //add post
    //     case ADD_POST_REQUEST: {
    //         return {
    //             ...state,
    //             addPostLoading: true,
    //             addPostDone: false,
    //             addPostError: null,
    //         }
    //     }

    //     case ADD_POST_SUCCESS: {

    //         return {
    //             ...state,
    //             mainPosts: [dummyPost(action.data), ...state.mainPosts],

    //             addPostLoading: false,
    //             addPostDone: true,
    //             addPostError: null,
    //         }
    //     }
    //     case ADD_POST_FAILURE: {
    //         return {
    //             ...state,
    //             addPostLoading: false,
    //             addPostDone: false,
    //             addPostError: action.error,
    //         }
    //     }

    //     //delete post
    //     case DELETE_POST_REQUEST: {
    //         return {
    //             ...state,
    //             deletePostLoading: true,
    //             deletePostDone: false,
    //             deletePostError: null,
    //         }
    //     }
    //     case DELETE_POST_SUCCESS: {
    //         const mainPosts = [...state.mainPosts];
    //         console.log('mainPosts before', mainPosts);
    //         const deleteIndex = mainPosts.findIndex((v) => (v.id) === action.postId);
    //         console.log('deleteindex', deleteIndex);
    //         mainPosts.splice(deleteIndex, 1);
    //         console.log('mainPosts after', mainPosts);
    //         return {
    //             ...state,
    //             mainPosts: [...mainPosts],

    //             deletePostLoading: false,
    //             deletePostDone: true,
    //             deletePostError: null,
    //         }
    //     }
    //     case DELETE_POST_FAILURE: {
    //         return {
    //             ...state,
    //             deletePostLoading: false,
    //             deletePostDone: false,
    //             deletePostError: action.error,
    //         }
    //     }

    //     //add comment
    //     case ADD_COMMENT_REQUEST: {
    //         return {
    //             ...state,
    //             addCommentLoading: true,
    //             addCommentDone: false,
    //             addCommentError: null,
    //         }
    //     }
    //     //comment가 입력된 Post가 mainPosts 배열 값 중 어느것인지 찾아내고
    //     //그 포스트의 Comments 배열에 가장 앞쪽에 comment를 추가한다
    //     case ADD_COMMENT_SUCCESS: {
    //         const postIndex = state.mainPosts.findIndex((v) => (v.id === action.data.postId));
    //         const post = { ...state.mainPosts[postIndex] };
    //         post.Comments = [dummyComment(action.data), ...post.Comments];
    //         const mainPosts = [...state.mainPosts];
    //         mainPosts[postIndex] = post;

    //         return {
    //             ...state,
    //             mainPosts,
    //             addCommentLoading: false,
    //             addCommentDone: true,
    //             addCommentError: null,
    //         }
    //     }
    //     case ADD_COMMENT_FAILURE: {
    //         return {
    //             ...state,
    //             addCommentLoading: false,
    //             addCommentDone: false,
    //             addCommentError: action.error,
    //         }
    //     }

    //     default: {
    //         return {
    //             ...state,
    //         };
    //     }
    // }
}

export default post;
