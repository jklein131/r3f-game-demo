import React, { Fragment } from 'react';
import Plantable from '../components/Plantable';
import Collider from '../@core/Collider';
import GameObject from '../@core/GameObject';
import Interactable from '../@core/Interactable';
import ScenePortal from '../@core/ScenePortal';
import Sprite from '../@core/Sprite';
import TileMap, { TileMapResolver } from '../@core/TileMap';
import { mapDataString } from '../@core/utils/mapUtils';
import Player from '../entities/Player';
import spriteData from '../spriteData';

const mapData = mapDataString(`
# # # # # # # # # # # # # # # # # # # # # #
# · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · #
# · · · · · · · · · · · · · · · · · · · · #
# # # P # # # # # # # # # # # # # # # # # #
`);

const resolveMapTile: TileMapResolver = (type, x, y) => {
    const key = `${x}-${y}`;
    const position = { x, y };
    const floor = (
        <Fragment key={key}>
            <GameObject key={key} {...position} layer="ground">
                <Sprite {...spriteData.objects} state="floor" />
            </GameObject>
        </Fragment>
    );

    switch (type) {
        case '·':
            return <>{floor}</>;
        case '#':
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.objects} state="wall" />
                </GameObject>
            );
        case 'P':
            return (
                <GameObject x={x} y={y}>
                    <Collider />
                    <Interactable />
                    <ScenePortal
                        name="start"
                        enterDirection={[0, 1]}
                        target="office/exit"
                    />
                </GameObject>
            );
        default:
            return null;
    }
};

export default function OtherScene() {
    return (
        <>
            <GameObject name="map">
                <ambientLight />
                <TileMap data={mapData} resolver={resolveMapTile} definesMapSize />
            </GameObject>

            <Player x={0} y={2} />
        </>
    );
}
