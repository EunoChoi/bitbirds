import { useRef, useEffect } from 'react';
import { Carousel } from 'antd';

//fontawecome 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { backUrl } from '../../config/config';

const xmark = <FontAwesomeIcon icon={faCircleXmark} />
const imagesIcon = <FontAwesomeIcon icon={faImages} />

//그냥 바로 imagesZoom.js를 만들지 않고 imagesZoom/index.js 만든 이유가 뭘까?
//강의에서 언급했었는데 지나쳤다 찾아보자

const ImagesZoom = ({ images, onClose }) => {

    const slider = useRef();

    // const inputRef = useRef();
    // useEffect(() => { inputRef.current.focus(); }, []);

    // const focusRef = () => {
    //     inputRef.current.focus();
    // }

    // const onKeyDown = (e) => {
    //     console.log(e.keyCode);
    //     //37, left arrow key
    //     if (e.keyCode === 37) {
    //         slider.current.prev();
    //     }
    //     //39, right arrow key
    //     if (e.keyCode === 39) {
    //         slider.current.next();
    //     }
    //     //27,esc key
    //     if (e.keyCode === 27) {
    //         onClose();
    //     }
    // }

    return (
        <>
            <div className='zoom'>
                <header>
                    <span>{imagesIcon}</span>
                    <span style={{ color: 'white', marginLeft: '10px' }}>Images</span>
                </header>
                <section >
                    <Carousel
                        arrows
                        ref={slider}
                        dots={false}>
                        {images.map((v, index) => (
                            <div key={v} className='imgWrapper'>
                                <img src={`${backUrl}/${v.src}`} alt={`${backUrl}/${v.src}`} />
                            </div>
                        ))}
                    </Carousel>
                </section>

                <footer>
                    <button onClick={onClose}>{xmark}</button>
                </footer>
            </div>
        </>
    )
}

export default ImagesZoom;


