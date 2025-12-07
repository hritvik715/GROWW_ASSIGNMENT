import React from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function LayoutGrid({ widgets, onLayoutChange, children }:
  { widgets: any[]; onLayoutChange: (l: any[]) => void; children: (w: any) => React.ReactNode }) {
  const layout = widgets.map(w => ({ i: w.id, x: w.layout?.x ?? 0, y: w.layout?.y ?? 0, w: w.layout?.w ?? 4, h: w.layout?.h ?? 2 }));
  const handleLayout = (newLayout: any) => { onLayoutChange(newLayout); };

  return (
    <div className="p-4">
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={80} width={1200} onLayoutChange={handleLayout}>
        {widgets.map(w => (
          <div key={w.id} className="p-2 h-full overflow-hidden">
            <div className="h-full">{children(w)}</div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
