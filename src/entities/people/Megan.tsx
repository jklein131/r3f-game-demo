import React, { useRef } from 'react';
import { Conversation, NotificationType } from '../../@core/Notifications';
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

export default function Megan(props: GameObjectProps) {
    const { publish } = useGame();
    return (
        <GameObject {...props} layer="character">
            <Wobble>
                <Sprite {...spriteData.buildings} state="megan" />
            </Wobble>
            <Collider />
            <Interact
                showIndicator={true}
                message={{
                    title: 'Master Megan',
                    text: "Ahh you're finally awake!",
                    profile: (
                        <SpriteHtml {...spriteData.buildings} state="megan"></SpriteHtml>
                    ),
                    type: NotificationType.TALKABLE,
                    x: props.x,
                    y: props.y,
                    id: 'mm-pm',
                }}
                conversation={{
                    convo: [
                        {
                            question: 'root',
                            response: 'Welcome aboard my ship, ready to get started?',
                            responses: ['Where am I?', 'Work?', 'Reporting for Duty!'],
                        },
                        {
                            question: 'Where am I?',
                            response:
                                "You're aboard the USS Andromeda, a G class mining vessel. We're looking for old NFT's from the planet below.",
                            responses: ['Work?', 'Reporting for Duty!'],
                        },
                        {
                            question: 'Work?',
                            response:
                                "Oh you don't know? We've been assigned this planet and are selling mining plots off to profit. ",
                            responses: ['Where am I?', 'Reporting for Duty!'],
                        },
                        {
                            success: true,
                            question: 'Reporting for Duty!',
                            onResponse: () => {
                                // alert('ok');
                                console.log('space door open');
                                publish<SpaceDoorEvent>('space-door', {
                                    name: 'main',
                                    pos: 'open',
                                });
                            },
                            response:
                                "Good Job, I've opened the door for you, report to Henry to see about your mining assignment.",
                            responses: ['Where am I?', 'Work?'],
                        },
                    ],
                    profile: (
                        <SpriteHtml {...spriteData.buildings} state="megan"></SpriteHtml>
                    ),
                }}
            />
            {/* <CoffeeScript /> */}
        </GameObject>
    );
}
