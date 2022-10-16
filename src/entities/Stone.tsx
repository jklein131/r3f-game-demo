import React, { Fragment, useRef, useState } from 'react';
import Collider from '../@core/Collider';
import Interactable, { InteractableRef, InteractionEvent } from '../@core/Interactable';
import { WillMoveEvent } from '../@core/Moveable';
import { NotificationEvent, NotificationType } from '../@core/Notifications';
import { useSound } from '../@core/Sound';
import useGame from '../@core/useGame';
import useGameLoop from '../@core/useGameLoop';
import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import Interact from '../components/Interact';
import Mineable from '../components/Mineable';
import soundData from '../soundData';
import { AdditiveBlending, AnimationUtils, NormalBlending } from 'three';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Sprite, { SpriteRef } from '../@core/Sprite';
import spriteData from '../spriteData';
import HtmlOverlay from 'src/@core/HtmlOverlay';
import { NFTRoll } from 'src/components/ui/MiningSuccessOverlay';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
// export function TarScript({ animate }: { animate: boolean }) {
//     const { getComponent } = useGameObject();
//     const workState = useRef(false);
//     // useGameLoop(time => {
//     //     if (animate) {
//     //         const pos = ((time % 10000) - 5000) / 20000;
//     //         getComponent<SpriteRef>('tar').setScale(2.4 + pos);
//     //     }
//     // });

//     return null;
// }

function RockScript() {
    const { getComponent } = useGameObject();
    const { subscribe } = useGame();
    const mining = useRef(false);
    const playSfx = useSound(soundData.drinking);

    subscribe<WillMoveEvent>('will-move', () => {
        mining.current = false;
        // getComponent<SpriteRef>('Sprite').setState('coffee-machine-empty');
        // playSfx();
    });

    return null;
}

export default function Stone(props: GameObjectProps & { amount: number }) {
    const { publish } = useGame();
    const [amount, setAmount] = useState(props.amount);
    const stoneState = ((props.x + props.y) % 15) + 1;
    const seed = useRef(getRandomInt(0, 360));
    const isCoal = seed.current < 300;
    const isRuby = seed.current > 300 && seed.current < 330;
    // let isCoal = false;
    let isGold = false;
    const onAfter = (isRuby: boolean) => () => {
        if (isRuby) {
            publish<NotificationEvent>('notification', {
                type: NotificationType.SUCCESS,
                title: 'Artifact found!',
                text: 'We found something under the tar. What is it?',
                x: props.x,
                y: props.y,
                id: 'nft-found' + props.x + '-' + props.y,
                unNotifyOnMove: false,
                action: async () => {
                    await publish<NFTRoll>('nft-roll-ack', { dates: 'hello' });
                    return true;
                },
            });
        }
    };
    return (
        <GameObject
            key={'stonewrap' + props.x + '-' + props.y}
            {...props}
            layer="ground-decal"
        >
            <RockScript></RockScript>
            <Mineable
                onAfter={onAfter(isRuby)}
                amount={amount}
                setAmount={setAmount}
                after={
                    <Fragment key={'floor' + props.x.toString() + props.y.toString()}>
                        <Sprite {...spriteData.buildings} state="lava" />
                    </Fragment>
                }
            >
                <HtmlOverlay>
                    {isRuby ? 'T' : 'F'}
                    {amount}
                </HtmlOverlay>
                <Interact
                    showIndicator={false}
                    // message={{
                    //     title: 'I am a Stone',
                    //     text: "I don't think I can cross this. " + amount.toString(),
                    //     type: NotificationType.FAILURE,
                    //     x: props.x,
                    //     y: props.y,
                    //     id: 'tar-x' + props.x.toString() + props.y.toString(),
                    //     action: () => {},
                    // }}
                />
                <Sprite
                    {...spriteData.stones}
                    state={stoneState.toString()}
                    name="stone"
                    // scale={((props.amount / 999) * 1) / 2 + 1}
                    // offset={{ x: (props.x % 10) / 5, y: (props.y % 10) / 5 }}
                    // rotation={getRandomInt(0, 360)}
                    blending={isGold ? AdditiveBlending : NormalBlending}
                    color={isCoal ? '#555' : isRuby ? 'red' : isGold ? 'yellow' : '#fff'}
                ></Sprite>
                <Collider />
            </Mineable>
        </GameObject>
    );
}
