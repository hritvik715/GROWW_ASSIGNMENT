import React from "react";

export default function Header({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-emerald-600 flex items-center justify-center font-semibold">Fin</div>
        <div>
          <div className="font-bold text-lg">Finance Dashboard</div>
          <div className="text-sm text-slate-400">Connect to APIs and build your custom dashboard</div>
        </div>
      </div>
      <div>
        <button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded">+ Add Widget</button>
      </div>
    </header>
  );
}
