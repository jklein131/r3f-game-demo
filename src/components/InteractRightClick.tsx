import React, { useRef } from 'react';
import Typist from 'react-typist';
import useGameLoop from '../@core/useGameLoop';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Interactable, { InteractionRightClickEvent } from '../@core/Interactable';
import Sprite, { SpriteRef } from '../@core/Sprite';
import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import waitForMs from '../@core/utils/waitForMs';
import spriteData from '../spriteData';
import HtmlOverlay from '../@core/HtmlOverlay';
import { useSound } from '../@core/Sound';
import soundData from '../soundData';

export function InteractScriptRightClick({ fnc }: { fnc: () => void }) {
    // const { getComponent } = useGameObject();
    const workState = useRef(false);
    const playSfx = useSound(soundData.drinking);
    // useGameLoop(time => {
    //     const pos = Math.abs((time % 1000) - 500) / 100;
    //     getComponent<SpriteRef>('indicator').setOffset({ x: 0, y: pos / 100 + 0.55 });
    // });

    useGameObjectEvent<InteractionRightClickEvent>('interaction-right-click', () => {
        playSfx();
        fnc();
        return waitForMs(400);
    });

    return null;
}

export default function InteractRightClick(
    props: GameObjectProps & { onRightClick: () => void }
) {
    return (
        <>
            {/* <HtmlOverlay
                center
                
                style={{
                    backgroundColor: '#dbbc7f',
                    position: 'fixed',
                    top: 0,
                    border: 'solid black',
                    display: 'float',
                    padding: '1rem',
                    // height: '100vh',
                    // width: '100vw',
                    margin: '1rem',

                    flexGrow: 1,
                    fontSize: '2rem',
                }}
            >
                <Typist onTypingDone={() => {}}>you are in trouble </Typist>
                {/* {showTypingDone ? 'Press [Space] to continue' : ''} 
            </HtmlOverlay> */}
            <Interactable />
            <InteractScriptRightClick fnc={props.onRightClick} />
            {/* <Sprite name="indicator" {...spriteData.objects} state="arrow" scale={0.5} /> */}
        </>
    );
}