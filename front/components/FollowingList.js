import { Card, List } from 'antd';
import { DeleteOutlined, ExpandOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux';

import { UNFOLLOW_REQUEST } from '../reducers/user';

const FollowingList = ({ header, data }) => {
    const dispatch = useDispatch();
    return (
        <>
            <div style={{ marginBottom: '40px' }}>
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
                        <List.Item style={{ textAlign: 'center', }}>
                            <Card actions={[<DeleteOutlined onClick={
                                () =>
                                    dispatch({
                                        type: UNFOLLOW_REQUEST,
                                        data: {
                                            userId: item.id,
                                        }
                                    })
                            } />]}>
                                <Card.Meta className='folloCard' description={item.nickname} />
                            </Card>
                        </List.Item>
                    )} />
            </div>
        </>
    )
}

export default FollowingList;