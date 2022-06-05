import Link from "next/dist/client/link";


const PostCardContent = ({ postData }) => {
    return (
        <>
            {postData && postData.split(/(#[^\s#]+)/g).
                map((v, index) => {
                    if (v.match(/(#[^\s#]+)/)) {
                        //ract link 이용, pages 폴더안에 hashtag 폴더 만들어서 안파일을 페이지로 사용
                        //v.slice(1)해서 앞에 #만 잘려나가고 텍스트만 href에 추가
                        return <Link href={`/hashtag/${v.slice(1)}`} key={index}><a>{v}</a></Link>
                    }
                    return v;
                })}
        </>);
}
export default PostCardContent;