
import { Card, Avatar, Button } from 'antd';
import { useCallback, useEffect } from 'react';
import { faker } from '@faker-js/faker';


//redux
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

//next
import Router from 'next/router';

//reducer action creator
import { actionLogOutRequest } from '../reducers/user';


//login이 성공하면 나타나는 userProfile component
const UserProfile = () => {

    const dispatch = useDispatch();
    const { logOutLoading, me } = useSelector((state) => state.user);

    // const imageUrl = useEffect(() => (faker.image.people(640, 320, true)), []);

    const logout = useCallback(() => {
        dispatch(actionLogOutRequest());
        return;
    }, []);

    const goProfile = () => {
        Router.push('/profile');
    }


    return (
        <div className='userProfile'>
            <Card
                style={{ textAlign: 'center', width: '100%' }}

                // 차후에 이미지 수정 기능넣고 추가
                // cover={
                //     <img
                //         style={{ borderBottom: 'solid 1px rgba(0,0,0,0.05)' }}
                //         alt="example"
                //         src='./images/pencil.jpg'
                //     />
                // }
                // actions 속성에 배열로 들어갈 태그 요소들을 담는다, action 클릭 동작으로 사용 가능
                // 태그가 배열로 사용될때는 key필요
                actions={[
                    <div className='userProfile__action' key="twit">Post<br />{me.Posts.length}</div>,
                    <div className='userProfile__action' onClick={goProfile} key="followingr">Following<br />{me.Followings.length}</div>,
                    <div className='userProfile__action' onClick={goProfile} key="follower">Follower<br />{me.Followers.length}</div>
                ]}
            >
                {/* //card내부에 나타낼 정보들을 <Card.Meta />에 적는다 */}
                <Card.Meta
                    //원형으로 프로필 사진을 보여주는 Avatar 컴포넌트
                    avatar={<Avatar>{me.email[0]}</Avatar>}
                    title={me.email}
                    description={`[ ${me.nickname} ]`}
                />
                <Button type='primary' loading={logOutLoading} className='logoutBtn' onClick={logout}>Logout</Button>
            </Card>
        </div >
    );
}

export default UserProfile;