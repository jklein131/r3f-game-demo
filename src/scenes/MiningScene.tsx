import React, { Fragment, useEffect, useState } from 'react';
import Plantable from '../components/Plantable';
import Collider from '../@core/Collider';
import GameObject from '../@core/GameObject';
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
import Tar from 'src/entities/Tar';
import Stone from 'src/entities/Stone';
import { createNoise2D } from 'simplex-noise';

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
const newMapData = mapDataString3(
    `
999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|999|
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | P | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|069|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
 · | · | · | · | · | · |014|056|200|050|050|050|050|050|050| · | · | · | · | · | · | · | · | · | · | · | · | · |
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

const resolveMapTile: TileMapResolver = (type, x, y) => {
    const key = `${x}-${y}`;
    const position = { x, y };

    const floor = (
        <Fragment key={'floor' + key}>
            <GameObject key={'fgo' + key} {...position} layer="ground">
                <Sprite {...spriteData.objects} state="floor" />
            </GameObject>
        </Fragment>
    );

    switch (type) {
        case '·':
            return (
                <Fragment key={key}>
                    <Plantable {...position} />
                    {floor}
                </Fragment>
            );
        case 'X':
            return floor;
        case '$':
            return (
                <Fragment key={key}>
                    <Stone {...position} amount={50}></Stone>
                    {floor}
                </Fragment>
            );
        case '^':
            return (
                <Fragment key={key}>
                    {floor}
                    <CoffeeMachine {...position} />
                </Fragment>
            );
        case 'o':
            return (
                <Fragment key={key}>
                    {floor}
                    <PizzaPickup {...position} />
                </Fragment>
            );
        case '#':
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.objects} state="wall" />
                </GameObject>
            );
        case 'M':
            return (
                <GameObject key={key} x={x} y={y}>
                    <Collider />
                    <Interactable />
                    <ScenePortal
                        name="exit"
                        enterDirection={[-1, 0]}
                        target="other/start"
                    />
                </GameObject>
            );
        case 'W':
            return (
                <Fragment key={key}>
                    {floor}
                    <Workstation {...position} />
                </Fragment>
            );
        case 'C':
            return (
                <Fragment key={key}>
                    {floor}
                    <CoffeeMachine {...position} />
                </Fragment>
            );
        case 'T':
            return (
                <Fragment key={key}>
                    {floor}
                    <Plant {...position} />
                </Fragment>
            );
        case 'P':
            return (
                <Fragment key={key}>
                    {floor}
                    <Player x={x} y={y} allowDiagonals={false} />;
                </Fragment>
            );

        default:
            console.log('typeof', typeof type);
            const rockAmount = parseInt(type as string);
            return (
                <Fragment key={key}>
                    <Stone {...position} amount={rockAmount}></Stone>
                    {floor}
                </Fragment>
            );
        // return null;
    }
};

export default function MiningScene() {
    // console.log('map', newMapData);
    // console.log('old', mapData);
    // initialize the noise function
    const noise2D = createNoise2D(Math.random);

    const [map, setMap] = useState<undefined | TileMapData>(newMapData);

    useEffect(() => {
        let data: TileMapData = [];
        //generate map
        for (let x = 0; x < 25; x++) {
            data[x] = [];
            for (let y = 0; y < 25; y++) {
                const r = noise2D(x / 4, y / 4) * 500;
                // const r2 = noise2D(x / 8, y / 8) * 500;
                if (r < -100) {
                    data[x][y] = '·';
                } else {
                    data[x][y] = Math.abs(r).toFixed(0);
                }
            }
        }
        data[0][0] = 'P';
        setMap(data);
        console.log('set map', data);
    }, []);

    return (
        <>
            {map !== undefined && (
                <GameObject name="map">
                    <ambientLight />
                    <TileMap data={map} resolver={resolveMapTile} definesMapSize />
                </GameObject>
            )}
            {/* <GameObject x={16} y={5}>
                <Collider />
                <Interactable />
                <ScenePortal name="exit" enterDirection={[-1, 0]} target="other/start" />
            </GameObject> */}
        </>
    );
}
