import React, {
    createRef,
    Fragment,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { start } from 'repl';
import GameObject, { Position } from './GameObject';
import { WillMoveEvent } from './Moveable';
import useGame from './useGame';
import useGameObject from './useGameObject';
import { PubSubEvent } from './utils/createPubSub';

export type TileMapUpdateEvent = PubSubEvent<'tile-map-update', void>;

export type TileMapDataValue = number | string;
export type TileMapData = TileMapDataValue[][];

export type TileMapResolver = (
    type: TileMapDataValue,
    x: number,
    y: number
) => React.ReactElement;
interface Props {
    data: TileMapData;
    resolver?: TileMapResolver;
}

export function TileMapChunk(props: { children: JSX.Element[] }): JSX.Element {
    return <>{props.children}</>;
}

export default function TileMap({ data, resolver }: Props): JSX.Element {
    const { setMapSize, publish, findGameObjectsByXY, subscribe, unsubscribe } =
        useGame();
    const playerRenderDistance = 3;
    const mapWidth = data[0].length;
    const mapHeight = data.flat().length / mapWidth;
    const keyPrefix = 'ref-tilemap-wrapper-';

    const mapData = useMemo(() => {
        const newf = data.slice().flat();
        return newf;
    }, [data]);

    const playerindex = mapData.findIndex(tile => tile === 'P');

    const playerx = Math.floor(playerindex / mapWidth);
    const playery = playerindex % mapWidth;
    // create the player el and never re-resolve it.
    const playerEl = resolver('P', playerx, playery);
    const [playerPosition, setPlayerPosition] = useState<Position>({
        x: playerx,
        y: playery,
    });

    const renderBasicChunk = ({
        mapData,
        startX,
        startY,
        endX,
        endY,
    }: {
        mapData: TileMapDataValue[];
        startX: number;
        startY: number;
        endX: number;
        endY: number;
    }) => {
        let ret: JSX.Element[] = [];
        if (startX < 0) {
            startX = 0;
        }
        if (endX > mapWidth) {
            endX = mapWidth;
        }
        if (startY < 0) {
            startY = 0;
        }
        if (endY >= mapHeight) {
            endY = mapHeight;
        }
        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                const chunk = mapData[startX + x + mapWidth * (startY + y)];
                if (!chunk) {
                    continue;
                }
                if (chunk.toString().startsWith('P')) {
                    continue;
                }
                ret = [...ret, resolver(chunk, startX + x, startY + y)];
            }
        }
        return {
            chunk: ret,
            inChunk: (pos: Position) => {
                if (startX <= pos.x && pos.x <= endX && startY <= pos.y && pos.y < endY) {
                    return true;
                }
                return false;
            },
            endX: endX,
            endY: endY,
            startX: startX,
            startY: startY,
        };
    };

    const renderChunk = (
        map: TileMapDataValue[],
        playerPos: Position
    ): {
        chunk: JSX.Element[];
        inChunk: (pos: Position) => boolean;
        startX;
        endX;
        startY;
        endY;
    } => {
        let startX = playerPos.x - playerRenderDistance;
        let endX = playerPos.x + playerRenderDistance;
        let startY = playerPos.y - playerRenderDistance;
        let endY = playerPos.y + playerRenderDistance;
        return renderBasicChunk({ mapData: map, startX, startY, endX, endY });
        // render X
    };

    // const [mapData, setMapData] = useState([]);
    // only support square/reactangle maps

    // 1. parse the map and find the player model

    // 2. render all the tiles in x distance from the player.
    // 3. have an useEffect when the player model moves tiles,
    //    3a. render the new tiles into frame without re-resolving the old tiles.
    //        I think this would be possible by using an array[array[]] of refs, and then replacing the refs as the player moves.
    //        I think the tiles render in space relative to their index, so we should be able to just remove them
    //        and then yeah, take that ref array and just output it as the JSX.

    // const updatePlayerPosition = () => {
    //     const player = findGameObjectByName('player');
    //     let updateX: undefined | number;
    //     let updateY: undefined | number;
    //     // console.log('loc', player.transform);
    //     if (Math.floor(playerPosition.x) !== Math.floor(player.transform.x)) {
    //         updateX = Math.floor(player.transform.x);
    //     }
    //     if (Math.floor(playerPosition.y) !== Math.floor(player.transform.y)) {
    //         updateY = Math.floor(player.transform.y);
    //     }
    //     if (updateX !== undefined || updateY !== undefined) {
    //         console.log('player moved', playerPosition);
    //         setPlayerPosition({
    //             x: updateX ?? playerPosition.x,
    //             y: updateY ?? playerPosition.y,
    //         });
    //         renderChunk(mapData, player.transform);
    //     }
    // };
    const [currentChunk, setCurrentChunk] = useState(
        renderChunk(mapData, playerPosition)
    );
    /// ^
    /// |
    /// |
    /// |
    /// |
    /// |
    /// Y
    /// X ---------->
    //
    //    N
    //  E ∫ W
    //    S

    const chunks = useRef<Array<ReturnType<typeof renderChunk>>>([
        renderBasicChunk({
            mapData: mapData,
            startX: currentChunk.startX,
            endX: currentChunk.endX,
            endY: currentChunk.endY + 2,
            startY: currentChunk.endY - 2,
        }),
    ]);
    // renderChunk(mapData, { y: currentChunk.endY + 1, x: currentChunk.endX + 1 })
    // const SChunk = useRef<ReturnType<typeof renderChunk>>();
    // // renderChunk(mapData, { y: currentChunk.startY - 1, x: currentChunk.startX })
    // const SEChunk = useRef<ReturnType<typeof renderChunk>>();
    // // renderChunk(mapData, { y: currentChunk.endY - 1, x: currentChunk.startX - 1 })
    // const SWChunk = useRef<ReturnType<typeof renderChunk>>();
    // // renderChunk(mapData, { y: currentChunk.endY + 1, x: currentChunk.startX - 1 })
    // const EChunk = useRef<ReturnType<typeof renderChunk>>();
    // // renderChunk(mapData, { y: currentChunk.startY, x: currentChunk.startX - 1 })
    // const WChunk = useRef<ReturnType<typeof renderChunk>>(
    //     renderBasicChunk({
    //         mapData: mapData,
    //         startX: currentChunk.endX - 2,
    //         endX: currentChunk.endX + 2,
    //         endY: currentChunk.endY,
    //         startY: currentChunk.startY,
    //     })
    // );
    // render initial chunk
    useEffect(() => {}, []);

    const handler = useCallback(
        swag => {
            if (swag.x === playerPosition.x && swag.y === playerPosition.y) {
                return;
            }
            console.log('move', swag);
            // setPlayerPosition(swag);
            if (currentChunk.inChunk(swag)) {
                return;
            }
            // if (NChunk.current.inChunk(swag)) {
            //     console.log('render up');
            //     SChunk.current = NChunk.current;
            //     setCurrentChunk(NChunk.current);
            //     NChunk.current = renderBasicChunk({
            //         mapData: mapData,
            //         startX: NChunk.current.startX,
            //         endX: NChunk.current.endX,
            //         endY: NChunk.current.endY + 2,
            //         startY: NChunk.current.endY - 2,
            //     });
            // }
        },
        [playerPosition, mapData, currentChunk]
    );

    useLayoutEffect(() => {
        setMapSize([mapWidth, mapHeight]);
        // renderChunk(mapData, { x: playerx, y: playery });
        // if in north chunks, delete south chunks, render more north chunks, and set current chunk

        // TODO: uncomment the code below to do the thing
        subscribe<WillMoveEvent>('will-move', handler);
        return () => unsubscribe('will-move', handler);
    }, [mapData, playerx, playery]);

    useEffect(() => {
        publish<TileMapUpdateEvent>('tile-map-update');
    }, [mapData, publish]);

    // console.log('renderdata', renderData);

    if (!resolver) return null;

    console.log('re-render', currentChunk.inChunk(playerPosition));
    // return (
    //     <>
    //         {playerEl}
    //         {currentChunk.chunk}
    //         {chunks.current?.map(t => t.chunk)}
    //         {/* {NChunk.current?.chunk}
    //         {NWChunk.current?.chunk}
    //         {WChunk.current?.chunk}
    //         {SWChunk.current?.chunk}
    //         {SChunk.current?.chunk}
    //         {SEChunk.current?.chunk}
    //         {EChunk.current?.chunk}
    //         {NEChunk.current?.chunk} */}
    //     </>
    // );
    // return (
    //     <GameObject>
    //         {renderData.current.map((ref, index) => {
    //             if (typeof ref === 'string') {
    //                 return <Fragment key={keyPrefix + index}></Fragment>;
    //             }
    //             return ref;
    //         })}
    //     </GameObject>
    // );

    // if (!playerPosition.current) return null;
    console.log(mapData, mapWidth);
    const renderedMap = mapData.map((value, index) => {
        const y = mapHeight - Math.floor(index / mapWidth);
        const x = index % mapWidth;
        return resolver(value, x, y);
    });
    console.log('map', renderedMap);
    return <>{renderedMap}</>;
}
