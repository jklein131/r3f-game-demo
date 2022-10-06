import React, { useEffect, useRef } from 'react';
// import { HTML, HTMLProps } from 'drei';
import { Html } from '@react-three/drei';
import useGame from './useGame';
// import { HtmlProps } from '@react-three/drei/web/Html';

export default function HtmlOverlay({ children, ...props }: any) {
    const { paused } = useGame();
    const node = useRef<HTMLDivElement>();

    useEffect(() => {
        if (node.current?.parentElement) {
            node.current.parentElement.style.pointerEvents = 'none';
            node.current.parentElement.style.whiteSpace = 'nowrap';
        }
    }, []);

    if (paused) return null;

    return (
        <Html ref={node} zIndexRange={[1, 9]} eps={0} {...props}>
            {children}
        </Html>
    );
}
