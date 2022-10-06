import React, { useRef } from 'react';
import { NotificationType } from '../@core/Notifications';
import Interact from '../components/Interact';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Interactable, { InteractionEvent } from '../@core/Interactable';
import { useSound } from '../@core/Sound';
import Sprite, { SpriteRef } from '../@core/Sprite';
import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import soundData from '../soundData';
import spriteData from '../spriteData';

function CoffeeScript() {
    const { getComponent } = useGameObject();
    const fillState = useRef(true);
    // const playSfx = useSound(soundData.drinking);

    useGameObjectEvent<InteractionEvent>('interaction', () => {
        if (fillState.current) {
            fillState.current = false;
            getComponent<SpriteRef>('Sprite').setState('coffee-machine-empty');
            // playSfx();
        }
    });

    return null;
}

export default function CoffeeMachine(props: GameObjectProps) {
    return (
        <GameObject {...props} layer="item">
            <Sprite {...spriteData.objects} state="bigtree1" />
            <Sprite {...spriteData.objects} state="bigtree2" offset={{ x: 0, y: 1 }} />
            <Collider />
            <Interact
                showIndicator={false}
                message={{
                    title: 'This is a coffee Machine',
                    text: "Don't hurt me",
                    type: NotificationType.TALKABLE,
                    x: props.x,
                    y: props.y,
                    id: 'coffee-machine',
                    action: () => {},
                }}
            />
            <CoffeeScript />
        </GameObject>
    );
}
