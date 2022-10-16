import React, { useRef } from 'react';
import Collider from 'src/@core/Collider';
import Graphic from 'src/@core/Graphic';
import Interactable from 'src/@core/Interactable';
import { NotificationType } from 'src/@core/Notifications';
import useGameLoop from 'src/@core/useGameLoop';
import useGameObject from 'src/@core/useGameObject';
import Interact from 'src/components/Interact';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Sprite, { SpriteRef } from '../@core/Sprite';
import spriteData from '../spriteData';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
export function TarScript({ animate }: { animate: boolean }) {
    const { getComponent } = useGameObject();
    const workState = useRef(false);
    // useGameLoop(time => {
    //     if (animate) {
    //         const pos = ((time % 10000) - 5000) / 20000;
    //         getComponent<SpriteRef>('tar').setScale(2.4 + pos);
    //     }
    // });

    return null;
}

export default function Tar(props: GameObjectProps) {
    return (
        <GameObject {...props} layer="ground-decal">
            {/* <Graphic
                {...spriteData.tar}
                state={show ? 'default' : 'static'}
                startFrame={
                    show
                        ? getRandomInt(0, spriteData.tar.sheet.default.length + 1)
                        : undefined
                }
                basic
            /> */}
            <Collider />
            <Interact
                showIndicator={false}
                message={{
                    title: 'Looks like a pile of tar',
                    text: "I don't think I can cross this. ",
                    type: NotificationType.FAILURE,
                    x: props.x,
                    y: props.y,
                    id: 'tar-x' + props.x.toString() + props.y.toString(),
                }}
            />
            <TarScript animate={true}></TarScript>
            <Sprite
                {...spriteData.tar2}
                state={'default'}
                name="tar"
                scale={2}
                rotation={getRandomInt(0, 360)}
            ></Sprite>
        </GameObject>
    );
}
