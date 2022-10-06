import { css } from '@emotion/react';

export default function globalStyles() {
    return css`
        :root {
            user-select: none;
        }
        :root,
        body,
        #root {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            height: 100%;
        }
        body {
            position: relative;
            margin: 0;
            padding: 0;
            overflow: hidden;
            color: white;
            background-image: linear-gradient(
                -45deg,
                rgba(10, 173, 150, 1) 0%,
                rgba(25, 111, 115, 1) 25%,
                rgba(40, 68, 60, 1) 51%,
                rgba(50, 53, 57, 1) 100%
            );
            animation: AnimateBG 10s ease infinite;
        }
        @keyframes AnimateBG {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
    `;
}
