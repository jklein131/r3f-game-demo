import React, { useRef } from 'react';
import Interact from '../components/Interact';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Interactable, { InteractionEvent } from '../@core/Interactable';
import Sprite, { SpriteRef } from '../@core/Sprite';
import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import waitForMs from '../@core/utils/waitForMs';
import spriteData from '../spriteData';
import { NotificationType } from 'src/@core/Notifications';

function WorkstationScript() {
    const { getComponent } = useGameObject();
    const workState = useRef(false);

    useGameObjectEvent<InteractionEvent>('interaction', () => {
        workState.current = !workState.current;

        if (workState.current) {
            getComponent<SpriteRef>('workstation').setState('workstation-2');
        } else {
            getComponent<SpriteRef>('workstation').setState('workstation-1');
        }

        return waitForMs(400);
    });

    return null;
}

export default function Workstation(props: GameObjectProps) {
    return (
        <GameObject {...props} layer={'item'}>
            <Interact showIndicator />
            <Sprite name="workstation" {...spriteData.objects} state="workstation-1" />
            <Collider />
            <Interact
                showIndicator
                message={{
                    title: 'This is a workstation Machine',
                    text: "Don't hurt me",
                    type: NotificationType.SUCCESS,
                    id: 'workstation-machine',
                    x: props.x,
                    y: props.y,
                    action: () => {},
                }}
            />

            <WorkstationScript />
        </GameObject>
    );
}
