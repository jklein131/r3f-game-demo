import { useContext } from 'react';
import { AssetLoaderContext, TextureLoaderContext } from './AssetLoader';
import * as THREE from 'three';

type AssetUrlParam = string | { src: string | string[] };

export default function useAsset(urlOrObj: AssetUrlParam) {
    const assets = useContext(AssetLoaderContext);
    try {
        let url = typeof urlOrObj === 'string' ? urlOrObj : urlOrObj.src;
        // eslint-disable-next-line prefer-destructuring
        if (Array.isArray(url)) url = url[0];
        return assets.current[url];
    } catch {
        return null;
    }
}

// export function useTextureAsset(urlOrObj: AssetUrlParam) {
//     const assets = useContext(TextureLoaderContext);
//     try {
//         let url = typeof urlOrObj === 'string' ? urlOrObj : urlOrObj.src;
//         // eslint-disable-next-line prefer-destructuring
//         if (Array.isArray(url)) url = url[0];
//         return assets.current[url];
//     } catch {
//         return null;
//     }
// }
