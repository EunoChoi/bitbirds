import AppLayout from "../components/AppLayout";
import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import { Form, Input, Checkbox, Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducers/user";


const Signup = () => {
    const dispatch = useDispatch();
    //회원가입 페이지가 떠있는 상태에서 로그인하면 메인페이지로 이동한다
    //useRouter이용
    const Router = useRouter();
    const { signUpLoading, signUpDone, signUpError, logInDone } = useSelector((state) => state.user);

    //회원가입 완료시 메인화면으로 이동
    useEffect(() => {
        if (signUpDone) {
            Router.replace('/');
        }
    }, [signUpDone])

    //로그인 되어있는 상태면 메인화면으로 이동
    useEffect(() => {
        if (logInDone) {
            Router.replace('/');
        }
    }, [logInDone])

    useEffect(() => {
        if (signUpError) {
            alert(signUpError);
        }
    }, [signUpError])



    //기본 input
    const [email, setChangeEmail] = useInput('');
    const [nickname, setChangeNickname] = useInput('');

    //check가 function에 추가되야해서 custom hooks를 사용하지 않았다
    //check먼저 입력한 경우 그냥 password 입력할때도 동일한지확인해야한다
    const [passwordError, setPasswordError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    const setChangePassword = useCallback((e) => {
        setPassword(e.target.value);
        setPasswordError(e.target.value !== passwordCheck);
    }, [passwordCheck])
    const setChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setPasswordError(e.target.value !== password);
    }, [password]);

    //약관 동의
    const [term, setTerm] = useState(false);
    const [termError, setTermError] = useState(false);
    const onChangeTerm = useCallback((e) => {
        if (!e.target.checked) {
            setTerm(false);
            setTermError(true);
        }
        else {
            setTerm(true);
            setTermError(false);
        }
    });

    //한번더 비밀번호 체크 제대로 동작했는지 체크 박스가 체크되었는지 확인
    const onSubmit = useCallback(() => {
        if (password !== passwordCheck)
            return;
        if (termError)
            return;
        console.log('email : ', email);
        console.log('nickname : ', nickname);
        console.log('password', password);

        //회원가입 요청
        dispatch({
            type: SIGN_UP_REQUEST,
            data: { email, password, nickname }
        })
    }, [password, passwordCheck, termError, nickname]);

    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <title>SignUp</title>
            </Head>
            <AppLayout>
                <h2>
                    Sign Up
                </h2>
                <Form onFinish={onSubmit}>
                    {/* email */}
                    <div className="inputArea">
                        <label>Email</label>
                        <Input
                            type='email'
                            value={email}
                            onChange={setChangeEmail}
                            name=""
                            required
                        />
                    </div>

                    {/* nickname */}
                    <div className="inputArea">
                        <label>Nickname</label>
                        <Input
                            value={nickname}
                            onChange={setChangeNickname}
                            type='text'
                            name=""
                            required
                        />
                    </div>

                    {/* password */}
                    <div className="inputArea">
                        <label>Password</label>
                        <Input
                            value={password}
                            onChange={setChangePassword}
                            type='password'
                            name=""
                            required
                        />
                    </div>

                    {/* password check */}
                    <div className="inputArea">
                        <label>Password Check</label>
                        <Input
                            value={passwordCheck}
                            onChange={setChangePasswordCheck}
                            type='password'
                            name=""
                            required
                        />
                        {/* {passwordError ? <span>비밀번호가 일치하지 않습니다.</span> : null} */}
                        {passwordError && <div className="warning">비밀번호가 일치하지 않습니다.</div>}

                    </div>

                    <div className="inputArea">
                        <label>Terms and conditions</label>
                        <p>
                            [제1조 목적]<br />
                            ※ 본 이용약관(이하 '약관')은 'bit.Birds'와 이용고객(이하 '회원'이라 칭함)간에 회사가 제공하는 회사의 서비스(이하 '서비스')의 가입 및 이용에 관한 권리와 의무 및 책임사항을 규정함을 목적으로 합니다.<br />
                            {/* <br />[제2조 용어의 정의]<br />
                            1. 본 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br />
                            ① 회원 : 회사에 접속하여 회사가 정한 절차에 따라 본 약관에 동의하고 서비스 이용에 필요한 회원가입 신청서를 제출한 후, 회사가 서비스 이용을 승낙함으로써, 서비스 이용계약이 체결 되어 서비스를 제공 받는 사람을 말합니다.<br />
                            ② 운영자 : 서비스의 전반적인 관리와 운영을 하는 자<br />
                            ③ 아이디 : 회원 식별과 서비스 이용을 위하여 회원이 선정하고 '회사'가 승인하는 4자리 이상의 문자 또는 숫자<br />
                            ④ 패스워드 : 회원의 비밀 보호를 위해 회원이 선정하는 문자 또는 숫자<br />
                            ⑤ 준회원 : 회사에 회원등록을 마친 정회원 결제를 하지 아니한 회원<br />
                            ⑥ 정회원 : 회사에 회원등록을 한 후 서비스 이용에 대한 결제를 한 회원<br /> */}
                        </p>
                        <div className="centerBox">
                            <Checkbox checked={term} onChange={onChangeTerm}>약관에 동의합니까?</Checkbox>
                            {termError && <div className="warning">약관에 동의하셔야 합니다</div>}
                            <Button loading={signUpLoading} style={{ margin: '20px', borderRadius: '50px' }} type='primary' htmlType="submit">Submit</Button>
                        </div>
                    </div>
                </Form>
            </AppLayout>
        </>
    );
}

export default Signup;