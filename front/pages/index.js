//import React from 'racat'; next 사용하기 때문에 이 코드 필요 없다

import AppLayout from "../components/AppLayout";
import Head from "next/head";

//SSR을 위함
import wrapper from "../store/configureStore";
import { END } from 'redux-saga';
import axios from "axios";

//redux
import { useDispatch, useSelector } from "react-redux";

//component form
import PostCard from '../components/PostCard';
import PostInputForm from "../components/PostInputForm";
import { useEffect } from "react";

//redux action
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { LOAD_POST_REQUEST } from "../reducers/post";

const Home = () => {

    //구조분해해서 redux state 불러오기
    const { logInDone } = useSelector((state) => state.user);
    const { mainPosts, loadPostLoading, hasMorePost, reTweetError } = useSelector((state) => state.post);
    const dispatch = useDispatch();

    //리트윗 처리중 에러 발생시 alert
    useEffect(() => {
        if (reTweetError) { alert(reTweetError); }
    }, [reTweetError])

    //스크롤이 가장 끝에 닿을때 디스패치
    useEffect(() => {
        function onScroll() {
            // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
            //window.scrollY , 얼마나 내렸는지
            //document.documentElement.clientHeight, 클라이언트 화면 길이
            //document.documentElement.scrollHeight, 총 길이

            //끝까지 내렸을때
            if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 300) {
                console.log('bottom');
                if (!loadPostLoading && hasMorePost) {
                    //loadPOstLoading : 스크롤중에 리퀘스트 중복 발생을 예방하기위함
                    //hasMorePost : 서버에서 더 불러올 포스트가 남아있는지 파악하기 위함

                    const lastId = mainPosts.length === 0 ? 0 : mainPosts[mainPosts.length - 1].id;//현재 리덕스 state로 불러와진 포스트중 마지막 포스트의 id를 따온다

                    dispatch({
                        type: LOAD_POST_REQUEST,
                        lastId, //lastId : lastId //data로 안보내고 그냥 lastId가 key값으로 사용
                    })
                }
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => {
            //window addEventListener 사용하면 항상 이벤트 리스너 지워줘야한다
            //새로고침 시 한번 이벤트 리스너가 추가되었다가 이 리턴문으로 이벤트 리스너가 삭제되어 더이상 스크롤을 감지하지 않게된다
            window.removeEventListener('scroll', onScroll);
        };
    }, [loadPostLoading, hasMorePost, mainPosts]);

    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <title>Home</title>
            </Head>
            <AppLayout>
                {/* 로그인 되어 있다면 PostInputForm이 나타난다 */}
                {logInDone && <PostInputForm />}
                {mainPosts.length === 0 ? null : mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
            </AppLayout>
        </>
    );
}



export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
    const cookie = req && req.headers.cookie; // req(요청)가 있다면 cookie에 요청에 담겨진 cookie를 할당한다.
    axios.defaults.headers.Cookie = ''; // 요청이 들어올 때마다 초기화 시켜주는 것이다. 여기는 클라이언트 서버에서 실행되므로 이전 요청이 남아있을 수 있기 때문이다
    if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }

    store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    store.dispatch({ type: LOAD_POST_REQUEST, lastId: 0 });

    //next redux wrapper에 코드안내되어있다
    store.dispatch(END);
    await store.sagaTask.toPromise();
});


export default Home;