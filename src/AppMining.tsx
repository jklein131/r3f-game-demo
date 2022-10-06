/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';
import React, { useState, Fragment } from 'react';
import AssetLoader from './@core/AssetLoader';
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

const styles = {
    root: (width: number, height: number) => css`
        display: flex;
        width: ${width - (width % 2)}px;
        height: ${height - (height % 2)}px;
        justify-content: center;
        align-items: center;
    `,
};

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
    return (
        <>
            <Global styles={globalStyles} />
            <NotificationWindow pubSub={pubSub} />
            <div id="swag2" css={styles.root(width, height)}>
                <Game cameraZoom={80} pubSub={pubSub}>
                    <AssetLoader urls={urls} placeholder="Loading assets ...">
                        <SceneManager defaultScene="mining">
                            <Scene id="mining">
                                <MiningScene />
                            </Scene>
                        </SceneManager>
                    </AssetLoader>
                </Game>
            </div>
        </>
    );
}
