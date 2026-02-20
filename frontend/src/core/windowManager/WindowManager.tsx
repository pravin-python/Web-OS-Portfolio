import React from 'react';
import { useWindowStore } from '../../core/state/useWindowStore';
import { BaseWindow } from '../../components/Window/BaseWindow';
import { AppRegistry } from '../../apps/AppRegistry';

export const WindowManager: React.FC = () => {
    const windows = useWindowStore((state) => state.windows);

    return (
        <>
            {windows.map((win) => {
                const AppContent = AppRegistry[win.appType] || (() => <div>App Not Found</div>);
                return (
                    <BaseWindow key={win.id} window={win}>
                        <AppContent window={win} />
                    </BaseWindow>
                );
            })}
        </>
    );
};
