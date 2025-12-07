"use client";

import React, { useState } from "react";
import axios from "axios";
import FieldPicker from "./FieldPicker";

export default function AddWidgetModal({ open, onClose, onAdd }:
  { open: boolean, onClose: () => void, onAdd: (cfg: any) => void }) {
  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [interval, setInterval] = useState(30);
  const [sample, setSample] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [errorTest, setErrorTest] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<{ path: string; label?: string }[]>([]);

  if (!open) return null;

  const testApi = async () => {
    if (!apiUrl) { setErrorTest("API URL required"); return; }
    setLoadingTest(true); setErrorTest(null); setSample(null);
    try {
      const res = await axios.get(`/api/proxy?url=${encodeURIComponent(apiUrl)}`);
      let parsed;
      try { parsed = JSON.parse(res.data); } catch { parsed = res.data; }
      setSample(parsed);
    } catch (err: any) {
      setErrorTest(err.message || "Request failed");
    } finally { setLoadingTest(false); }
  };

  const addField = (f: { path: string; label?: string }) => setSelectedFields(s => [...s, f]);

  const handleAdd = () => {
    if (!name || !apiUrl || selectedFields.length === 0) {
      alert("Provide name, url and at least one field");
      return;
    }
    onAdd({ name, apiUrl, refreshInterval: Number(interval), selectedFields });
    setName(""); setApiUrl(""); setInterval(30); setSample(null); setSelectedFields([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[900px] max-w-[95%] bg-slate-900 border border-slate-800 rounded shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add New Widget</h3>
          <button className="text-slate-400" onClick={onClose}>✕</button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Widget Name</label>
            <input className="w-full p-2 rounded bg-slate-800 border border-slate-700 mt-1" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Bitcoin Price" />
            <label className="text-sm text-slate-300 mt-3 block">API URL</label>
            <input className="w-full p-2 rounded bg-slate-800 border border-slate-700 mt-1" value={apiUrl} onChange={e=>setApiUrl(e.target.value)} placeholder="https://api.coinbase.com/v2/exchange-rates?currency=BTC" />
            <div className="flex gap-2 mt-3">
              <button className="bg-slate-700 px-3 py-1 rounded" onClick={testApi} disabled={loadingTest}>{loadingTest ? "Testing..." : "Test"}</button>
              <input type="number" min="5" value={interval} onChange={e=>setInterval(Number(e.target.value))} className="w-24 p-2 rounded bg-slate-800 border border-slate-700" />
              <div className="text-sm text-slate-400 px-2">sec</div>
            </div>
            {errorTest && <div className="text-red-500 mt-2 text-sm">{errorTest}</div>}
            {sample && <div className="mt-3 text-slate-300 text-sm">Sample response loaded — pick fields below.</div>}
          </div>

          <div>
            <label className="text-sm text-slate-300">Selected Fields</label>
            <div className="mt-2 min-h-[100px] p-2 border border-slate-800 rounded bg-slate-900">
              {selectedFields.length === 0 ? <div className="text-slate-500">No fields selected</div> : selectedFields.map(f => (
                <div key={f.path} className="flex justify-between p-1 text-sm border-b border-slate-800">
                  <div>{f.label || f.path}</div>
                  <div className="text-slate-400 cursor-pointer" onClick={() => setSelectedFields(s => s.filter(x=>x.path!==f.path))}>remove</div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <label className="text-sm text-slate-300">Field Picker</label>
              <div className="mt-1">
                <FieldPicker sampleJson={sample} onAddField={addField} selectedFields={selectedFields} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 rounded border border-slate-700" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-emerald-600" onClick={handleAdd}>Add Widget</button>
        </div>
      </div>
    </div>
  );
}
