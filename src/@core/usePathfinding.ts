import { useCallback } from 'react';
import findPath from './utils/findPath';
import { Position } from './GameObject';
import useGameObject from './useGameObject';
import useMapSnapshot from './useMapSnapshot';

interface PathfindingOptions {
    from?: Position;
    to: Position;
    allowDiagonals: boolean;
}

export default function usePathfinding() {
    const { transform } = useGameObject() || {}; // optional
    const createMap = useMapSnapshot();

    return useCallback(
        ({ from = transform, to, allowDiagonals }: PathfindingOptions) => {
            return findPath({
                from,
                to,
                map: createMap(to),
                allowDiagonals,
            });
        },
        [createMap, transform]
    );
}
