import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { time } from 'console';
import { off } from 'process';
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MeshStandardMaterial, Vector2, Vector3 } from 'three';
import { Position } from './GameObject';
import useAsset from './useAsset';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import useGameLoop from './useGameLoop';
import waitForMs from './utils/waitForMs';

// it's a partial because some sprites will move position
export interface GraphicProps extends Partial<Position> {
    src: string;
    sheet?: {
        [index: string]: number[][];
    };
    rotation?: number;
    state?: string;
    frameWidth?: number;
    startFrame?: number;
    frameHeight?: number;
    frameTime?: number;
    scale?: number;
    flipX?: number;
    color?: string;
    opacity?: number;
    offset?: Position;
    blending?: THREE.Blending;
    magFilter?: THREE.TextureFilter;
    onIteration?: () => void;
}

// create geometry once and reuse
const geometry = new THREE.PlaneGeometry(1, 1);

console.log('grpahic redraw ');
export default /* eslint-disable react/prop-types */
forwardRef<THREE.Object3D, GraphicProps>(function Graphic(
    {
        src,
        sheet = {
            default: [[0, 0]],
        },
        state = 'default',
        frameWidth = 16,
        frameHeight = 16,
        frameTime = 200,
        scale = 1,
        flipX = 1,
        rotation = 0,
        startFrame = 0,
        color = '#fff',
        opacity = 1,
        offset = { x: 0, y: 0 },
        blending = THREE.NormalBlending,
        magFilter = THREE.NearestFilter,
        onIteration,
    }: GraphicProps,
    ref
) {
    if (!sheet[state]) {
        // eslint-disable-next-line no-console
        console.warn(
            `Sprite state '${state}' does not exist in sheet '${src}':`,
            Object.keys(sheet)
        );
        return <></>;
    }

    const image = useAsset(src) as HTMLImageElement;
    const textureRef = useRef<THREE.Texture>(new THREE.Texture(image));
    console.log('new');
    textureRef.current.needsUpdate = true;
    const mounted = useRef(true);
    const interval = useRef<number>();
    const prevFrame = useRef<number>(-1);

    const frames = sheet[state];
    const frameLength = frames.length;
    const frame = useRef(startFrame < frameLength ? startFrame : 0);
    const [firstFrame, lastFrame = firstFrame] = frames;

    const handleFrameUpdate = useCallback(() => {
        // return;
        let currentFrame = frames[frame.current];
        if (currentFrame === undefined) {
            //TODO fix this
            currentFrame = frames[0];
            return;
        }
        const textureOffsetX = (currentFrame[0] * frameWidth) / image.width;
        const textureOffsetY = (currentFrame[1] * frameHeight) / image.height;
        textureRef.current.offset.setX(textureOffsetX);
        textureRef.current.offset.setY(textureOffsetY);
    }, [firstFrame, frameHeight, frameWidth, image, textureRef]);

    // initial frame update
    useEffect(() => handleFrameUpdate(), [handleFrameUpdate]);

    // useGameLoop(time => {
    //     if (!mounted.current) return;
    //     if (interval.current == null) interval.current = time;

    //     if (time >= interval.current + frameTime) {
    //         interval.current = time;
    //         prevFrame.current = frame.current;
    //         frame.current = (frame.current + 1) % frameLength;

    //         // do I need this?
    //         handleFrameUpdate();

    //         if (prevFrame.current > 0 && frame.current === 0) {
    //             onIteration?.();
    //         }
    //     }
    // }, frameLength > 1);

    const iterationCallback = useRef<typeof onIteration>();
    iterationCallback.current = onIteration;
    // call onIteration on cleanup
    useEffect(
        () => () => {
            mounted.current = false;
            iterationCallback.current?.();
        },
        []
    );

    const materialProps = useMemo<
        Partial<THREE.MeshBasicMaterial & THREE.MeshLambertMaterial>
    >(
        () => ({
            color: new THREE.Color(color),
            opacity,
            blending,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            fog: false,
            // emissive: new THREE.Color('black'),
            // emissiveIntensity: 0,

            flatShading: true,
            precision: 'lowp',
        }),
        [opacity, blending, color]
    );

    const textureProps = useMemo<Partial<THREE.Texture>>(() => {
        const size = {
            x: image.width / frameWidth,
            y: image.height / frameHeight,
        };
        return {
            image,

            repeat: new THREE.Vector2(1 / size.x, 1 / size.y),
            magFilter,

            // center: new Vector2(size.x / 2, size.y / 2),
            minFilter: THREE.LinearMipMapLinearFilter,
        };
    }, [frameHeight, frameWidth, image, magFilter]);

    return (
        <mesh
            ref={ref as any}
            position={new Vector3(offset.x, offset.y, 0)}
            scale={[flipX * scale, scale, 1]}
            rotation={new THREE.Euler(offset.x, offset.y, -offset.y / 100 + rotation)}
            geometry={geometry}
        >
            <meshBasicMaterial attach="material" {...materialProps}>
                {/* <texture ref={textureRef as any} attach="alpha" {...textureProps} /> */}
                <texture ref={textureRef as any} attach="map" {...textureProps} />
            </meshBasicMaterial>
        </mesh>
    );
});
