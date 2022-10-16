import React, { useCallback, useRef } from 'react';
import { NotificationType } from '../../@core/Notifications';
import Interact from '../../components/Interact';
import Collider from '../../@core/Collider';
import GameObject, { GameObjectProps } from '../../@core/GameObject';
import Interactable, { InteractionEvent } from '../../@core/Interactable';
import { useSound } from '../../@core/Sound';
import Sprite, { SpriteRef } from '../../@core/Sprite';
import useGameObject from '../../@core/useGameObject';
import useGameObjectEvent from '../../@core/useGameObjectEvent';
import soundData from '../../soundData';
import spriteData from '../../spriteData';
import useGameLoop from 'src/@core/useGameLoop';
import { characterOffsetY } from 'src/components/CharacterScript';
import { useScene } from 'src/@core/Scene';
import { Wobble } from './Wobble';

// function CoffeeScript() {
//     const { getComponent } = useGameObject();
//     const fillState = useRef(true);
//     // const playSfx = useSound(soundData.drinking);

//     useGameObjectEvent<InteractionEvent>('interaction', () => {
//         if (fillState.current) {
//             fillState.current = false;
//             getComponent<SpriteRef>('Sprite').setState('coffee-machine-empty');
//             // playSfx();
//         }
//     });

//     return null;
// }

export default function Sally(props: GameObjectProps) {
    return (
        <GameObject {...props} layer="character">
            <Wobble>
                <Sprite {...spriteData.buildings} state="sally" />
            </Wobble>
            <Collider />
            <Interact
                showIndicator={false}
                message={{
                    title: 'Special Sally',
                    text: "Please don't talk to me",
                    type: NotificationType.TALKABLE,
                    x: props.x,
                    y: props.y,
                    id: 'coffee-sally',
                }}
            />
            {/* <CoffeeScript /> */}
        </GameObject>
    );
}
