import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import create from "zustand";
import type { StateCreator } from "zustand";

/** types here (same as you already have) */
export type Widget = {
  id: string;
  name: string;
  apiUrl: string;
  refreshInterval: number;
  selectedFields: { path: string; label?: string }[];
  layout: { x: number; y: number; w: number; h: number };
};

export type State = {
  widgets: Widget[];
  addWidget: (w: Partial<Widget>) => Widget;
  updateWidget: (id: string, patch: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
  setWidgets: (widgets: Widget[]) => void;
};

/**
 * Safe cast pattern: cast `persist` so TypeScript accepts it.
 * This matches the docs "safe cast" approach.
 */
// -------------------------------------------
// store/useDashboardStore.ts
// (replace the existing export const useDashboardStore = create<State>(...) block)
// -------------------------------------------
// store/useDashboardStore.ts
// (replace the existing export const useDashboardStore = create<State>(...) block)

export const useDashboardStore = create<State>(
  // cast persist so TypeScript accepts the wrapper with optional options arg
  (persist as unknown as (config: StateCreator<State>, options?: any) => StateCreator<State>)(
    (set, get) => ({
      widgets: [],

      addWidget: (widget: Partial<Widget>) => {
        const w: Widget = {
          id: uuidv4(),
          name: widget.name || "widget",
          apiUrl: widget.apiUrl || "",
          refreshInterval: widget.refreshInterval ?? 30,
          selectedFields: widget.selectedFields || [],
          layout: widget.layout || { x: 0, y: 0, w: 4, h: 2 },
        };
        set((state: State) => ({ widgets: [...state.widgets, w] }));
        return w;
      },

      updateWidget: (id: string, patch: Partial<Widget>) =>
        set((state: State) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        })),

      removeWidget: (id: string) =>
        set((state: State) => ({ widgets: state.widgets.filter((w) => w.id !== id) })),

      setWidgets: (widgets: Widget[]) => set(() => ({ widgets })),
    }),
    // <-- options object passed to persist
    { name: "finance-dashboard-storage" }
  )
);
