import { Input, Menu, Row, Col, Form, Button, Divider } from 'antd';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ADD_POST_REQUEST, UPLOAD_IMAGE_REQUEST, REMOVE_IMAGE, REMOVE_IMAGE_ALL } from '../reducers/post';

//fontawesome package
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { backUrl } from '../config/config';


const send = <FontAwesomeIcon icon={faPaperPlane} />
const fileUp = <FontAwesomeIcon icon={faFileArrowUp} />

const PostInputForm = () => {
    const imageInput = useRef();
    const [text, setText] = useState('');

    const dispatch = useDispatch();
    const { me, id } = useSelector((state) => state.user);
    const { addPostLoading, addPostDone, imagePaths } = useSelector((state) => state.post);

    const nickname = me.nickname;

    //addPost 성공 후 text 초기화
    useEffect(() => {
        if (addPostDone) {
            setText('');
        }
    }, [addPostDone]);

    //버튼을 눌러서 사진 업로드창을 띄울수 있다
    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput]);

    //텍스트 입력창에 텍스트 입력시 test state 변경
    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    });

    //이미지 선택후 선택한 이미지를 서버로 보내기 위한 과정
    const onChangeImages = useCallback((e) => {
        //image input에서 선택한 이미지 파일들을 e.target.files로 확인 가능
        //이걸 멀티파트의 폼데이터로 변환후 서버로 보낸다. 멀티파트여야 멀터가 처리 가능
        console.log('images', e.target.files);

        //선택한 이미지를 폼데이터 형식으로 만든다
        const imageFormData = new FormData();

        //왜 forEach 사용하는 거지?
        //e.target.files가 배열과 유사하게 생겼으나 배열이 아니기 때문에 [].forEach.call을 사용
        //즉 e.target.files는 배열이 아니기 때문에 forEach사용 불가능
        //[].forEach로 배열의 forEach 메서드를 빌려서 사용하는 것
        [].forEach.call(e.target.files, (f) => {
            //여기서 입력된 키값인 image가 post라우터 image api의 멀터 upload.array에서 사용된다
            imageFormData.append('image', f);
        });
        dispatch({
            type: UPLOAD_IMAGE_REQUEST,
            data: imageFormData,
        })

    });
    const onRemoveImage = useCallback(() => {
        dispatch({
            type: REMOVE_IMAGE,
            data: index,
        });
    });

    const onRemoveImageAll = useCallback((index) => {
        dispatch({
            type: REMOVE_IMAGE_ALL,
        });
    });
    //text와 image file을 formData로 통합하여 서버로 보낸다. 사실상 파일명 텍스트만 보내고 이미지는 스토리지(클라우드)에 저장
    const onSubmit = useCallback(() => {
        // 초기 텍스트로만 포스트를 올렸던 코드
        // dispatch({
        //     type: ADD_POST_REQUEST,
        //     data: text 
        // });

        if (!text || !text.trim()) {
            return alert('게시글을 작성하세요');
        }
        //게시글의 텍스트와 이미지를 FormData 객체로 변환
        const formData = new FormData();
        imagePaths.forEach((p) => {
            //image의 key값으로 path들을 formData에 appand한다
            formData.append('image', p);
        })
        //content를 key값으로 post input에 입력된 text를 append한다
        formData.append('content', text);
        //위에서 정한 FormData의 key값으로 req.body.~~~이 정해진다. 
        //결과적으로 post form에서 입력된 텍스트와 multer를 통해 처리된 이미지 경로로 formData가 구성
        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });
        dispatch({
            type: REMOVE_IMAGE_ALL,
        })
        //화면 최상단으로 이동
        window.scrollTo(0, 0);


        //사실상 이미 이미지는 스토리지에 저장되어 있는 상태니 이미지 경로만 필요해 위처럼 formData를 사용할 필요는 없다
        //하지만 router에서 upload.none()을 사용해보기 위해서 FormData 객체로 서버통신 해보는것
        //FormData 대신 그냥 json 보내려면 아래 코드처럼 작성하면 된다
        // dispatch({
        //     type : ADD_POST_REQUEST,
        //     data : {imagePaths, content : text},
        // });

    }, [text, imagePaths]);

    const imageInputHeight = imagePaths.length === 0 ? '0px' : '250px';

    return (
        <>
            <Form
                className='postInputForm'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                encType='multipart/form-data' onFinish={onSubmit}>

                {/* 이미지 미리보기 */}
                {imagePaths.length > 0 ? <Button
                    style={{ background: 'none', border: 'none', color: 'salmon', fontWeight: '800', fontSize: '1.2em' }}
                    onClick={onRemoveImageAll}>
                    Remove All Images</Button> : null}{/* 모든 이미지 업로드 이미지 삭제 버튼 */}
                <div style={{ display: 'flex', overflowX: 'scroll', alignItems: 'flex-end' }}>
                    {imagePaths.map((v, i) => (
                        <div key={v} style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', marginBottom: '10px' }}>
                            <img src={`${backUrl}/${v}`} alt={v} style={{ width: '180px', height: '200px', objectFit: 'cover' }}></img>
                            <Button
                                //인자를 받아 사용하는 함수 onRemoveImage를 onClick 리스너에 붙이고 싶을경우, 고차함수 활용
                                onClick={() => { onRemoveImage(i) }}
                                style={{ border: 'none', backgroundColor: 'salmon', color: 'white' }}>Delete</Button>
                        </div>
                    ))}
                </div>

                {/* 텍스트 입력 */}
                <Input.TextArea
                    className='PostInputTextArea'
                    required
                    value={text}
                    onChange={onChangeText}
                    rows={2}
                    maxLength={140}
                    placeholder={`What happened today?`}
                />

                {/* 이미지 첨부, 포스트 버튼 */}
                <div style={{
                    backgroundColor: 'mediumaquamarine',
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    {/* antd 아닌 일단 input 태그 써야지 ref 먹히고, antd는 innerref로 사용해야한다 */}
                    <input type='file' name='image' multiple hidden ref={imageInput} onChange={onChangeImages} />
                    <Button style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)', color: 'white' }} onClick={onClickImageUpload}>
                        {fileUp}
                    </Button>
                    <Button loading={addPostLoading} style={{ border: 'none', backgroundColor: 'mediumaquamarine', color: 'white' }} htmlType='submit'>
                        {send}
                    </Button>
                </div>


            </Form>
        </>
    );
}

export default PostInputForm;