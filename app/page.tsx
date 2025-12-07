"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import AddWidgetModal from "../components/AddWidgetModal";
import LayoutGrid from "../components/LayoutGrid";
import WidgetCard from "../components/WidgetCard";
import { useDashboardStore , type State } from "../store/useDashboardStore";
import type { Widget } from "../store/useDashboardStore";


export default function Page() {
  const [open, setOpen] = useState(false);
  const widgets = useDashboardStore((s: State) => s.widgets);
  const addWidget = useDashboardStore((s: State) => s.addWidget);
  const updateWidget = useDashboardStore((s: State) => s.updateWidget);
  const removeWidget = useDashboardStore((s: State) => s.removeWidget);
  const setWidgets = useDashboardStore((s: State) => s.setWidgets);


  // Note: fetching is handled inside each WidgetCard to keep hooks stable.


  const onAdd = (cfg: any) => {
    const layout = { x: (widgets.length * 4) % 12, y: Infinity, w: 4, h: 2 };
    addWidget({ ...cfg, layout });
  };

  const onLayoutChange = (newLayout: any[]) => {
    newLayout.forEach(l => {
      updateWidget(l.i, { layout: { x: l.x, y: l.y, w: l.w, h: l.h }});
    });
  };

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(widgets, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dashboard.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) setWidgets(parsed);
        else alert("Invalid format");
      } catch {
        alert("Invalid JSON");
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen">
      <Header onAdd={() => setOpen(true)} />
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <button onClick={exportConfig} className="bg-slate-700 px-3 py-1 rounded">Export Config</button>
          <label className="bg-slate-700 px-3 py-1 rounded cursor-pointer">
            Import Config
            <input type="file" accept="application/json" onChange={importConfig} className="hidden" />
          </label>
        </div>

        <LayoutGrid widgets={widgets} onLayoutChange={onLayoutChange}>
          {(w: any) => (
            <div className="h-full">
              <WidgetCard widget={w} onRemove={(id: string) => removeWidget(id)} />
            </div>
          )}
        </LayoutGrid>
      </div>

      <AddWidgetModal open={open} onClose={() => setOpen(false)} onAdd={onAdd} />
    </main>
  );
}
