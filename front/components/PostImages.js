import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";

import ImagesZoom from "./ImagesZoom";

//fontawesome package
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { backUrl } from "../config/config";
const plusIcon = <FontAwesomeIcon icon={faCirclePlus} />


//Image={post.Images}로 props를 받아온 컴포넌트
const PostImages = ({ images }) => {
    const [showImageZoom, setShowImageZoom] = useState(false);

    //이미지를 클릭하면 showImageZoom state가 true가 되고 이를 이용해 확대시킨다
    const onZoom = useCallback(() => {
        setShowImageZoom(true);
    }, [])
    const onClose = useCallback(() => {
        setShowImageZoom(false);
    }, [])


    //이미지 1개일때
    if (images.length === 1) {
        return (
            <>
                <img
                    //role='presentation', screen reader에서 클릭안해도 됨을 알려준다
                    role='presentation'
                    style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
                    src={`${backUrl}/${images[0].src}`}
                    alt={`${backUrl}/${images[0].src}`}
                    onClick={onZoom} />
                {showImageZoom &&
                    <ImagesZoom
                        setShowImageZoom={setShowImageZoom}
                        images={images}
                        onClose={onClose} />}
            </>
        )
    }
    //이미지 2개일때
    else if (images.length === 2) {
        return (
            <>
                <div
                    style={{ backgroundColor: 'rgba(0,0,0,1)' }}>
                    <img
                        style={{ width: '50%' }}
                        role='presentation'
                        src={`${backUrl}/${images[0].src}`}
                        alt={`${backUrl}/${images[0].src}`}
                        onClick={onZoom} />
                    <img
                        style={{ width: '50%' }}
                        role='presentation'
                        src={`${backUrl}/${images[1].src}`}
                        alt={`${backUrl}/${images[1].src}`}
                        onClick={onZoom} />
                    {showImageZoom && <ImagesZoom setShowImageZoom={setShowImageZoom} images={images} onClose={onClose} />}

                </div>
            </>
        )
    }
    //이미지 3개이상일때
    else if (images.length >= 3) {
        return (
            <>
                <div
                    onClick={onZoom}
                    style={{ backgroundColor: 'rgba(255,140,105,0.1)' }}>
                    <img
                        role='presentation'
                        style={{ width: '50%', height: 'auto' }}
                        src={`${backUrl}/${images[0].src}`}
                        alt={`${backUrl}/${images[0].src}`}
                    />
                    <div
                        role='presentation'
                        style={{
                            display: 'inline-block',
                            width: '50%',

                            textAlign: 'center',
                            verticalAlign: 'middle',
                            fontWeight: '600',
                            fontSize: '22px',
                            color: 'salmon'
                        }}
                    >
                        <span style={{ fontSize: '50px' }}>{plusIcon}</span>
                        <br />
                        {images.length - 1} images
                    </div>
                </div>
                {showImageZoom && <ImagesZoom setShowImageZoom={setShowImageZoom} images={images} onClose={onClose} />}


            </>
        )
    }
    return (
        <>
        </>
    );
}

export default PostImages;