import React, { useRef } from 'react';
import { NotificationType } from '../../@core/Notifications';
import Interact from '../../components/Interact';
import Collider from '../../@core/Collider';
import GameObject, { GameObjectProps } from '../../@core/GameObject';
import Interactable, { InteractionEvent, SpaceDoorEvent } from '../../@core/Interactable';
import { useSound } from '../../@core/Sound';
import Sprite, { SpriteRef } from '../../@core/Sprite';
import useGameObject from '../../@core/useGameObject';
import useGameObjectEvent from '../../@core/useGameObjectEvent';
import soundData from '../../soundData';
import spriteData from '../../spriteData';
import { Wobble } from './Wobble';
import useGame from 'src/@core/useGame';
import SpriteHtml from 'src/@core/SpriteHtml';
import PlotPicker from 'src/components/ui/plotPicker';

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

export default function Henry(props: GameObjectProps) {
    const { publish } = useGame();
    return (
        <GameObject {...props} layer="character">
            <Wobble>
                <Sprite {...spriteData.buildings} state="henry" />
            </Wobble>
            <Collider />
            <Interact
                showIndicator={true}
                message={{
                    title: 'Hanger Henry',
                    text: 'Wanna go down to the surface?',
                    type: NotificationType.TALKABLE,
                    x: props.x,
                    y: props.y,
                    id: 'hanger-genry',
                }}
                conversation={{
                    convo: [
                        {
                            question: 'root',
                            response:
                                'Welcome to hanger, from here you can visit the planet surface and start mining for rare NFTs. ',
                            responses: [
                                'What kind of mining is down there?',
                                'How does Mining work?',
                                "I'd like to purchase a plot.",
                            ],
                        },
                        {
                            question: 'What kind of mining is down there?',
                            response:
                                "The whole planet is covered in tar from years of pollution, it's our job to clean it up and keep what we find!",
                            responses: [
                                'How does Mining work?',
                                "I'd like to purchase a plot.",
                            ],
                        },
                        {
                            question: 'How does Mining work?',
                            response:
                                "Once you purchase a plot, you can begin your mining operation. For each plot you can expect 1 or more random NFTs. To see what's on the surface, visit the archive.",
                            responses: [
                                'What kind of mining is down there?',
                                "I'd like to purchase a plot.",
                            ],
                        },
                        {
                            // success: true,
                            question: "I'd like to purchase a plot.",
                            onResponse: () => {
                                // alert('ok');
                                console.log('space door open');
                                publish<SpaceDoorEvent>('space-door', {
                                    name: 'main',
                                    pos: 'open',
                                });
                            },
                            response:
                                'I have two plots for sale, which one would you like?',
                            responses: [
                                // 'How does Mining work?',
                                // 'What kind of mining is down there?',
                            ],
                            element: setCurrentQ => <PlotPicker></PlotPicker>,
                        },
                    ],
                    profile: (
                        <SpriteHtml {...spriteData.buildings} state="henry"></SpriteHtml>
                    ),
                }}
            />
            {/* <CoffeeScript /> */}
        </GameObject>
    );
}
