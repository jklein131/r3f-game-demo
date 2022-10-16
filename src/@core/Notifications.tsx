import React, { useState, Fragment, useEffect, SetStateAction, Dispatch } from 'react';

import { Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import createPubSub, { PubSubEvent } from './utils/createPubSub';
import useGameObjectEvent from './useGameObjectEvent';
import { MovingEvent } from './Moveable';
import { Position } from './GameObject';

export enum NotificationType {
    TALKABLE,
    SUCCESS,
    FAILURE,
    PROGRESS,
}

export type Conversation = {
    question: string;
    response: string;
    success?: boolean;
    onResponse?: () => void;
    responses: string[];
    element?: (setCurrentQ: Dispatch<SetStateAction<string>>) => JSX.Element;
};
export type Notification = {
    id: string;
    title: string;
    profile?: JSX.Element;
    unNotifyOnMove?: boolean;
    text: string;
    type: NotificationType;
    progress?: number;
    x: number;
    y: number;
    action?: () => Promise<boolean>;
};
interface INotification extends Notification {
    noshow: boolean;
}
export type NotificationEvent = PubSubEvent<'notification', Notification>;

export type ReNotificationEvent = PubSubEvent<'renotification', Notification>;
export type UnNotificationEvent = PubSubEvent<'unnotification', Notification>;

export function NotificationWindow({
    pubSub,
}: {
    pubSub: ReturnType<typeof createPubSub>;
}) {
    // const [show, setShow] = useState(true);
    const [messageQueue, setMessageQueue] = useState<INotification[]>([
        // {
        //     type: NotificationType.TALKABLE,
        //     title: 'Old Man Jenkins',
        //     text: 'hello sir, can you help me find my shoes? ',
        // },
    ]);
    pubSub.subscribe('will-move', (an: Position) => {
        console.log(messageQueue);
        setMessageQueue([
            ...messageQueue.filter(
                mes =>
                    Math.abs(mes.x - an.x) > 1 ||
                    Math.abs(mes.y - an.y) > 1 ||
                    mes?.unNotifyOnMove === false
            ),
        ]);
        // if (rightClickMessage !== undefined) {
        //     gameLevelPublish<UnNotificationEvent>('unnotification', rightClickMessage);
        // }
    });
    useEffect(() => {
        return pubSub.subscribe<NotificationEvent>('notification', notif => {
            setMessageQueue([
                ...messageQueue.filter(mes => mes.id !== notif.id),
                { ...notif, noshow: false },
            ]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pubSub, messageQueue]);
    useEffect(() => {
        return pubSub.subscribe<ReNotificationEvent>('renotification', notif => {
            if (messageQueue.find(mes => mes.id === notif.id)) {
                setMessageQueue([
                    ...messageQueue.filter(mes => mes.id !== notif.id),
                    { ...notif, noshow: false },
                ]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pubSub, messageQueue]);
    useEffect(() => {
        return pubSub.subscribe<UnNotificationEvent>('unnotification', notif => {
            setMessageQueue(
                messageQueue.map(mes =>
                    mes.id === notif.id ? { noshow: true, ...mes } : mes
                )
            );
            setTimeout(() => {
                setMessageQueue(messageQueue.filter(mes => mes.id !== notif.id));
            }, 100);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pubSub, messageQueue]);

    return (
        <>
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 z-10 sm:items-start"
            >
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    {messageQueue.map(message => {
                        if (
                            message.type === NotificationType.SUCCESS ||
                            message.type === NotificationType.FAILURE
                        ) {
                            // return (
                            //     <Transition
                            //         key={message.id}
                            //         show={!message.noshow}
                            //         appear={!message.noshow}
                            //         as={Fragment}
                            //         enter="transform ease-out duration-300 transition"
                            //         enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                            //         enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                            //         leave="transition ease-in duration-100"
                            //         leaveFrom="opacity-100"
                            //         leaveTo="opacity-0"
                            //     >
                            //         <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                            //             <div className="p-4">
                            //                 <div className="flex items-start">
                            //                     <div className="flex-shrink-0">
                            //                         {message.type ===
                            //                         NotificationType.SUCCESS ? (
                            //                             <CheckCircleIcon
                            //                                 className="h-6 w-6 text-green-400"
                            //                                 aria-hidden="true"
                            //                             />
                            //                         ) : (
                            //                             <XCircleIcon
                            //                                 className="h-6 w-6 text-red-400"
                            //                                 aria-hidden="true"
                            //                             />
                            //                         )}
                            //                     </div>
                            //                     <div className="ml-3 w-0 flex-1 pt-0.5">
                            //                         <p className="text-sm font-medium text-gray-900">
                            //                             {message.title}
                            //                         </p>
                            //                         <p className="mt-1 text-sm text-gray-500">
                            //                             {message.text}
                            //                         </p>
                            //                     </div>
                            //                     <div className="ml-4 flex-shrink-0 flex">
                            //                         <button
                            //                             type="button"
                            //                             className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            //                             onClick={() => {
                            //                                 setMessageQueue(
                            //                                     messageQueue.filter(
                            //                                         mess =>
                            //                                             mess.id !==
                            //                                             message.id
                            //                                     )
                            //                                 );
                            //                             }}
                            //                         >
                            //                             <span className="sr-only">
                            //                                 Close
                            //                             </span>
                            //                             <XCircleIcon
                            //                                 className="h-5 w-5"
                            //                                 aria-hidden="true"
                            //                             />
                            //                         </button>
                            //                     </div>
                            //                 </div>
                            //             </div>
                            //         </div>
                            //     </Transition>
                            // );
                        }
                        return (
                            <Transition
                                key={message.id}
                                show
                                as={Fragment}
                                appear={true}
                                enter="transform ease-out duration-300 transition"
                                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
                                    <div className="w-0 flex-1 p-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 pt-0.5">
                                                {message.profile ? (
                                                    message.profile
                                                ) : message.type ===
                                                  NotificationType.SUCCESS ? (
                                                    <CheckCircleIcon
                                                        className="h-6 w-6 text-green-400"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <XCircleIcon
                                                        className="h-6 w-6 text-red-400"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </div>
                                            <div className="ml-3 w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {message.title}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {message.text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex border-l border-gray-200">
                                        <button
                                            type="button"
                                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            onClick={async () => {
                                                // setShow(false);
                                                console.log(
                                                    'talk',
                                                    messageQueue,
                                                    message
                                                );
                                                if (await message.action?.()) {
                                                    setMessageQueue(
                                                        messageQueue.filter(
                                                            mess => mess.id !== message.id
                                                        )
                                                    );
                                                }
                                            }}
                                        >
                                            Talk
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
