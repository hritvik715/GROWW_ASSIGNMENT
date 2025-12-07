"use client";

import React, { useMemo, useState } from "react";
import { flattenPaths } from "../lib/dataMapper";

export default function FieldPicker({ sampleJson, onAddField, selectedFields }:
  { sampleJson: any, onAddField: (f: { path: string; label?: string }) => void, selectedFields: { path: string }[] }) {
  const [q, setQ] = useState("");
  const items = useMemo(() => flattenPaths(sampleJson || {}), [sampleJson]);
  const filtered = items.filter(it => it.path.includes(q) || String(it.value).includes(q));
  return (
    <div className="mt-3">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search for fields..." className="w-full p-2 rounded bg-slate-800 border border-slate-700" />
      <div className="mt-3 max-h-48 overflow-auto border border-slate-800 p-2 rounded">
        {filtered.map(it => {
          const already = selectedFields.some(s => s.path === it.path);
          return (
            <div key={it.path} className="flex items-center justify-between p-2 hover:bg-slate-800 rounded">
              <div>
                <div className="text-sm font-medium">{it.path}</div>
                <div className="text-xs text-slate-400 truncate">{JSON.stringify(it.value)}</div>
              </div>
              <div>
                <button disabled={already} onClick={() => onAddField({ path: it.path, label: it.path })} className={`px-3 py-1 rounded ${already ? 'opacity-50' : 'bg-emerald-600'}`}>
                  {already ? "Added" : "Add"}
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <div className="text-slate-400 text-sm">No fields found.</div>}
      </div>
    </div>
  )
}
