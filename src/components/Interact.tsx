import React, { useEffect, useRef } from 'react';
import useGameLoop from '../@core/useGameLoop';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Interactable, { InteractionEvent } from '../@core/Interactable';
import Sprite, { SpriteRef } from '../@core/Sprite';
import useGameObject from '../@core/useGameObject';
import useGameObjectEvent from '../@core/useGameObjectEvent';
import waitForMs from '../@core/utils/waitForMs';
import spriteData from '../spriteData';
import HtmlOverlay from '../@core/HtmlOverlay';
import {
    Conversation,
    Notification,
    NotificationEvent,
    NotificationType,
    UnNotificationEvent,
} from '../@core/Notifications';

export function InteractScript({ animate }: { animate: boolean }) {
    const { getComponent } = useGameObject();
    const workState = useRef(false);
    useGameLoop(time => {
        if (animate) {
            const pos = Math.abs((time % 1000) - 500) / 100;
            getComponent<SpriteRef>('indicator').setOffset({ x: 0, y: pos / 100 + 0.55 });
        }
    });

    useGameObjectEvent<InteractionEvent>('interaction', async () => {
        workState.current = !workState.current;
        if (animate) {
            if (workState.current) {
                getComponent<SpriteRef>('indicator').setOffset({ x: -1, y: -1 });
            } else {
                getComponent<SpriteRef>('indicator').setOffset({ x: 1, y: 1 });
            }
        }
        return waitForMs(100);
    });

    return null;
}

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Message from './Message';
import { Html } from '@react-three/drei';
import useAsset from 'src/@core/useAsset';
import SpriteHtml from 'src/@core/SpriteHtml';

export function ConversationModal({
    open,
    setOpen,
    message,
    conversation,
}: {
    open: boolean;
    setOpen: (r: boolean) => void;
    message: Notification;
    conversation: { profile: JSX.Element; convo: Conversation[] };
}) {
    const [currentConvo, setCurrentQ] = useState('root');

    const cancelButtonRef = useRef(null);

    const currentConvoVal = conversation.convo.find(t => t.question === currentConvo);
    const success = currentConvoVal.success;

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <CheckIcon
                                            className="h-6 w-6 text-green-600"
                                            aria-hidden="true"
                                        />
                                    </div> */}
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            {message.title}
                                        </Dialog.Title>
                                        <div className="grid sm:grid-cols-2">
                                            <div className="grid mt-2">
                                                {conversation.profile}{' '}
                                            </div>
                                            <div className="grid text-black justify-center items-center">
                                                {currentConvoVal.response}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-black mt-5">
                                        {currentConvoVal.element?.(setCurrentQ)}
                                    </div>
                                </div>

                                <div className="mt-5 sm:mt-6 sm:grid  sm:grid-cols-1 ">
                                    {currentConvoVal.responses.map(resp => {
                                        return (
                                            <button
                                                type="button"
                                                className="mb-2 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                                onClick={() => {
                                                    setCurrentQ(resp);
                                                    conversation.convo
                                                        .find(t => t.question === resp)
                                                        ?.onResponse?.();
                                                }}
                                            >
                                                {resp}
                                            </button>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        className={
                                            'mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 ' +
                                            (success
                                                ? 'bg-green-600 text-white hover:bg-green-500'
                                                : 'bg-gray text-gray-700 ') +
                                            ' px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:text-sm'
                                        }
                                        onClick={() => setOpen(false)}
                                        ref={cancelButtonRef}
                                    >
                                        {success ? 'Done' : 'Cancel'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default function Interact(
    props: GameObjectProps & {
        showIndicator: boolean;
        message?: Notification;
        conversation?: { profile: JSX.Element; convo: Conversation[] };
        rightClickMessage?: Notification;
    }
) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Interactable
                {...(props.message !== undefined
                    ? {
                          ...props,
                          message: {
                              ...props.message,
                              action: () => {
                                  setOpen(true);
                                  return props.message.action?.();
                              },
                          },
                      }
                    : { ...props })}
            ></Interactable>
            <InteractScript animate={props.showIndicator} />
            {props.showIndicator && (
                <Sprite
                    name="indicator"
                    {...spriteData.objects}
                    state="arrow"
                    scale={0.5}
                />
            )}
            {props.conversation && (
                <HtmlOverlay>
                    <ConversationModal
                        conversation={props.conversation}
                        message={props.message}
                        open={open}
                        setOpen={setOpen}
                    ></ConversationModal>
                </HtmlOverlay>
            )}
        </>
    );
}
