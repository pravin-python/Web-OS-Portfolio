import React from 'react';
import { useWindowStore } from '../../core/state/useWindowStore';
import { BaseWindow } from '../../components/Window/BaseWindow';
import { getAppComponent } from '../../core/appRegistry';

export const WindowManager: React.FC = () => {
    const windows = useWindowStore((state) => state.windows);

    return (
        <>
            {windows.map((win) => {
                const AppContent = getAppComponent(win.appType);
                return (
                    <BaseWindow key={win.id} window={win}>
                        <AppContent window={win} />
                    </BaseWindow>
                );
            })}
        </>
    );
};
