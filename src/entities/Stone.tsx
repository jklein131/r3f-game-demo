import React, { Fragment, useRef, useState } from 'react';
import Collider from 'src/@core/Collider';
import Graphic from 'src/@core/Graphic';
import HtmlOverlay from 'src/@core/HtmlOverlay';
import Interactable, { InteractableRef, InteractionEvent } from 'src/@core/Interactable';
import { WillMoveEvent } from 'src/@core/Moveable';
import { NotificationType } from 'src/@core/Notifications';
import { useSound } from 'src/@core/Sound';
import useGame from 'src/@core/useGame';
import useGameLoop from 'src/@core/useGameLoop';
import useGameObject from 'src/@core/useGameObject';
import useGameObjectEvent from 'src/@core/useGameObjectEvent';
import Interact from 'src/components/Interact';
import Mineable from 'src/components/Mineable';
import soundData from 'src/soundData';
import { AdditiveBlending, AnimationUtils, NormalBlending } from 'three';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Sprite, { SpriteRef } from '../@core/Sprite';
import spriteData from '../spriteData';

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
        playSfx();
    });

    return null;
}

export default function Stone(props: GameObjectProps & { amount: number }) {
    const [amount, setAmount] = useState(props.amount);
    const stoneState = ((props.x + props.y) % 15) + 1;
    const isCoal = getRandomInt(0, 360) < 50;
    // let isCoal = false;
    let isGold = false;
    let isRuby = false;
    if (!isCoal) {
        isGold = getRandomInt(0, 360) < 10;
    }
    if (!isGold && !isCoal) {
        isRuby = getRandomInt(0, 360) < 50;
    }
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

            <RockScript></RockScript>

            <Mineable
                amount={amount}
                setAmount={setAmount}
                after={
                    <Fragment key={'floor' + props.x.toString() + props.y.toString()}>
                        <Sprite {...spriteData.objects} state="floor" />
                    </Fragment>
                }
            >
                <HtmlOverlay>
                    <span className="font-serif">{amount.toString()}</span>
                </HtmlOverlay>
                <Interact
                    showIndicator={false}
                    message={{
                        title: 'I am a Stone',
                        text: "I don't think I can cross this. " + amount.toString(),
                        type: NotificationType.FAILURE,
                        x: props.x,
                        y: props.y,
                        id: 'tar-x' + props.x.toString() + props.y.toString(),
                        action: () => {},
                    }}
                />
                <Sprite
                    {...spriteData.stones}
                    state={stoneState.toString()}
                    name="stone"
                    basic
                    // scale={((props.amount / 999) * 1) / 2 + 1}
                    // offset={{ x: (props.x % 10) / 5, y: (props.y % 10) / 5 }}
                    // rotation={getRandomInt(0, 360)}
                    // blending={isGold ? AdditiveBlending : NormalBlending}
                    color={isCoal ? '#555' : isRuby ? 'red' : isGold ? 'yellow' : '#fff'}
                ></Sprite>
                <Collider />
            </Mineable>
        </GameObject>
    );
}
