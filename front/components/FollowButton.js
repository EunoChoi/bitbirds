import { Button } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({ post }) => {

    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    let isFollowing;
    useEffect(() => {
        if (me && me.FollowButton) {
            isFollowing = me.Followings.find((v) => (v.id === post.User.id));
        }
    }, [me, me.FollowButton])


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
    return (
        <>
            <Button onClick={followOrUnFollow}>
                {isFollowing ? 'UnFollow' : 'Follow'}
            </Button>
        </>
    )
}

export default FollowButton;