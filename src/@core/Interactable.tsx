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
import { GameObjectRef, Position } from './GameObject';
import { PubSubEvent } from './utils/createPubSub';
import PizzaPickup from 'src/entities/PizzaPickup';
import Sprite, { SpriteRef } from '../@core/Sprite';
import spriteData from 'src/spriteData';
import {
    Notification,
    NotificationEvent,
    NotificationType,
    UnNotificationEvent,
} from './Notifications';
import { MovingEvent } from './Moveable';
import useGameObjectEvent from './useGameObjectEvent';
import InteractRightClick from 'src/components/InteractRightClick';

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
    }
>;

export type InteractableRightClickRef = ComponentRef<
    'InteractableRightClick',
    {
        interactRightClick: (position: Position) => Promise<boolean>;
        onRightClickInteract: (ref: GameObjectRef) => Promise<void>;
        canRightClickInteract: () => boolean;
        canReceiveRightClickInteraction: () => boolean;
    }
>;

export default function Interactable({ children }: { children?: JSX.Element }) {
    const { findGameObjectsByXY, publish: gameLevelPublish } = useGame();
    const { getRef, publish, hasSubscriptions, subscribe } = useGameObject();

    const message = {
        id: 'old-man-jenkins',
        action: () => {},
        text: 'Hello Brother',
        title: 'Can i have some cheese',
        type: NotificationType.TALKABLE,
    } as Notification;

    const canInteract = useRef(true);
    useGameObjectEvent('moving', an => {
        gameLevelPublish<UnNotificationEvent>('unnotification', message);
    });
    useComponentRegistry<InteractableRef>('Interactable', {
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
            gameLevelPublish<NotificationEvent>('notification', message);
            if (canInteract.current) {
                console.log('obj', gameObject);
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
        // this is executed on the game object that *initiates* an interaction
        async interactRightClick({ x, y }) {
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
            gameLevelPublish<NotificationEvent>('notification', message);
            if (canInteract.current) {
                console.log('obj', gameObject);
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
