import React from 'react';
import Interact from '../components/Interact';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Sprite from '../@core/Sprite';
import spriteData from '../spriteData';

export default function Plant(props: GameObjectProps) {
    return (
        <GameObject layer="obstacle" {...props}>
            <Collider />
            <Interact showIndicator={false} />
            <Sprite {...spriteData.objects} state="plant" offset={{ x: 0, y: 0.25 }} />
        </GameObject>
    );
}
