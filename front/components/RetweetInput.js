import { Button, Input, Row, Col } from "antd";
import Form from "antd/lib/form/Form";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { RETWEET_REQUEST } from "../reducers/post";

const send = <FontAwesomeIcon icon={faPaperPlane} />

// 현재 포스트카드의 정보를 props로 받는다. 정보 : mainPost 배열의 value
const RetweetInputForm = ({ post }) => {
    const dispatch = useDispatch();

    //login 상태라면  user id 받아온다
    // const { nickname } = useSelector((state) => state.user.me);

    const { reTweetDone, reTweetLoading } = useSelector((state) => state.post);
    const { logInDone } = useSelector((state) => state.user);
    const { id } = logInDone && useSelector((state) => state.user);

    //input form에 입력되는 state, 커스텀 훅스를 사용해서 입력되는 변화를 바로 commentText state로 받아온다
    const [retweetText, setRetweetText] = useState('');

    useEffect(() => {
        if (reTweetDone) {
            setRetweetText('');
        }
    }, [reTweetDone])

    const onChangeRetweetText = useCallback((e) => {
        setRetweetText(e.target.value);
    });

    const onSubmitRetweet = useCallback(() => {
        if (!id) { return alert('Please login for service'); }
        dispatch({
            type: RETWEET_REQUEST,
            //게시글 id를 서버에 보냄 ==> post.id
            data: {
                postId: post.id,
                content: retweetText
            },
        });
        window.scrollTo(0, 0);
    }, [post.id, id]);

    return (
        <>
            <Form style={{ position: 'relative', margin: '0px 0px' }} onFinish={onSubmitRetweet}>
                <div style={{ display: 'flex' }}>
                    <Input.TextArea
                        required
                        placeholder='Write down Retweet Text.'
                        style={{ border: 'none' }}
                        value={retweetText}
                        onChange={onChangeRetweetText}
                        row={4} />
                    <Button
                        loading={reTweetLoading}
                        style={{ height: '80px' }} type='primary' htmlType="submit">
                        {send}
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default RetweetInputForm;