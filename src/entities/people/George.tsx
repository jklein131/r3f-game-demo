import React, { useRef } from 'react';
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

export default function George(props: GameObjectProps) {
    return (
        <GameObject {...props} layer="character">
            <Wobble>
                <Sprite {...spriteData.buildings} state="george" />
            </Wobble>
            <Collider />
            <Interact
                showIndicator={false}
                message={{
                    title: 'Governor George',
                    text: "I'm the worlds youngest Governor at just 12 years. Every heard about crypto?",
                    type: NotificationType.TALKABLE,
                    x: props.x,
                    y: props.y,
                    id: 'coffee-machine',
                }}
            />
            {/* <CoffeeScript /> */}
        </GameObject>
    );
}