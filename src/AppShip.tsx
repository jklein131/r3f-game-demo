/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';
import React, { useState, Fragment } from 'react';
import AssetLoader, { TextureLoaderContext } from './@core/AssetLoader';
import Game from './@core/Game';
import Scene from './@core/Scene';
import SceneManager from './@core/SceneManager';
import useWindowSize from './@core/useWindowSize';
import OfficeScene from './scenes/OfficeScene';
import OtherScene from './scenes/OtherScene';
import soundData from './soundData';
import spriteData from './spriteData';
import globalStyles from './styles/global';
import { NotificationWindow } from './@core/Notifications';
import createPubSub from './@core/utils/createPubSub';
import TreeSelector from './@core/TreeSelector';
import MiningScene from './scenes/MiningScene';
import TestRenderer from 'react-test-renderer';
import ShipScene from './scenes/ShipScene';

const styles = {
    root: (width: number, height: number) => css`
        display: flex;
        width: ${width - (width % 2)}px;
        height: ${height - (height % 2)}px;
        justify-content: center;
        align-items: center;
        background-image: url('assets/earth2.webp');
        animation: AnimateBG 120s ease infinite;
        @keyframes AnimateBG {
            0% {
                background-position: 20% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 20% 50%;
            }
        }
    `,
};

const spriteUrls = [
    ...Object.values(spriteData).map(data => data.src),
    // flatten
].reduce<string[]>((acc, val) => acc.concat(val), []);
const urls = [
    ...Object.values(spriteData).map(data => data.src),
    ...Object.values(soundData).map(data => data.src),
    // flatten
].reduce<string[]>((acc, val) => acc.concat(val), []);

export default function App() {
    const [width, height] = useWindowSize();
    const [showTypingDone, setShowTypingDone] = React.useState(false);
    const [text, setText] = React.useState('Hi Stranger! Fancy seeing you here!');
    // const spaceKey = useKeyPress('t');
    // useGameLoop(() => {
    //     if (spaceKey && showTypingDone) {
    //         setText('');
    //     }
    // });
    const [pubSub] = useState(() => createPubSub());

    const game = (
        <Game cameraZoom={80} pubSub={pubSub}>
            <AssetLoader urls={urls} placeholder="Loading assets ...">
                <SceneManager defaultScene="ShipScene">
                    <Scene id="ShipScene">
                        <ShipScene />
                    </Scene>
                </SceneManager>
            </AssetLoader>
        </Game>
    );
    return (
        <>
            <Global styles={globalStyles} />
            <NotificationWindow pubSub={pubSub} />
            <div id="swag2" css={styles.root(width, height)}>
                {game}
            </div>
        </>
    );
}
