import { Card, List } from 'antd';
import { DeleteOutlined, ExpandOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux';
import { DELETE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowerList = ({ header, data }) => {

    const dispatch = useDispatch();

    return (
        <>
            <div>
                <h2 style={{ color: 'rgba(0,0,0,0.35)' }}>{header}</h2>
                <List
                    grid={{
                        gutter: 16,
                        xs: 2,
                        sm: 2,
                        md: 2,
                        lg: 2,
                        xl: 2,
                        xxl: 2,
                    }}
                    dataSource={data}
                    loadMore={<div onClick={() => { alert('구현 예정...') }} style={{ marginTop: '10px', textAlign: 'center', fontWeight: '600', color: 'steelblue' }}>More <ExpandOutlined /></div>}
                    renderItem={item => (
                        <List.Item style={{ textAlign: 'center' }}>
                            <Card actions={[<DeleteOutlined onClick={() => {
                                //나를 팔로우한 상대방을 팔로워 취소시킨다
                                dispatch({
                                    type: DELETE_FOLLOWER_REQUEST,
                                    data: {
                                        userId: item.id,
                                    }
                                });
                            }} />]}>
                                <Card.Meta className='folloCard' description={item.nickname} />
                            </Card>
                        </List.Item>
                    )} />
            </div>
        </>
    )
}

export default FollowerList;