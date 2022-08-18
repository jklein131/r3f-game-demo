import { useLayoutEffect } from 'react';
import useGameObject from './useGameObject';

export interface ComponentRef<ComponentName = string, Api = any> {
    name: ComponentName;
    api: Readonly<Api>;
}

export interface ComponentRegistryUtils {
    registerComponent: <T extends ComponentRef>(name: string, api: T['api']) => void;
    unregisterComponent: <T extends ComponentRef>(name: string) => void;
    getComponent: <T extends ComponentRef>(name: string) => T['api'];
}

export default function useComponentRegistry<T extends ComponentRef>(
    name: string,
    api: T['api']
) {
    const { registerComponent, unregisterComponent } = useGameObject();

    useLayoutEffect(() => {
        registerComponent<T>(name, api);
    });

    useLayoutEffect(() => {
        return () => unregisterComponent<T>(name);
    }, [unregisterComponent, name]);

    return api;
}
