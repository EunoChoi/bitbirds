import AppLayout from "../../components/AppLayout";
import Head from "next/head";

import PostCard from "../../components/PostCard";

//atnd
import { Card, Popover, Button, Descriptions, Avatar, List, Comment } from "antd";

//SSR을 위함
import wrapper from "../../store/configureStore";
import { END } from 'redux-saga';
import axios from "axios";


import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";
import { LOAD_USERPOST_REQUEST } from "../../reducers/post";
import { useEffect } from "react";


const About = () => {

    const { otherUser } = useSelector(state => state.user);
    const { mainPosts, loadUserPostLoading, hasMorePost } = useSelector(state => state.post);
    const dispatch = useDispatch();

    //스크롤이 가장 끝에 닿을때 디스패치
    useEffect(() => {
        function onScroll() {
            //끝까지 내렸을때
            if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 300) {
                console.log('bottom');
                if (!loadUserPostLoading && hasMorePost) {
                    const lastId = mainPosts.length === 0 ? 0 : mainPosts[mainPosts.length - 1].id;//현재 리덕스 state로 불러와진 포스트중 마지막 포스트의 id를 따온다
                    dispatch({
                        type: LOAD_USERPOST_REQUEST,
                        data: {
                            userId: otherUser.id,
                            lastId
                        }
                    })
                }
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => {

            window.removeEventListener('scroll', onScroll);
        };
    }, [loadUserPostLoading, hasMorePost, mainPosts]);

    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <title>About</title>
            </Head>

            <AppLayout>
                <div className="AboutPage" style={{ width: '100%' }}>
                    <h1 style={{ color: 'salmon', fontWeight: '800' }}>Infomation</h1>
                    <Card
                        className="postCard"
                        style={{ textAlign: 'center', width: '100%' }}
                        actions={[
                            <div className='userProfile__action' key="twit">Post<br />{otherUser.Posts}</div>,
                            <div className='userProfile__action' key="followings">following<br />{otherUser.Follwings}</div>,
                            <div className='userProfile__action' key="followers">Follower<br />{otherUser.Followers}</div>
                        ]}
                    >
                        <Card.Meta
                            avatar={<Avatar>{otherUser.email && otherUser.email[0]}</Avatar>}
                            title={otherUser?.email}
                            description={otherUser?.nickname}
                        />
                    </Card>
                    <h1 style={{ color: 'salmon', fontWeight: '800' }} >Posts</h1>
                    {mainPosts.length === 0 ? null : mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
            </AppLayout>
        </>
    );
}

//해당 페이지가 브라우저에 렌더링 되기 전에 서버로 부터 정보를 받아오는 요청
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }) => {
    const cookie = req && req.headers.cookie; // req(요청)가 있다면 cookie에 요청에 담겨진 cookie를 할당한다.
    axios.defaults.headers.Cookie = ''; // 요청이 들어올 때마다 초기화 시켜주는 것이다. 여기는 클라이언트 서버에서 실행되므로 이전 요청이 남아있을 수 있기 때문이다
    if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }
    store.dispatch({ type: LOAD_MY_INFO_REQUEST });
    store.dispatch({ type: LOAD_USER_REQUEST, data: { userId: params.id } });
    store.dispatch({
        type: LOAD_USERPOST_REQUEST,
        data: {
            userId: params.id,
            lastId: 0,
        }
    })


    store.dispatch(END);
    await store.sagaTask.toPromise();
});


export default About;