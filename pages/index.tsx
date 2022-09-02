import { css, Global } from '@emotion/core';
import React, { Fragment, useState } from 'react';
import AssetLoader from '../src/@core/AssetLoader';
import Game from '../src/@core/Game';
import Scene from '../src/@core/Scene';
import SceneManager from '../src/@core/SceneManager';
import useWindowSize from '../src/@core/useWindowSize';
import OfficeScene from '../src/scenes/OfficeScene';
import OtherScene from '../src/scenes/OtherScene';
import soundData from '../src/soundData';
import spriteData from '../src/spriteData';
import globalStyles from '../src/styles/global';
import DialogBox from '../src/components/DialogBox';

/* This example requires Tailwind CSS v2.0+ */


const styles = {
    root: (width: number, height: number) => css`
        width: ${width - (width % 2)}px;
        height: ${height - (height % 2)}px;
    `,
};

const urls = [
    ...Object.values(spriteData).map(data => data.src),
    ...Object.values(soundData).map(data => data.src),
    // flatten
].reduce<string[]>((acc, val) => acc.concat(val), []);

export default function App() {
    const [width, height] = useWindowSize();
    const [show, setShow] = useState(true);
    const [showTypingDone, setShowTypingDone] = React.useState(false);
    const [text, setText] = React.useState('Hi Stranger! Fancy seeing you here!');
    // const spaceKey = useKeyPress('t');
    // useGameLoop(() => {
    //     if (spaceKey && showTypingDone) {
    //         setText('');
    //     }
    // });
    const messages = [
        'This is a very cool RPG dialog message.',
        'If you would like to see more awesome stuff, check out the other writeups at codeworkshop.dev!',
        'Remember to wash your hands!',
    ];

    return (
        <>
            <Global styles={globalStyles} />

            <div css={styles.root(width, height)}>
                <DialogBox
                    characterName="JOsh"
                    onDialogEnded={() => {}}
                    messages={messages}
                    screenHeight={height}
                    screenWidth={width}
                />

                {/* <div
                    style={{
                        backgroundColor: '#dbbc7f',
                        position: 'fixed',
                        zIndex: 10,
                        top: 0,
                        border: 'solid black',
                        display: 'float',
                        padding: '1rem',
                        // height: '100vh',
                        width: '90vw',
                        margin: '1rem',

                        flexGrow: 1,
                        fontSize: '2rem',
                    }}
                >
                    <div
                        role="button"
                        onClick={() => {
                            setText('youre a creep');
                        }}
                    >
                        <Typist
                            onTypingDone={() => {
                                setShowTypingDone(true);
                            }}
                        >
                        {text}
                        </Typist>

                        {showTypingDone ? 'Press [Space] to continue' : ''}
                    </div>
                </div> */}

                <Game cameraZoom={80}>
                    <AssetLoader urls={urls} placeholder="Loading assets ...">
                        <SceneManager defaultScene="office">
                            <Scene id="office">
                                <OfficeScene />
                            </Scene>
                            <Scene id="other">
                                <OtherScene />
                            </Scene>
                        </SceneManager>
                    </AssetLoader>
                </Game>
            </div>
        </>
    );
}

/* This example requires Tailwind CSS v2.0+ */

export function Example() {
    const [show, setShow] = useState(true);

    return (
        <>
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
            >
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    <Transition
                        show={show}
                        as={Fragment}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon
                                            className="h-6 w-6 text-green-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">
                                            Successfully saved!
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Anyone with a link can now view this file.
                                        </p>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button
                                            type="button"
                                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => {
                                                setShow(false);
                                            }}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </>
    );
}
