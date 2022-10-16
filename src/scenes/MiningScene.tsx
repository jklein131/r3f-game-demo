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

const mapData = mapDataString(` 
T···················································
T··················································· 
T···················································
············T·······································
····················································
·······$$$$$$$$····##########·······················
········$$$$$$$$···##########······T················
·······$$$$$$$$····##########·······················
······$$$$$$$$·····##########·······················
········$$$$$$$$···##########·······················
········T$$$$$$$$······X··W······^··················
········$$$$$$$$·····P··$···························
········$$$$$$$$·········W····$$$$$$$$··············
T·······$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$·······
················$$$$$$$$$$$$$$$$$$$$$$$$$$··········
····T···········$$$$$$$$$$$$$$$$$$$$$$$$$$··········
················$$$$$$$$$$$$$$$$$$$$$$$$$$··········
················$$$$$$$$$$$$$$$$$$$$$$$$$$··········
`);

const town = mapDataString3(
    `
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | ·N| ·N| ·N| ·N| · | · | · | · | · | · |
 · | · | · | · | · | ·N| ·N|S1 | ·N| · | · | · | · | · | · |
 · | · | · | · | · | ·N| ·N|S6 | ·N| ·N| · | · | · | · | · |
 · | · | · | · | · | ·P|S9 |S7 |S9 | ·N| · | · | · | · | · |
 · | · | · | · | · | ·N|S12| ·N|S12| ·N| · | · | · | · | · |
 · | · | · | · | · | ·N| ·N| ·N| ·N| ·N| · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 
`
);

const newMapData = mapDataString3(
    `
999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|
 · | · | · | · | · | · | · | · | · |=R=|=R=|=R=| · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |PM | · | · |===|=B=|===| · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | P | · | · | · | · |===|=D=|===| · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · |///|---|???| · | · | · | · | · | · | PH| · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · |]]]|]]]|]]]| · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | PG| · | · | · |014|056|069|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · | 
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · |PS | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · |PP | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
100|100|100|100|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|
`
);

export default function MiningScene() {
    // console.log('map', newMapData);
    // console.log('old', mapData);

    // initialize the noise function
    const noise2D = createNoise2D(Math.random);

    let data: TileMapData = town.slice();
    //generate map
    for (let x = 0; x < data.length; x++) {
        for (let y = 0; y < data[0].length; y++) {
            const r = noise2D(x / 4, y / 4) * 1000;
            console.log(x, y, data[x][y]);
            // const r2 = noise2D(x / 8, y / 8) * 500;
            if (data[x][y] === '·') {
                data[x][y] = Math.abs(r).toFixed(0);
                continue;
            }
        }
    }
    // data[0][0] = 'P';

    console.log('set map', town);
    console.log('town', town[0].length, town.length);

    return data !== undefined ? (
        <GameObject name="map">
            <TileMap data={data} resolver={resolveMapTile} />
        </GameObject>
    ) : (
        <Fragment></Fragment>
    );
}
