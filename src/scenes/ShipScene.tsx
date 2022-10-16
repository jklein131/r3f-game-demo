import React, { Fragment, useEffect, useState } from 'react';
import Plantable from '../components/Plantable';
import Collider from '../@core/Collider';
import GameObject, { GameObjectContextValue } from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import ScenePortal from '../@core/ScenePortal';
import Sprite from '../@core/Sprite';
import TileMap, { TileMapData, TileMapResolver } from '../@core/TileMap';
import { mapDataString, mapDataString3 } from '../@core/utils/mapUtils';
import CoffeeMachine from '../entities/CoffeeMachine';
import PizzaPickup from '../entities/PizzaPickup';
import Plant from '../entities/Plant';
import Player from '../entities/Player';
import Workstation from '../entities/Workstation';
import spriteData from '../spriteData';
import Stone from '../entities/Stone';
import { createNoise2D } from 'simplex-noise';
import HtmlOverlay from 'src/@core/HtmlOverlay';
import Sally from 'src/entities/people/Sally';
import Henry from 'src/entities/people/Henry';
import Megan from 'src/entities/people/Megan';
import Paul from 'src/entities/people/Paul';
import George from 'src/entities/people/George';
import resolveMapTile from './SceneResolver';

const shipMapData = mapDataString3(
    `
N | N | N | N |N | N | N | N | N | N |S5| S5| S5| S5| S5| S5| S5| N | N | N | N |
N | N | N | N |N | N | N | N | N | N |S2| . | . | . | . | . | S2| N | N |S1 | N |
S5| S5| S5| S5|S2| N | N | N | N | N |S2| . | .W| . | .W| . | S2| N | N |S6 | N |
S5| . |.PM| . |S2| N | N | N | N | N |S2| . | . | . |.PG| . |.SA| SW|S9 |S7 |S9 |
S5| . | . | . |S2|S2W|S2W|S2W|S2W|S2W|S2| . | . | . | . | . | S2| N |S12| N |S12|
S5| . | . | . |.SD|. | . | . | . | . | .| . | S3| . | S3| . | S2| N | N | N | N |
S5| . | .P| . |S2|S2W|S2W|S2W|S2W|S2W|S2| . |.PS| . |.PP| . | S2| N | N | N | N |
S5| . | . | . |S2| N | N | N | N | N |S2| . | . | . | . | . | S2| N | N | S1| N |
S5| S5| S5| S5|S5| N | N | N | N | N |S2| . | . | . | . |.PH| S2| N | N | S6| N |
N | N | N | N |N | N | N | N | N | N |S2| . | . | . | . | . |.SB| SW|S7 |S7 |S7 |
N | N | N | N |N | N | N | N | N | N |S2| . | . | . | . | . | S2| N |S12| N |S12|
N | N | N | N |N | N | N | N | N | N |S5| S5| S5| S5| S5| S5| S5| N | N | N | N |
N | N | N | N |N | N | N | N | N | N |S5| S5| S5| S5| S5| S5| S5| N | N | N | N |
`
);

export default function ShipScene() {
    // console.log('map', newMapData);
    // console.log('old', mapData);

    // initialize the noise function

    // data[0][0] = 'P';

    return (
        <GameObject name="ship">
            <TileMap data={shipMapData} resolver={resolveMapTile} />
        </GameObject>
    );
}
