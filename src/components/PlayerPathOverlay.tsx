import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-three-fiber';
import Plant from '../entities/Plant';
import { PlantableRef } from './Plantable';
import { Position } from '../@core/GameObject';
import Graphic from '../@core/Graphic';
import useGameObject from '../@core/useGameObject';
import usePathfinding from '../@core/usePathfinding';
import spriteData from '../spriteData';
import useGame from '../@core/useGame';
import { CompressedPixelFormat } from 'three';

interface Props {
    path: Position[];
    pathVisible: boolean;
    pointer: Position;
    plantTree: boolean;
    hasTarget?: boolean;
    allowDiagonals: boolean;
}

const offsetZ = 1.5;

export default function PlayerPathOverlay({
    path,
    pathVisible,
    pointer,
    plantTree,
    hasTarget = false,
    allowDiagonals = true,
}: Props) {
    const { transform, nodeRef } = useGameObject();
    const findPath = usePathfinding();
    const [pointerPath, setPointerPath] = useState([]);
    const { findGameObjectsByXY } = useGame();

    // update on pointer change
    useEffect(() => {
        if (path.length || !pathVisible) return;
        const nextPath = findPath({
            from: transform,
            to: pointer,
            allowDiagonals: allowDiagonals,
        });
        setPointerPath(nextPath);
    }, [transform, path, pathVisible, pointer, findPath]);

    if (!nodeRef.current) return null;

    let renderedPath = null;

    let isPlantable = false;
    if (
        path.length > 0 &&
        plantTree &&
        findGameObjectsByXY(path[path.length - 1].x, path[path.length - 1].y).filter(
            gameObj => gameObj.getComponent<PlantableRef>('plantable')?.isPlantable
        )
    ) {
        isPlantable = true;
    }

    const graphic2 = <Graphic {...spriteData.ui} state="dot" opacity={0.25} />;
    if (pathVisible) {
        renderedPath = path.length
            ? path.map(({ x, y }, index) => (
                  // eslint-disable-next-line react/jsx-indent
                  <group key={`pp-${x}-${y}`} position={[x, y, offsetZ]}>
                      <Graphic
                          {...spriteData.ui}
                          state="dot"
                          opacity={Math.min(0.75, index / 5)}
                      />
                  </group>
              ))
            : pointerPath.map(({ x, y }) => (
                  // eslint-disable-next-line react/jsx-indent
                  <group key={`pp2-${x}-${y}`} position={[x, y, offsetZ]}>
                      {graphic2}
                  </group>
              ));
    }

    const selectColor = hasTarget ? 'red' : undefined;

    return (
        <>
            {createPortal(
                <>
                    {renderedPath}
                    <group key="mainpo-path" position={[pointer.x, pointer.y, offsetZ]}>
                        <Graphic
                            {...spriteData.ui}
                            state="select"
                            color={selectColor}
                            opacity={pathVisible ? 1 : 0.5}
                        />
                    </group>
                    {isPlantable && path.length > 0 ? (
                        <group
                            key="mainpo-p-path"
                            position={[
                                path[path.length - 1].x,
                                path[path.length - 1].y,
                                offsetZ,
                            ]}
                        >
                            <Plant />
                            {/* This should be replaced by a tree outline. */}
                        </group>
                    ) : (
                        <></>
                    )}
                </>,
                nodeRef.current.parent
            )}
        </>
    );
}
