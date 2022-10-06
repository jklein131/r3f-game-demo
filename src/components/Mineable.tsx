import {
    Dispatch,
    Fragment,
    SetStateAction,
    useCallback,
    useMemo,
    useState,
} from 'react';
import { GameObjectProps } from '../@core/GameObject';
import { MineableRef } from '../@core/Interactable';
import useComponentRegistry from '../@core/useComponentRegistry';

export default function Mineable(
    props: GameObjectProps & {
        amount: number;
        setAmount: Dispatch<React.SetStateAction<number>>;
        after: JSX.Element;
    }
) {
    // const def2 = useMemo(() => {
    //     return props.amount;
    // }, [props.amount]);
    // const def = useCallback(() => {
    //     props.setAmount(def2 - 1);
    //     console.log('mine', def2);
    // }, [props.setAmount, def2]);
    useComponentRegistry<MineableRef>('mineable', {
        amount: props.amount,
        mine: () => props.setAmount(props.amount - 1),
    });
    if (props.amount <= 0) {
        return <Fragment>{props.after}</Fragment>;
    }
    return <Fragment>{props.children}</Fragment>;
}
