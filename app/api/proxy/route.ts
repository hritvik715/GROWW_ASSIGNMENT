// app/api/proxy/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url).searchParams.get("url");
    if (!url) {
      console.error("proxy: missing url param");
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    const decoded = decodeURIComponent(url);
    console.log("proxy_fetch: fetching ->", decoded);

    // You can add or modify headers here if an upstream requires it:
    const res = await fetch(decoded, {
      headers: {
        "User-Agent": "FinBoard/1.0", // optional but some servers expect UA
      },
      // you can add: mode: 'cors' etc if needed
    });

    const text = await res.text();
    console.log("proxy_fetch: status ->", res.status);

    if (!res.ok) {
      // log upstream response body for debugging (only in dev)
      console.error("proxy_fetch: upstream returned non-ok:", res.status, text);
      return NextResponse.json({ error: "upstream non-ok", status: res.status, body: text }, { status: 502 });
    }

    // Return upstream body with appropriate content-type:
    return new Response(text, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "application/json" },
    });
  } catch (err: any) {
    // Important: log the ENTIRE error object for debugging
    console.error("proxy_fetch_error:", err, err?.stack);
    return NextResponse.json({ error: String(err?.message || err), stack: String(err?.stack || "") }, { status: 500 });
  }
}
