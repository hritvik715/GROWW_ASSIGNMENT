"use client";

import React from "react";
import { getByPath } from "../lib/dataMapper";
import useIntervalFetch from "../hooks/useIntervalFetch";

export default function WidgetCard({ widget, onRemove }:
  { widget: any; onRemove: (id: string) => void }) {
  const { name, selectedFields = [] } = widget;
  const fetched = useIntervalFetch(widget.apiUrl, widget.refreshInterval);
  return (
    <div className="p-3 rounded bg-slate-800 border border-slate-700 h-full flex flex-col min-h-0 overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-slate-400">Refresh: {widget.refreshInterval}s</div>
        </div>
        <div className="text-sm flex gap-2">
          <button title="Remove" onClick={() => onRemove(widget.id)} className="text-red-400">🗑</button>
        </div>
      </div>

      <div className="mt-3 flex-1 min-h-0 overflow-auto">
        {(!fetched || fetched.status === "idle") && <div className="text-sm text-slate-400">No data yet.</div>}
        {fetched?.status === "loading" && <div className="text-sm text-slate-400">Loading...</div>}
        {fetched?.status === "error" && <div className="text-sm text-red-400">Error: {fetched.error}</div>}
        {fetched?.status === "success" && (
          <div className="space-y-2">
            {selectedFields.map((f: any) => {
              const value = getByPath(fetched.data, f.path);
              return (
                <div key={f.path} className="flex justify-between border-b border-slate-700 pb-1">
                  <div className="text-xs text-slate-300">{f.label || f.path}</div>
                  <div className="font-medium">{value === undefined ? "—" : String(value)}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="text-xs text-slate-500 mt-3">Last updated: {fetched?.lastUpdated ? new Date(fetched.lastUpdated).toLocaleTimeString() : '—'}</div>
    </div>
  );
}
