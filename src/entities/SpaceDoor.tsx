import React, { useEffect, useRef, useState } from 'react';
import Interact from '../components/Interact';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Sprite from '../@core/Sprite';
import spriteData from '../spriteData';
import { NotificationType } from 'src/@core/Notifications';
import useGame from 'src/@core/useGame';
import { SpaceDoorEvent } from 'src/@core/Interactable';
import useCircleOfSight from 'src/@core/useCircleOfSight';

export default function SpaceDoor(props: GameObjectProps) {
    const { subscribe, unsubscribe } = useGame();
    const [open, setOpen] = useState(false);
    const cos = useCircleOfSight();
    const tiles = cos({ x: props.x, y: props.y }, 2);

    useEffect(() => {
        const unsubscribe = subscribe<SpaceDoorEvent>('space-door', type => {
            if (type.pos === 'open' && props.name === type.name) {
                setOpen(true);
            }
            console.log('from space door');
        });
        return () => {
            unsubscribe();
        };
    });
    return (
        <GameObject name="spaceshipdoor" {...props} layer="wall">
            {!open && <Collider />}
            {!open && <Sprite {...spriteData.ship} state="1" />}
            {!open && (
                <Interact
                    showIndicator={false}
                    message={{
                        title: 'Door',
                        text: "It's Locked",
                        type: NotificationType.FAILURE,
                        x: props.x,
                        y: props.y,
                        id: 'door-' + props.x + props.y,
                    }}
                />
            )}
            {!open && props.children}
        </GameObject>
    );
}
