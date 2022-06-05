import { EllipsisOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, RetweetOutlined } from "@ant-design/icons";
import { Card, Popover, Button, Descriptions, Avatar, List, Comment } from "antd";
import ButtonGroup from "antd/lib/button/button-group";
import Title from "antd/lib/skeleton/Title";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Link from 'next/link';

import moment from 'moment';

//componenet
import FollowButton from './FollowButton';
import PostImages from "./PostImages";
import PostCardContent from "./PostCardContent";
import CommentInputForm from "./CommentInputForm";
import { DELETE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from "../reducers/post";

//mainPost[] 배열안 value들이 props로 전달되었다
const PostCard = ({ post }) => {

    const dispatch = useDispatch();

    //state.user.username null이 아내라면 state.user.id를 불러온다
    //user id

    const id = useSelector((state) => state.user.logInDone && state.user.me.id);
    const like = post.Likers && post.Likers.find((v) => v.id === id); //post.Likers는 fullPost include 에서 정해줬다. load로 불러줄때도
    const { logInDone } = useSelector((state) => state.user);
    const { deletePostLoading } = useSelector((state) => state.post);

    //toggle state, 일단 false넣어둠, 이후에 리덕스에서 불러오도록 수정
    const [toggleComment, setToggleComment] = useState(false);

    const onRetweet = useCallback(() => {
        if (!id) { return alert('Please login for service'); }
        dispatch({
            type: RETWEET_REQUEST,
            //게시글 id를 서버에 보냄 ==> post.id
            data: { postId: post.id },
        });
        window.scrollTo(0, 0);
    }, [id]);

    const onLike = useCallback(() => {
        if (!id) { return alert('Please login for service'); }
        dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);
    const onUnLike = useCallback(() => {
        if (!id) { return alert('Please login for service'); }
        dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);

    const onToggleComment = useCallback(() => {
        setToggleComment(c => !c);
    }, []);

    const deletePost = useCallback(() => {
        //post의 id로 찾아서 삭제
        console.log(post.id);
        dispatch(
            {
                type: DELETE_POST_REQUEST,
                data: { postId: post.id },
            });
    }, []);
    const userInfoUrl = `/about/${post.User.id}`;


    return (
        <>
            <div className="postCard" >
                {/* antd에서 지원하는 Card Component 공식문서 보고 옵션 알아두기 */}
                <Card
                    //post에 image가 존재한다면 Card 컴포넌트 내부에 이미지를 삽입한다
                    cover={post.Images && <PostImages images={post.Images} />}
                    extra={<div>
                        <Link href={userInfoUrl}><Button style={{ marginRight: '10px' }}>View</Button></Link>
                        {id && <FollowButton post={post} />}
                    </div>}

                    //action옵션에 antd에서 지원하는 버튼 삽입
                    actions={[
                        <RetweetOutlined key='retweet' onClick={onRetweet} />,

                        // ToggleLike가 true일때 빨간색 하트가 나타난다
                        like ? <HeartTwoTone twoToneColor='#eb2f96' key='heart' onClick={onUnLike} />
                            : <HeartOutlined key='heart' onClick={onLike} />,

                        <MessageOutlined key='comment' onClick={onToggleComment} />,

                        //popover는 ...버튼 hover시 펼쳐진다.
                        <Popover key='more' content={(
                            ///popover눌러서 펼쳐졌을때 버튼그룹이 나온다
                            <ButtonGroup>
                                {/* 내가 쓴 글인지 확인하고 수정, 삭제버튼을 나타낸다 */}
                                {/* 로그인된 id와 post의 id를 비교 */}
                                {/* post.id와 post.User.id는 다름 */}
                                {id && id === post.User.id ? <>
                                    <Button onClick={() => { alert('구현 예정...') }} key='edit'>Edit</Button>
                                    <Button loading={deletePostLoading} key='delete' type='danger' onClick={deletePost}>Delete</Button>
                                </> : <Button onClick={() => { alert('구현 예정...') }} key='report'>Report</Button>}
                            </ButtonGroup>
                        )}>
                            <EllipsisOutlined />
                        </Popover>,
                    ]}>
                    <div style={{ float: 'right', color: 'grey' }}>{moment(post.createdAt).format('MMM Do YY, h:mm')}</div>
                    <Card.Meta
                        avatar={post.Retweet ? null : <Avatar>{post.User.nickname && post.User.nickname[0]}</Avatar>}
                        title={post.RetweetId === null ? post.User.nickname : `💡 ${post.User.nickname}`}
                        description={<PostCardContent postData={post.Retweet ? `↳ ${post.User.nickname} retweet ${post.Retweet.User.nickname}'s post.` : post.content} />}
                    />

                    {post.Retweet ?
                        <div style={{ padding: '20px 30px 5px 30px' }}>
                            <Card
                                //post에 image가 존재한다면 Card 컴포넌트 내부에 이미지를 삽입한다
                                cover={post.Retweet && post.Retweet.Images && <PostImages images={post.Retweet && post.Retweet.Images} />}>
                                <div style={{ float: 'right', color: 'grey' }}>{moment(post.createdAt).format('MMM Do YY, h:mm')}</div>
                                <Card.Meta
                                    avatar={<Avatar>{post.Retweet && post.Retweet.User.nickname[0]}</Avatar>}
                                    title={post.Retweet && post.Retweet.User.nickname}
                                    description={<PostCardContent postData={post.Retweet && post.Retweet.content} />}
                                />
                            </Card>
                        </div>

                        :
                        null}

                </Card>


                {/* ToggleComment가 true일때 나타난다
                 comment가 여러개면 comment form 여러개 나와야하므로 map사용 */}
                {toggleComment ?
                    <div>
                        {/* comment input area */}
                        {/* 로그인 상태라면 commentinputform을 렌더 */}
                        {logInDone ? <CommentInputForm post={post} /> : null}

                        {/* comment list  */}
                        <List
                            style={{ backgroundColor: 'rgba(0,0,0,0)', padding: '30px' }}
                            header={`There are ${post.Comments.length} comments.`}
                            itemLayout='horizontal'

                            //dataSource, renderItem 속성으로 리스트 내부 값들을 나타난대
                            dataSource={post.Comments}
                            renderItem={(item) => (
                                <li>
                                    {/* atnd에서 지원하는 댓글 컴포넌트 */}
                                    <Comment
                                        author={item.User.nickname}
                                        avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                                        content={item.content}
                                    />
                                </li>
                            )}
                        />
                    </div> : null}
            </div>
        </>
    );
}

export default PostCard;