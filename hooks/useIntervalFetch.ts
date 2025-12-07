"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function useIntervalFetch(apiUrl: string, intervalSec?: number) {
  const [state, setState] = useState<{ status: string; data: any; error: any; lastUpdated: number | null }>({
    status: "idle",
    data: null,
    error: null,
    lastUpdated: null,
  });
  const savedUrl = useRef(apiUrl);
  useEffect(() => { savedUrl.current = apiUrl }, [apiUrl]);

  useEffect(() => {
    if (!apiUrl) return;
    let mounted = true;
    const minInterval = Math.max(5, intervalSec || 30);
    const fetchOnce = async () => {
      setState(s => ({ ...s, status: "loading" }));
      try {
        const res = await axios.get(`/api/proxy?url=${encodeURIComponent(savedUrl.current)}`);
        let parsed;
        try { parsed = JSON.parse(res.data); } catch { parsed = res.data; }
        if (mounted) setState({ status: "success", data: parsed, error: null, lastUpdated: Date.now() });
      } catch (err: any) {
        if (mounted) setState({ status: "error", data: null, error: err.message || String(err), lastUpdated: Date.now() });
      }
    };

    fetchOnce();
    const id = setInterval(fetchOnce, minInterval * 1000);
    return () => { mounted = false; clearInterval(id); }
  }, [apiUrl, intervalSec]);

  return state;
}
