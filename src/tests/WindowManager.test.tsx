import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BaseWindow } from '../components/Window/BaseWindow';
import { useWindowStore } from '../core/state/useWindowStore';

describe('Window Manager State & BaseWindow', () => {
    beforeEach(() => {
        // Reset Zustand store state before each test
        useWindowStore.setState({ windows: [], focusedWindowId: null });
    });

    it('can open a window and render it', () => {
        // Action: open window
        const { openWindow, windows } = useWindowStore.getState();
        openWindow('Test App', 'fileExplorer');

        // Retrieve new state after action
        const updatedWindows = useWindowStore.getState().windows;
        expect(updatedWindows.length).toBe(1);
        expect(updatedWindows[0].title).toBe('Test App');

        // Render the window
        render(
            <BaseWindow window={updatedWindows[0]}>
                <div data-testid="app-content">Content</div>
            </BaseWindow>
        );

        // Verify window UI
        expect(screen.getByText('Test App')).toBeInTheDocument();
        expect(screen.getByTestId('app-content')).toBeInTheDocument();
    });

    it('can minimize a window', () => {
        // Setup
        const { openWindow, minimizeWindow } = useWindowStore.getState();
        openWindow('App 1', 'fileExplorer');
        const win = useWindowStore.getState().windows[0];

        // Minimize action
        minimizeWindow(win.id);
        const updatedWin = useWindowStore.getState().windows[0];
        expect(updatedWin.isMinimized).toBe(true);

        // Minimized windows render null in BaseWindow
        const { container } = render(
            <BaseWindow window={updatedWin}>
                <div>Content</div>
            </BaseWindow>
        );
        expect(container.firstChild).toBeNull();
    });
});
