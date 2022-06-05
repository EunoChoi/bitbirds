import { Input, Form, Row, Col } from 'antd';
import { useEffect } from 'react';

//redux
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const EditForm = ({ header }) => {

    //redux store 접근
    const dispatch = useDispatch();

    const [nickname, onChangeNickname] = useInput('');

    const onSubmitNickname = () => {
        console.log(nickname);
        dispatch({
            type: CHANGE_NICKNAME_REQUEST,
            data: { nickname: nickname },
        });
    }

    return (
        <>
            <h2 style={{ color: 'rgba(0,0,0,0.35)' }}>
                {header}
            </h2>
            <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Row gutter={16} style={{ width: '100%' }}>
                    <Col style={{ marginBottom: '10px' }}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}>
                        <Form header={header} onFinish={onSubmitNickname} >
                            <Input.Search
                                placeholder='Nickname'
                                enterButton='Edit'
                                value={nickname}
                                onChange={onChangeNickname}
                                onSearch={onSubmitNickname}
                            />
                        </Form>
                    </Col>
                    <Col style={{ marginBottom: '10px' }}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}>
                        <Form onFinish={() => { alert('구현 예정..') }}>
                            <Input.Search
                                onSearch={() => { alert('구현 예정..') }}
                                placeholder='Password'
                                enterButton='Edit' />
                        </Form>
                    </Col>
                </Row>


            </div>
        </>
    )
}

export default EditForm;