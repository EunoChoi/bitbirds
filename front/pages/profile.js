import AppLayout from "../components/AppLayout";
import Head from "next/head";

//SSR을 위함
import wrapper from "../store/configureStore";
import { END } from 'redux-saga';
import axios from "axios";


//component
import EditForm from "../components/EditForm";
import FollowerList from "../components/FollowerList";
import FollowingList from "../components/FollowingList";

import { useDispatch, useSelector } from "react-redux";
import Router from 'next/router';

import { useEffect } from "react";


//aciton
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";


const Profile = () => {

    const { me, loadMyInfoDone, loadUserDone, changeNicknameDone } = useSelector((state) => state.user);

    // SSR로 대체
    // useEffect(() => {
    //     //매번 새로고침마다 유저 정보를 불러온다(로그인 쿠키가 브라우저에 있는 경우)
    //     dispatch({ type: LOAD_MY_INFO_REQUEST });
    // }, []);

    useEffect(() => {
        if (changeNicknameDone) {
            alert('The information has been changed');
        }
    }, [changeNicknameDone]);


    useEffect(() => {
        console.log(loadMyInfoDone);
        console.log(loadUserDone);
        if ((!loadMyInfoDone && !loadUserDone)) {
            Router.replace('/');
        }
    }, [loadMyInfoDone, loadUserDone]);

    return (
        <>
            {/* head 태그와 똑같이 동작하는 next 컴포넌트, page마다 라우팅되어 동작 */}
            {/* profile.js 페이지만 따로 title 변경하기 위함 */}
            <Head>
                <meta charSet='utf-8' />
                <title>Profile</title>
            </Head>

            <AppLayout>

                <div style={{ width: '100%' }}>
                    <h1 style={{ color: 'salmon', fontWeight: '800' }}>Profile</h1>
                    <EditForm header='Info Edit' />
                    {me !== null ? <FollowingList header='Followings' data={me.Followings} /> : null}
                    {me !== null ? <FollowerList header='Followers' data={me.Followers} /> : null}
                </div>
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

    //next redux wrapper에 코드안내되어있다
    store.dispatch(END);
    await store.sagaTask.toPromise();
});


export default Profile;