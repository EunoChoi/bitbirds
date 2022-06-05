import { Button, Input, Row, Col } from "antd";
import Form from "antd/lib/form/Form";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { actionAddCommentRequest, ADD_COMMENT_REQUEST } from "../reducers/post";

const send = <FontAwesomeIcon icon={faPaperPlane} />

// 현재 포스트카드의 정보를 props로 받는다. 정보 : mainPost 배열의 value
const CommentInputForm = ({ post }) => {
    const dispatch = useDispatch();

    //login 상태라면  user id 받아온다
    const { nickname } = useSelector((state) => state.user.me);
    const { addCommentLoading, addCommentDone } = useSelector((state) => state.post);
    const { logInDone } = useSelector((state) => state.user);
    const { id } = logInDone ? useSelector((state) => state.user) : null;


    useEffect(() => {
        if (addCommentDone) {
            setCommentText('');
        }
    }, [addCommentDone])

    //input form에 입력되는 state, 커스텀 훅스를 사용해서 입력되는 변화를 바로 commentText state로 받아온다
    const [commentText, setCommentText] = useState('');

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    });

    const onSubmitComment = useCallback(() => {
        dispatch({
            type: ADD_COMMENT_REQUEST,
            data: {
                content: commentText,
                postId: post.id,
                userId: id
            },
        });
        //dispatch(actionAddCommentRequest(post.id, id, nickname, commentText));
    }, [nickname, commentText, post.id, id]);


    return (
        <>
            <Form style={{ position: 'relative', margin: '0px 0px' }} onFinish={onSubmitComment}>
                <div style={{ display: 'flex' }}>
                    <Input.TextArea
                        required
                        placeholder='Write down the comments.'
                        style={{ border: 'none' }}

                        value={commentText}
                        onChange={onChangeCommentText}
                        row={4} />
                    <Button
                        loading={addCommentLoading}
                        style={{ height: '80px' }} type='primary' htmlType="submit">
                        {send}
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default CommentInputForm;