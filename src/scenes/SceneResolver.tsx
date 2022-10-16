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
import Interact from 'src/components/Interact';
import { NotificationType } from 'src/@core/Notifications';
import SpaceDoor from 'src/entities/SpaceDoor';

export default function resolveMapTile(type, x, y): JSX.Element {
    const key = `map-${type}-tile-${x}-${y}`;
    const position = { x, y };

    const floor = (
        <Fragment key={'floor' + key}>
            <GameObject key={'fgo' + key} {...position} layer="ground">
                <Sprite {...position} {...spriteData.buildings} state="lava2" />
            </GameObject>
        </Fragment>
    );

    switch (type) {
        case '·':
            return floor;
        case 'N':
            return <></>;
        case '.':
            return (
                <Fragment key={'floor2' + key}>
                    <GameObject key={'fgo2' + key} {...position} layer="ground">
                        <Sprite {...position} {...spriteData.objects} state="floor" />
                    </GameObject>
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
        case 'S1': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="1" />
                </GameObject>
            );
        }
        case 'SD': {
            return (
                <SpaceDoor key={key} {...position} name="main">
                    {' '}
                    <HtmlOverlay>
                        <div className="text-sm overflow-hidden rounded-lg text-black relative bottom-10 right-11 bg-white shadow">
                            <div className="px-1 py-1 sm:p-2">Door</div>
                        </div>
                    </HtmlOverlay>
                </SpaceDoor>
            );
        }
        case 'SA': {
            return (
                <SpaceDoor key={key} {...position} name="a">
                    {' '}
                    <HtmlOverlay>
                        <div className="text-sm overflow-hidden rounded-lg text-black relative bottom-10 right-11 bg-white shadow">
                            <div className="px-1 py-1 sm:p-2">HangerA</div>
                        </div>
                    </HtmlOverlay>
                </SpaceDoor>
            );
        }
        case 'SB': {
            return (
                <SpaceDoor key={key} {...position} name="b">
                    {' '}
                    <HtmlOverlay>
                        <div className="text-sm overflow-hidden rounded-lg text-black relative bottom-10 right-11 bg-white shadow">
                            <div className="px-1 py-1 sm:p-2">HangerB</div>
                        </div>
                    </HtmlOverlay>
                </SpaceDoor>
            );
        }
        case 'S2': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="2" />
                </GameObject>
            );
        }
        case 'S2W':
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="2" rotation={1.5708} />
                </GameObject>
            );
        case 'S3': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="3" />
                </GameObject>
            );
        }
        case 'S4': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="4" />
                </GameObject>
            );
        }
        case 'S5': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="5" />
                </GameObject>
            );
        }
        case 'SW':
            return (
                <GameObject key={key} {...position} layer="wall">
                    {/* <Collider /> */}
                    {/* radians */}
                    <Sprite {...spriteData.ship} state="10" rotation={1.5708} />
                </GameObject>
            );

        case 'S6': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="6" />
                </GameObject>
            );
        }
        case 'S7': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="7" />
                </GameObject>
            );
        }
        case 'S8': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="8" />
                </GameObject>
            );
        }
        case 'S9': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />

                    <Sprite {...spriteData.ship} state="9" />
                </GameObject>
            );
        }
        case 'S12': {
            return (
                <GameObject key={key} {...position} layer="wall">
                    <Collider />
                    <Sprite {...spriteData.ship} state="12" />
                </GameObject>
            );
        }
        case 'M':
            return (
                <GameObject key={key} {...position}>
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
                    {/* {floor} */}
                    <Workstation {...position} />
                </Fragment>
            );
        case 'PS':
            return (
                <Fragment key={key}>
                    {/* {floor} */}
                    <Sally {...position}></Sally>
                </Fragment>
            );
        case 'PH':
            return (
                <Fragment key={key}>
                    <Henry {...position}></Henry>
                </Fragment>
            );
        case 'PM':
            return (
                <Fragment key={key}>
                    {/* {resolveMapTile(type[0], x, y)} */}
                    <Megan {...position}></Megan>
                </Fragment>
            );
        case 'PG':
            return (
                <Fragment key={key}>
                    {/* {floor} */}
                    <George {...position}></George>
                </Fragment>
            );
        case 'PP':
            return (
                <Fragment key={key}>
                    {/* {floor} */}
                    <Paul {...position}></Paul>
                </Fragment>
            );
        case ']o]':
            return (
                <Fragment key={key}>
                    {/* {floor} */}
                    <GameObject key={'fas2' + key} {...position} layer="ground">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="wood3"
                            name="swag"
                        />
                    </GameObject>

                    <GameObject key={'fas3' + key} {...position} layer="wall">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="green"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                </Fragment>
            );
        case ']]]':
            return (
                <Fragment key={key}>
                    {/* {floor} */}
                    <GameObject key={'fas' + key} {...position} layer="wall">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="wood3"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                </Fragment>
            );
        case '===':
            return (
                <Fragment key={key}>
                    {/* {floor} */}

                    <GameObject key={'fas' + key} {...position} layer="wall">
                        <Collider></Collider>
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="stone"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                </Fragment>
            );
        case '=R=':
            return (
                <Fragment key={key}>
                    {floor}
                    <GameObject key={'froofas' + key} {...position} layer="fx">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="roof"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                    <GameObject key={'fas' + key} {...position} layer="fx">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="halfstone"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                </Fragment>
            );
        case '=B=':
            return (
                <Fragment key={key}>
                    {floor}

                    <GameObject key={'fas' + key} {...position} layer="ground">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="stone"
                            name="swag"
                        />
                        <Collider></Collider>
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                        <HtmlOverlay>
                            <div className="overflow-hidden rounded-lg text-black relative bottom-10 right-11 bg-white shadow">
                                <div className="px-4 py-5 sm:p-6">BANK</div>
                            </div>
                        </HtmlOverlay>
                    </GameObject>
                </Fragment>
            );
        case '=D=':
            return (
                <Fragment key={key}>
                    {floor}
                    <GameObject key={'froofas' + key} {...position} layer="wall">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="door"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                    <GameObject key={'fas' + key} {...position} layer="ground">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="stone"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                </Fragment>
            );
        case '///':
            return (
                <Fragment key={key}>
                    {floor}
                    <GameObject key={'fas' + key} {...position} layer="wall">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="leftroof"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                </Fragment>
            );
        case '---':
            return (
                <Fragment key={key}>
                    {floor}
                    <GameObject key={'fas' + key} {...position} layer="wall">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="midroof"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                </Fragment>
            );
        case '???':
            return (
                <Fragment key={key}>
                    {floor}
                    <GameObject key={'fas' + key} {...position} layer="wall">
                        <Sprite
                            {...position}
                            {...spriteData.buildings}
                            state="rightroof"
                            name="swag"
                        />
                        {/* <Sprite {...position} {...spriteData.objects} state="floor" /> */}
                    </GameObject>
                </Fragment>
            );
        case ']D]':
            return (
                <Fragment key={key}>
                    {/* {floor} */}
                    <GameObject key={'fas' + key} {...position} layer="wall">
                        <Sprite {...position} {...spriteData.buildings} state="door2" />
                    </GameObject>
                    <GameObject key={'fasg' + key} {...position} layer="ground">
                        <Sprite {...position} {...spriteData.buildings} state="wood3" />
                    </GameObject>
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
                    <Player key={'playerf' + key} x={x} y={y} allowDiagonals={false} />
                </Fragment>
            );

        default:
            const rockAmount = parseInt(type as string);
            if (rockAmount !== undefined && !isNaN(rockAmount)) {
                return (
                    <Fragment key={key}>
                        <Stone {...position} amount={rockAmount}></Stone>
                        {floor}
                    </Fragment>
                );
            }
            console.log(
                'double',
                type[0],
                '"' + (type.slice(1) as string) + '"',
                '"' + type[0].toString() === (type.slice(1) as string).trim() + '"'
            );
            if ('' === type.slice(1)) {
                return null;
            }
            return (
                <Fragment key={'doulbe' + key}>
                    {resolveMapTile(type[0], x, y)}
                    {resolveMapTile(type.slice(1).toString(), x, y)}
                </Fragment>
            );

        // return null;
    }
}
