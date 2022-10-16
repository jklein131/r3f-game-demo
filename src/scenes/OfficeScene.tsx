import React, { Fragment } from 'react';
import Plantable from '../components/Plantable';
import Collider from '../@core/Collider';
import GameObject from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import ScenePortal from '../@core/ScenePortal';
import Sprite from '../@core/Sprite';
import TileMap, { TileMapResolver } from '../@core/TileMap';
import { mapDataString } from '../@core/utils/mapUtils';
import CoffeeMachine from '../entities/CoffeeMachine';
import PizzaPickup from '../entities/PizzaPickup';
import Plant from '../entities/Plant';
import Player from '../entities/Player';
import Workstation from '../entities/Workstation';
import spriteData from '../spriteData';
import Tar from 'src/entities/Tar';
import resolveMapTile from './SceneResolver';

const mapData = mapDataString(`
T··················································
T··················································
T··················································
············T······································
···················································
·······$$$$$$$$····##########······················
········$$$$$$$$···##########······T···············
·······$$$$$$$$····##########······················
······$$$$$$$$·····##########······················
········$$$$$$$$···####M#####······················
········T$$$$$$$$················^·················
········$$$$$$$$·····P··$··························
········$$$$$$$$·········W····$$$$$$$$·············
T·······$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$······
················$$$$$$$$$$$$$$$$$$$$$$$$$$·········
····T···········$$$$$$$$$$$$$$$$$$$$$$$$$$·········
················$$$$$$$$$$$$$$$$$$$$$$$$$$·········
················$$$$$$$$$$$$$$$$$$$$$$$$$$·········
`);

export default function OfficeScene() {
    return (
        <>
            <GameObject name="map">
                <TileMap data={mapData} resolver={resolveMapTile} key={'officetilemap'} />
            </GameObject>
        </>
    );
}
