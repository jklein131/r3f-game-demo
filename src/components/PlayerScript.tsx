import React, { useEffect, useRef, useState } from 'react';
import useGameObjectEvent from 'src/@core/useGameObjectEvent';
import spriteData from 'src/spriteData';
import { Position } from '../@core/GameObject';
import {
    InteractableRef,
    InteractableRightClickRef,
    InteractionEvent,
} from '../@core/Interactable';
import { MoveableRef } from '../@core/Moveable';
import useCollisionTest from '../@core/useCollisionTest';
import useGameLoop from '../@core/useGameLoop';
import useGameObject from '../@core/useGameObject';
import useKeyPress from '../@core/useKeyPress';
import usePathfinding from '../@core/usePathfinding';
import usePointer from '../@core/usePointer';
import usePointerClick from '../@core/usePointerClick';
import tileUtils from '../@core/utils/tileUtils';
import PlayerPathOverlay from './PlayerPathOverlay';

export default function PlayerScript({ allowDiagonals }: { allowDiagonals: boolean }) {
    const { getComponent, transform, subscribe, unsubscribe } = useGameObject();
    const testCollision = useCollisionTest();
    const findPath = usePathfinding();
    const [path, setPath] = useState<{ path: Position[]; rightClick: boolean }>({
        path: [],
        rightClick: false,
    });
    const [pathOverlayEnabled, setPathOverlayEnabled] = useState(true);

    // key controls
    const leftKey = useKeyPress(['ArrowLeft', 'a']);
    const rightKey = useKeyPress(['ArrowRight', 'd']);
    const upKey = useKeyPress(['ArrowUp', 'w']);
    const downKey = useKeyPress(['ArrowDown', 's']);

    useGameLoop(() => {
        const direction = {
            x: -Number(leftKey) + Number(rightKey),
            y: Number(upKey) - Number(downKey),
        };
        const nextPosition = tileUtils(transform).add(direction);
        // is same position?
        if (tileUtils(nextPosition).equals(transform)) return;

        // is already moving?
        if (!getComponent<MoveableRef>('Moveable').canMove()) return;

        // will cut corner?
        const horizontal = { ...transform, x: nextPosition.x };
        const vertical = { ...transform, y: nextPosition.y };
        const canCross =
            direction.x !== 0 && direction.y !== 0
                ? // test diagonal movement
                  testCollision(horizontal) && testCollision(vertical)
                : true;

        if (canCross) {
            setPath({ ...path, path: [nextPosition] });
            setPathOverlayEnabled(false);
        }
    });

    // mouse controls
    const pointer = usePointer();

    usePointerClick(event => {
        // console.log('e', event);
        // left click
        if (event.button === 0) {
            try {
                const nextPath = findPath({ to: pointer, allowDiagonals });
                if (path.path.length > 0) {
                    nextPath.unshift(transform);
                }
                setPath({ ...path, path: nextPath, rightClick: false });
                setPathOverlayEnabled(true);
            } catch {
                // pointer out of bounds
                setPath({ ...path, path: [] });
            }
        }

        // right click
        if (event.button === 2) {
            try {
                const nextPath = findPath({ to: pointer, allowDiagonals });
                if (path.path.length > 0) {
                    nextPath.unshift(transform);
                }
                setPath({ ...path, path: nextPath, rightClick: true });
                setPathOverlayEnabled(true);
                // place the tree
            } catch {
                // pointer out of bounds
                setPath({ ...path, path: [] });
            }
        }
    });

    // walk the path
    useEffect(() => {
        if (!path.path.length) return;

        // console.log('path', path.rightClick, path.path);

        const [nextPosition] = path.path;

        (async () => {
            const anyAction =
                (path.path.length === 1 && // try interaction on last step of path
                    (path.rightClick
                        ? await getComponent<InteractableRightClickRef>(
                              'InteractableRightClick'
                          )?.interactRightClick(nextPosition)
                        : await getComponent<InteractableRef>('Interactable')?.interact(
                              nextPosition
                          ))) ||
                (await getComponent<MoveableRef>('Moveable')?.move(nextPosition));

            if (anyAction) {
                // proceed with next step in path
                setPath(current => ({ ...current, path: current.path.slice(1) }));
            }
        })();
    }, [path, getComponent]);

    return (
        <PlayerPathOverlay
            allowDiagonals={allowDiagonals}
            path={path.path}
            pathVisible={pathOverlayEnabled}
            pointer={pointer}
            plantTree={path.rightClick}
        />
    );
}
