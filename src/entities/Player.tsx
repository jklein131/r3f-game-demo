import React, { ComponentRef, useCallback, useRef } from 'react';
import useGame from 'src/@core/useGame';
import useGameLoop from 'src/@core/useGameLoop';
import useGameObject from 'src/@core/useGameObject';
import useGameObjectEvent from 'src/@core/useGameObjectEvent';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps, GameObjectRef } from '../@core/GameObject';
import Interactable, {
    DidInteractEvent,
    InteractionEvent,
    MineableRef,
} from '../@core/Interactable';
import Moveable from '../@core/Moveable';
import Sprite from '../@core/Sprite';
import CameraFollowScript from '../components/CameraFollowScript';
import CharacterScript from '../components/CharacterScript';
import PlayerScript from '../components/PlayerScript';
import spriteData from '../spriteData';

export function Miner() {
    const mining = useRef(false);
    const miningPlayer = useRef<GameObjectRef[]>();
    const { findGameObjectsByXY } = useGame();
    const { getComponent, transform, subscribe, unsubscribe, getRef } = useGameObject();

    let k;

    useGameObjectEvent<DidInteractEvent>('did-interact', gameObj => {
        const allObjects = findGameObjectsByXY(gameObj.x, gameObj.y);
        miningPlayer.current = allObjects;
        miningPlayer.current
            .map(p => p.getComponent<MineableRef>('mineable'))
            .forEach(t => t?.mine());

        const sub = subscribe('will-move', () => {
            mining.current = false;
            unsubscribe('will-move', sub);
        });
        let k;
        let mineSpeed = 1;
        const mineFunction = () => {
            if (mining.current) {
                miningPlayer.current
                    .map(p => p.getComponent<MineableRef>('mineable'))
                    .forEach(t => t?.mine());
                k = setTimeout(mineFunction, mineSpeed);
                return;
            }
        };
        k = setTimeout(mineFunction, mineSpeed);
        mining.current = true;
        // getComponent<SpriteRef>('Sprite').setState('coffee-machine-empty');
        // playSfx();
    });
    // useGameLoop(time => {
    //     if (mining.current) {
    //         // console.log('mining', time % 1000 < 100);
    //     }
    // });
    return null;
}
export default function Player(props: GameObjectProps & { allowDiagonals: boolean }) {
    return (
        <GameObject name="player" displayName="Player" layer="character" {...props}>
            <Moveable />
            <Interactable />
            <Collider />
            <Miner></Miner>
            <CharacterScript>
                <Sprite {...spriteData.player} />
            </CharacterScript>
            <CameraFollowScript />
            <PlayerScript allowDiagonals={props.allowDiagonals} />
        </GameObject>
    );
}
