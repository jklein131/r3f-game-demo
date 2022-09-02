import React, { useRef } from 'react';
import Typist from 'react-typist';
import useGameLoop from '../@core/useGameLoop';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Interactable, { InteractionEvent } from '../@core/Interactable';
import Sprite, { SpriteRef } from '../@core/Sprite';
import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import waitForMs from '../@core/utils/waitForMs';
import spriteData from '../spriteData';
import HtmlOverlay from '../@core/HtmlOverlay';

export function InteractScript() {
    const { getComponent } = useGameObject();
    const workState = useRef(false);
    useGameLoop(time => {
        const pos = Math.abs((time % 1000) - 500) / 100;
        getComponent<SpriteRef>('indicator').setOffset({ x: 0, y: pos / 100 + 0.55 });
    });

    useGameObjectEvent<InteractionEvent>('interaction', () => {
        workState.current = !workState.current;

        if (workState.current) {
            getComponent<SpriteRef>('indicator').setOffset({ x: -1, y: -1 });
        } else {
            getComponent<SpriteRef>('indicator').setOffset({ x: 1, y: 1 });
        }

        return waitForMs(400);
    });

    return null;
}

export default function Interact(props: GameObjectProps) {
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
            <InteractScript />
            <Sprite name="indicator" {...spriteData.objects} state="arrow" scale={0.5} />
            <Collider />
        </>
    );
}