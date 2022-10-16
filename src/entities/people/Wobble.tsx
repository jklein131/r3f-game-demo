import { useCallback, useRef } from 'react';
import { useScene } from 'src/@core/Scene';
import useGameLoop from 'src/@core/useGameLoop';
import useGameObject from 'src/@core/useGameObject';
import { characterOffsetY } from 'src/components/CharacterScript';

export function Wobble({ children }: any) {
    const { transform, getComponent } = useGameObject();
    const { instantiate } = useScene();
    const groupRef = useRef<THREE.Group>();
    const childRef = useRef<THREE.Group>();
    const scaleRef = useRef<THREE.Group>();
    const movementWobble = useRef(0);
    const movementCount = useRef(0);
    const movementActive = useRef(false);

    // wobble effect while moving
    const wobble = useCallback(() => {
        if (movementActive.current) {
            movementCount.current += 0.1;
            if (movementWobble.current < 1) {
                movementWobble.current = Math.min(1, movementWobble.current + 0.02);
            }
        } else {
            movementWobble.current = Math.max(0, movementWobble.current - 0.1);
        }

        if (movementWobble.current > 0) {
            const wobbleTime = 2;
            const wobblePower = 0.17;
            const angle =
                Math.sin(movementCount.current * wobbleTime) *
                movementWobble.current *
                wobblePower;
            childRef.current.rotation.set(0, 0, angle);
        } else {
            childRef.current.rotation.set(0, 0, 0);
        }
    }, []);

    useGameLoop(time => {
        // apply wobbling animation
        wobble();

        // apply breathe animation
        if (!movementActive.current) {
            // breathe animation while standing still
            const breathIntensity = 20;
            scaleRef.current.scale.setY(1 + Math.sin(time / 240) / breathIntensity);
        } else {
            // no breathe animation while moving
            scaleRef.current.scale.setY(1);
        }
    });

    const offsetY = 0.5;

    return (
        <group position-y={characterOffsetY}>
            <group ref={groupRef as any}>
                <group ref={scaleRef as any} position-y={-offsetY}>
                    <group position-y={offsetY}>
                        <group ref={childRef as any}>{children}</group>
                    </group>
                </group>
            </group>
        </group>
    );
}
