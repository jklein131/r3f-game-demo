import React, {
    Dispatch,
    SetStateAction,
    useState,
    RefObject,
    useRef,
    ReactNode,
    useEffect,
} from 'react';
import useComponentRegistry, { ComponentRef } from './useComponentRegistry';
import useGame from './useGame';
import useGameObject from './useGameObject';
import { GameObjectProps, GameObjectRef, Position } from './GameObject';
import { PubSubEvent } from './utils/createPubSub';
import PizzaPickup from '../entities/PizzaPickup';
import Sprite, { SpriteRef } from '../@core/Sprite';
import spriteData from '../spriteData';
import {
    Notification,
    NotificationEvent,
    NotificationType,
    ReNotificationEvent,
    UnNotificationEvent,
} from './Notifications';

export type WillInteractEvent = PubSubEvent<'will-interact', Position>;
export type WillInteractRightClickEvent = PubSubEvent<
    'will-interact-right-click',
    Position
>;
export type InteractionEvent = PubSubEvent<'interaction', GameObjectRef>;
export type InteractionRightClickEvent = PubSubEvent<
    'interaction-right-click',
    GameObjectRef
>;
export type DidInteractEvent = PubSubEvent<'did-interact', Position>;
export type DidInteractRightClickEvent = PubSubEvent<
    'did-interact-right-click',
    Position
>;

export type InteractionCallback = (obj: GameObjectRef) => Promise<any> | void;

export type InteractableRef = ComponentRef<
    'Interactable',
    {
        interact: (position: Position) => Promise<boolean>;
        onInteract: (ref: GameObjectRef) => Promise<void>;
        canInteract: () => boolean;
        canReceiveInteraction: () => boolean;
        message: Notification;
    }
>;

export type MineableRef = ComponentRef<
    'mineable',
    {
        amount: number;
        mine: () => void;
    }
>;

export type InteractableRightClickRef = ComponentRef<
    'InteractableRightClick',
    {
        interactRightClick: (position: Position) => Promise<boolean>;
        onRightClickInteract: (ref: GameObjectRef) => Promise<void>;
        canRightClickInteract: () => boolean;
        canReceiveRightClickInteraction: () => boolean;
        message: Notification;
    }
>;

export default function Interactable(
    props: GameObjectProps & {
        message?: Notification;
        rightClickMessage?: Notification;
    }
) {
    const { findGameObjectsByXY, publish: gameLevelPublish } = useGame();
    const { getRef, publish, hasSubscriptions, subscribe } = useGameObject();

    const canInteract = useRef(true);
    useEffect(() => {
        gameLevelPublish<ReNotificationEvent>('renotification', props.message);
    }, [props.message]);

    useComponentRegistry<InteractableRef>('Interactable', {
        message: props.message,
        // this is executed on the game object that *initiates* an interaction
        async interact({ x, y }) {
            const interactables = findGameObjectsByXY(x, y)
                .map(obj => obj.getComponent<InteractableRef>('Interactable'))
                .filter(component => component?.canReceiveInteraction());

            if (!interactables.length) return false;

            publish<WillInteractEvent>('will-interact', { x, y });
            canInteract.current = false;
            await Promise.all(interactables.map(comp => comp.onInteract(getRef())));
            canInteract.current = true;
            publish<DidInteractEvent>('did-interact', { x, y });
            return true;
        },
        // this is executed on the game object that *receives* an interaction
        async onInteract(gameObject) {
            if (props.message !== undefined) {
                gameLevelPublish<NotificationEvent>('notification', props.message);
                publish<NotificationEvent>('notification', props.message);
                const sub = gameObject.subscribe('will-move', on => {
                    // console.log('ok');
                    gameLevelPublish<UnNotificationEvent>(
                        'unnotification',
                        props.message
                    );
                    publish<UnNotificationEvent>('unnotification', props.message);
                    gameObject.unsubscribe('will-move', sub);
                });
            }
            if (canInteract.current) {
                // console.log('obj', gameObject);
                canInteract.current = false;
                publish<WillInteractEvent>('will-interact', gameObject.transform);
                await publish<InteractionEvent>('interaction', gameObject);
                publish<DidInteractEvent>('did-interact', gameObject.transform);
                canInteract.current = true;
            }
        },
        canInteract() {
            return canInteract.current;
        },
        canReceiveInteraction() {
            return (
                canInteract.current &&
                hasSubscriptions<InteractionEvent>('interaction') > 0
            );
        },
    });
    useComponentRegistry<InteractableRightClickRef>('InteractableRightClick', {
        message: props.message,
        // this is executed on the game object that *initiates* an interaction
        async interactRightClick({ x, y }) {
            if (props.rightClickMessage !== undefined) {
                gameLevelPublish<NotificationEvent>(
                    'notification',
                    props.rightClickMessage
                );
            }
            const interactables = findGameObjectsByXY(x, y)
                .map(obj =>
                    obj.getComponent<InteractableRightClickRef>('InteractableRightClick')
                )
                .filter(component => component?.canReceiveRightClickInteraction());

            if (!interactables.length) return false;

            publish<WillInteractRightClickEvent>('will-interact-right-click', { x, y });
            canInteract.current = false;
            await Promise.all(
                interactables.map(comp => comp.onRightClickInteract(getRef()))
            );
            canInteract.current = true;
            publish<DidInteractRightClickEvent>('did-interact-right-click', { x, y });
            return true;
        },
        // this is executed on the game object that *receives* an interaction
        async onRightClickInteract(gameObject) {
            if (props.rightClickMessage !== undefined) {
                gameLevelPublish<NotificationEvent>(
                    'notification',
                    props.rightClickMessage
                );
                publish<NotificationEvent>('notification', props.rightClickMessage);
                const sub = gameObject.subscribe('will-move', on => {
                    // console.log('ok');
                    gameLevelPublish<UnNotificationEvent>(
                        'unnotification',
                        props.rightClickMessage
                    );
                    publish<UnNotificationEvent>(
                        'unnotification',
                        props.rightClickMessage
                    );
                    gameObject.unsubscribe('will-move', sub);
                });
            }
            if (canInteract.current) {
                // console.log('obj', gameObject);
                canInteract.current = false;
                publish<WillInteractRightClickEvent>(
                    'will-interact-right-click',
                    gameObject.transform
                );
                await publish<InteractionRightClickEvent>(
                    'interaction-right-click',
                    gameObject
                );
                publish<DidInteractRightClickEvent>(
                    'did-interact-right-click',
                    gameObject.transform
                );
                canInteract.current = true;
            }
        },
        canRightClickInteract() {
            return canInteract.current;
        },
        canReceiveRightClickInteraction() {
            return (
                canInteract.current &&
                hasSubscriptions<InteractionRightClickEvent>('interaction-right-click') >
                    0
            );
        },
    });
    return null;
}
