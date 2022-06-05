import { Form, Input, Button } from 'antd';
import { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';

//redux
import { useDispatch } from 'react-redux';


//reducer action creator
import { actionLogInRequest } from '../reducers/user';

import useInput from '../hooks/useInput';

//리렌더링 방지하면서 스타일 적용을 위한 styledComonent, 백틱기호를 이용한다
const ButtonWrapper = styled.div`
width : 100%;
margin-top : 20px;
display : flex;
justify-content: space-evenly;   
`;

const LoginForm = () => {

    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');

    //redux store 접근
    const dispatch = useDispatch();
    const { logInDone } = useSelector((state) => state.user);
    const { logInLoading } = useSelector((state) => state.user);




    //[id,pw]에 따른 callback function
    //e.preventDefault(); ant design <Form>에서는 이미 적용되어 사용하지 않는다
    const onSubmitForm = useCallback(() => {
        //dispatch에 action create function 을 보내서 action 객체를 dispatch를 통해 보낸다
        //로그인 요청 액션을 디스패치를 통해 보냄, 일단 요청만
        dispatch(actionLogInRequest({ email, password }));
    }, [email, password]);


    return (
        <>
            {/* Form 안에서 submit되면 onFinish 호출 */}

            <Form className='loginForm' onFinish={onSubmitForm}>
                <Input className='loginInput' placeholder='Email' type='email' id='user-email' value={email} onChange={onChangeEmail} required />
                <Input className='loginInput' placeholder='Password' type='password' id='user-pw' value={password} onChange={onChangePassword} required />
                {/* styledComonent ButtonWrapper */}
                <ButtonWrapper>
                    <Button className='loginBtn' type='primary' htmlType='submit' loading={logInLoading}>Login</Button>
                    <Button className='loginBtn' ><Link href='/signup'>Sign Up</Link></Button>
                </ButtonWrapper>

            </Form>
        </>
    );
}

export default LoginForm;