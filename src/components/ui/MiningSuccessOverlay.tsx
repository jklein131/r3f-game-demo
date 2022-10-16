import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import createPubSub, { PubSubEvent } from 'src/@core/utils/createPubSub';

type RollEventDetails = {
    dates: String;
};

export type NFTRoll = PubSubEvent<'nft-roll-ack', RollEventDetails>;

export default function MiningSuccessOverlay({
    pubSub,
}: {
    pubSub: ReturnType<typeof createPubSub>;
}) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const t = pubSub.subscribe<NFTRoll>('nft-roll-ack', t => {
            setOpen(true);
        });
        return () => {
            t();
        };
    });

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <CheckIcon
                                            className="h-6 w-6 text-green-600"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            Artifact Uncovered
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <Image
                                                src="/assets/samplenft.webp"
                                                width={631}
                                                height={631}
                                            ></Image>
                                            <p className="text-sm text-gray-500">
                                                The NFT is part of the Bored Ape Yacht
                                                collection.
                                            </p>
                                            <p className="text text-black mt-5">
                                                --- Way to connect to your wallet here,
                                                either SSO or wallet hash---
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <a
                                        href={
                                            'https://market.immutable.com/collections/0x8a17c9a998d78f5fb38d92b88c63f59ebee73d8b/assets/724'
                                        }
                                        target="_blank"
                                    >
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                            onClick={() => setOpen(false)}
                                        >
                                            View details
                                        </button>
                                    </a>

                                    <button
                                        type="button"
                                        className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 sm:text-sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        Keep Mining
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
