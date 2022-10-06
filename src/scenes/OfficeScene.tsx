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

const mapData = mapDataString(`
T···················································
T···················································
T···················································
············T·······································
····················································
·······$$$$$$$$····##########······················
········$$$$$$$$···##########······T···············
·······$$$$$$$$····##########······················
······$$$$$$$$·····##########······················
········$$$$$$$$···####M#####······················
········T$$$$$$$$················^···················
········$$$$$$$$·····P··$··························
········$$$$$$$$·········W····$$$$$$$$··············
T·······$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$··············
················$$$$$$$$$$$$$$$$$$$$$$$$$$··············
····T···········$$$$$$$$$$$$$$$$$$$$$$$$$$··············
················$$$$$$$$$$$$$$$$$$$$$$$$$$··············
················$$$$$$$$$$$$$$$$$$$$$$$$$$··············
`);

const resolveMapTile: TileMapResolver = (type, x, y) => {
    const key = `${x}-${y}`;
    const position = { x, y };

    const floor = (
        <Fragment key={'of-floor' + key}>
            <GameObject key={'of-fgo' + key} {...position} layer="ground">
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
        case '$':
            return (
                <Fragment key={key}>
                    <Tar {...position}></Tar>
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
                        enterDirection={[0, -1]}
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
                    <Player x={x} y={y} allowDiagonals={true} />;
                </Fragment>
            );

        default:
            return null;
    }
};

export default function OfficeScene() {
    return (
        <>
            <GameObject name="map">
                <TileMap
                    data={mapData}
                    resolver={resolveMapTile}
                    definesMapSize
                    key={'officetilemap'}
                />
            </GameObject>
        </>
    );
}
