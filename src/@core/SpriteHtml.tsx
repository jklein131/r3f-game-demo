import React, { Dispatch, SetStateAction, useState, RefObject, useRef } from 'react';
import { Position } from './GameObject';
import Graphic, { GraphicProps } from './Graphic';
import useComponentRegistry, { ComponentRef } from './useComponentRegistry';
import * as THREE from 'three';
import { extname } from 'node:path/win32';
import useAsset from './useAsset';
import { useTexture } from '@react-three/drei';

export type SpriteRef = ComponentRef<
    'Sprite',
    {
        setColor: Dispatch<SetStateAction<string>>;
        setOpacity: Dispatch<SetStateAction<number>>;
        setState: Dispatch<SetStateAction<string>>;
        setFlipX: Dispatch<SetStateAction<number>>;
        setScale: Dispatch<SetStateAction<number>>;
        setOffset: Dispatch<SetStateAction<Position>>;
        flipX: number;
        nodeRef: RefObject<THREE.Object3D>;
    }
>;

export type SpriteProps = GraphicProps & { name?: string };

export default function SpriteHtml({
    src,
    sheet,
    rotation,
    state,
    frameWidth,
    startFrame,
    frameHeight,
    frameTime,
}: {
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
}) {
    console.log(
        'imgs',
        sheet[state][0][0] * frameWidth,
        sheet[state][0][1] * frameHeight
    );
    const bimg =
        'url(' +
        src +
        ') left ' +
        -sheet[state][0][0] * frameWidth +
        'px bottom ' +
        sheet[state][0][1] * frameHeight +
        'px';
    console.log('bimg', bimg);
    return (
        <div
            style={{
                background: bimg,
                height: frameHeight,
                width: frameWidth,
            }}
        ></div>
    );
}
