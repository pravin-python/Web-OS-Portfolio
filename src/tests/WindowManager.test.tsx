import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { BaseWindow } from "../components/Window/BaseWindow";
import { useWindowStore } from "../core/state/useWindowStore";

describe("Window Manager State & BaseWindow", () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useWindowStore.setState({ windows: [], focusedWindowId: null });
  });

  it("can open a window and render it", () => {
    // Action: open window
    const { openWindow } = useWindowStore.getState();
    openWindow("Test App", "fileExplorer");

    // Retrieve new state after action
    const updatedWindows = useWindowStore.getState().windows;
    expect(updatedWindows.length).toBe(1);
    expect(updatedWindows[0].title).toBe("Test App");

    // Render the window
    render(
      <MemoryRouter>
        <BaseWindow window={updatedWindows[0]}>
          <div data-testid="app-content">Content</div>
        </BaseWindow>
      </MemoryRouter>,
    );

    // Verify window UI
    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByTestId("app-content")).toBeInTheDocument();
  });

  it("can minimize a window", () => {
    // Setup
    const { openWindow, minimizeWindow } = useWindowStore.getState();
    openWindow("App 1", "fileExplorer");
    const win = useWindowStore.getState().windows[0];
    expect(win.isMinimized).toBe(false);

    // Minimize action
    minimizeWindow(win.id);
    const updatedWin = useWindowStore.getState().windows[0];
    expect(updatedWin.isMinimized).toBe(true);
  });
});
