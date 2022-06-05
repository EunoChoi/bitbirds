import React, { useEffect } from 'react';
import 'antd/dist/antd.css';

import propTypes from 'prop-types';
import Head from 'next/head';
import '../css/app.css';

//next redux wrapper로 만들어냄
import wrapper from '../store/configureStore';


const App = ({ Component }) => {



    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <title>sns</title>
                <link
                    rel="stylesheet"
                    type="text/css"
                    charset="UTF-8"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
                />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
                />
            </Head>
            <Component />
        </>
    );
}

App.prototype = {
    Component: propTypes.elementType.isRequired,
}



//wrapper로 감싸서 redux state들을 사용
export default wrapper.withRedux(App);
