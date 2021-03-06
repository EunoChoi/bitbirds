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

    //load Post??? ???????????? state
    loadPostLoading: false,
    loadPostDone: false,
    loadPostError: null,

    //add Post??? ???????????? state
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,
    //delete Post??? ???????????? state
    deletePostLoading: false,
    deletePostDone: false,
    deletePostError: null,

    //add Comment??? ???????????? state
    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null,
    //delete Comment??? ???????????? state
    deleteCommentLoading: false,
    deleteCommentDone: false,
    deleteCommentError: null,

    //like post??? ???????????? state
    likePostLoading: false,
    likePostDone: false,
    likePostError: null,
    //like post??? ???????????? state
    unLikePostLoading: false,
    unLikePostDone: false,
    unLikePostError: null,
}







//post reducer, (????????????, ??????) => ????????????
const post = (state = initialState, action) => {

    //immer ??????, ????????? ????????????????????? return ???????????? ?????? ?????? ?????? ?????? ?????????
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

                //????????? ???????????? ???????????? ????????? ????????? ??????
                draft.mainPosts = draft.mainPosts.concat(action.data);
                //??????????????? ?????? ???????????? ?????? 10?????? ????????? hasMorePost??? false??? ???????????? ????????? ???????????? ????????? ??????
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
                //back?????? ???????????? action.data?????? postId??? ???????????? ????????? ?????? ??????[mainPosts??? post ??????] ??????
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
                const postIndex = draft.mainPosts.findIndex((v) => (v.id === action.data.PostId));//postId ???????????? ??????
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
                //??????????????? ?????? PostId??? ???????????? ????????? ??????
                const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
                //post.Likers.push(action.data.UserId); => X
                //Likers??? ??? ?????? ????????? ????????? ????????? ?????????. ???? ??????????????? ?????? ????????? ???????????? ?????? ????????? ?????????
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
                //??????????????? ?????? PostId??? ???????????? ????????? ??????
                const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
                //filter ???????????? ??? ?????????
                //post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);

                //splice ???????????? ??? ?????????
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

    //immer??? ???????????? ?????? ????????? ??????, ????????? ???????????? ????????? ??????
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
    //     //comment??? ????????? Post??? mainPosts ?????? ??? ??? ??????????????? ????????????
    //     //??? ???????????? Comments ????????? ?????? ????????? comment??? ????????????
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
