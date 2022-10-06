import React, { Dispatch, SetStateAction, useState } from 'react';
import Interact from './Interact';
import Collider from '../@core/Collider';
import GameObject, { GameObjectProps } from '../@core/GameObject';
import Sprite from '../@core/Sprite';
import spriteData from '../spriteData';
import InteractRightClick from './InteractRightClick';
import Interactable from '../@core/Interactable';
import useComponentRegistry, { ComponentRef } from '../@core/useComponentRegistry';
import Plant from '../entities/Plant';

export type PlantableRef = ComponentRef<
    'Plantable',
    {
        isPlantable: boolean;
        setPlant: Dispatch<SetStateAction<boolean>>;
    }
>;

export default function Plantable(props: GameObjectProps) {
    const [plant, isPlant] = useState(false);
    useComponentRegistry<PlantableRef>('Plantable', {
        isPlantable: plant === false,
        setPlant: isPlant,
    });
    return (
        <>
            <GameObject name="plantable" {...props}>
                {plant ? <Collider /> : null}
                {plant ? <Plant /> : null}
                <InteractRightClick onRightClick={() => isPlant(true)} />
            </GameObject>
        </>
    );
}
