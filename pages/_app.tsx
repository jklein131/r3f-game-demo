import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            {/* <meta content="True" name="HandheldFriendly" />
            <meta
                content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"
                name="viewport"
            /> */}
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
