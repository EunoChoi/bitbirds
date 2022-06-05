import { Button } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({ post }) => {

    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const isFollowing = me && me.Followings.find((v) => v.id === post.User.id);



    const followOrUnFollow = () => {
        if (isFollowing) {
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: {
                    //게시글의 id를 디스패치로 보냄
                    userId: post.User.id,
                },
            });
        }
        else {
            dispatch({
                type: FOLLOW_REQUEST,
                data: {
                    //게시글의 id를 디스패치로 보냄
                    userId: post.User.id,
                },
            });
        }
    }
    //내 게시글은 버튼이 안나타나도록
    if (post.User.id === me.id) {
        return null;
    }
    return (
        <>
            <Button onClick={followOrUnFollow}>
                {isFollowing ? 'UnFollow' : 'Follow'}
            </Button>
        </>
    )
}

export default FollowButton;