import React, { useEffect, useRef, createRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

//antd
import { Input, Menu, Row, Col, Button } from 'antd';

//component
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

import { useSelector } from 'react-redux';

const AppLayout = ({ children }) => {


    // const leftAreaRef = createRef();
    // useEffect(() => {
    //     console.log(leftAreaRef.current.offsetWidth
    //     );
    // });


    //리덕스 중앙 저장소로부터 isLoggedIn state를 불러온다
    const { logInDone } = useSelector((state) => state.user);

    const goToTop = () => {
        window.scrollTo(0, 0);
    }

    return (
        <>
            {/* 공통부분인 header가 Applayout에서 작성됨 */}
            <Menu className='header' mode="horizontal">

                <Menu.Item key={1}>
                    <Link href='/'>
                        <span className='headerTitleText'>bit.Birds</span>
                    </Link>
                </Menu.Item>

                <Menu.Item key={2}>
                    <Link href='/profile'>
                        <span className='headerText'>Profile</span>
                    </Link>
                </Menu.Item>

                <Menu.Item key={3}>
                    <Input.Search onSearch={() => { alert('구현 예정...') }} className='searchHash' placeholder="Hashtag" enterButton />
                </Menu.Item>

            </Menu>
            <Button type='primary' className='topButton' onClick={goToTop} >🔝</Button>

            <div className='main'>
                {/* 좌측 영역 */}
                <div
                    className="leftArea">
                    {/* 로그인 상태 O => <UserProfile />, 로그인 상태 X => <LoginForm /> */}
                    {/* 리덕스를 사용해서 props을 전달해주지 않아도 된다 */}
                    {logInDone ? <UserProfile /> : <LoginForm />}
                </div>

                {/* 우측 영역 */}
                <div
                    className="rightArea" >
                    {children}
                </div>
            </div>
        </>
    );
};

//받아오는 props가 반드시 컴포넌트(노트)여야 해서 prototype사용
AppLayout.prototype = {
    children: PropTypes.node.isRequired,
    //여기서 children은 node라는 타입, 화면에 그릴수 있는 모든것이 node 
};

export default AppLayout;