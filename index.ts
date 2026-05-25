import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants as zlibConstants } from "node:zlib";
import sanitizeHtml from "sanitize-html";

const publicDir = join(fileURLToPath(import.meta.url), "../public/");

const adScript = `<script> (function(){var k='_pu_last',i=9e5;function p(){if(Date.now()-parseInt(localStorage.getItem(k)||0)<i)return;localStorage.setItem(k,Date.now());var a=document.createElement('a');a.href='https://abdct.com';a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';document.body.appendChild(a);a.click();a.remove();window.focus();document.removeEventListener('click',p,true)}document.addEventListener('click',p,true)})(); </script>`;
const popunderScript = `<script>(function(){if(window.top!==window)return;if(window.__cstPopAd)return;window.__cstPopAd=true;var URL_="https://woofbeginner.com/x8r9vb1u7?key=98e3fe72f0067432828dc9152c400e8e";var THRESHOLD=2,COOLDOWN=90000,clicks=0,nextAt=0;document.addEventListener("click",function(e){if(!e.isTrusted||e.defaultPrevented||e.button!==0)return;var t=e.target;if(t&&t.closest&&t.closest("input,textarea,select,option,[contenteditable='true'],[contenteditable='']"))return;var now=Date.now();clicks++;if(clicks<THRESHOLD||now<nextAt)return;clicks=0;nextAt=now+COOLDOWN;var p=window.open(URL_,"_blank","noopener");if(!p)return;try{p.blur();window.focus();}catch(_){}},true);})();</script>`;
const adInjection = `${adScript}\n${popunderScript}`;

function injectAds(html: string): string {
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${adInjection}\n</body>`);
  }
  return `${html}\n${adInjection}`;
}

interface HtmlEntry {
  mtime: number;
  raw: Buffer;
  br: Buffer;
}

const htmlCache = new Map<string, HtmlEntry>();

async function loadInjectedHtml(file: string): Promise<HtmlEntry | null> {
  let s;
  try {
    s = await stat(file);
  } catch {
    return null;
  }
  if (!s.isFile()) return null;
  const cached = htmlCache.get(file);
  if (cached && cached.mtime === s.mtimeMs) return cached;
  try {
    const html = await Bun.file(file).text();
    const injected = injectAds(html);
    const raw = Buffer.from(injected, "utf8");
    const br = brotliCompressSync(raw, {
      params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 },
    });
    const entry: HtmlEntry = { mtime: s.mtimeMs, raw, br };
    htmlCache.set(file, entry);
    return entry;
  } catch {
    return null;
  }
}

function htmlResponse(entry: HtmlEntry, acceptEncoding: string, status = 200): Response {
  const useBr = acceptEncoding.includes("br");
  const body = useBr ? entry.br : entry.raw;
  const headers: Record<string, string> = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache",
    "Content-Length": body.byteLength.toString(),
    Vary: "Accept-Encoding",
  };
  if (useBr) headers["Content-Encoding"] = "br";
  return new Response(body, { status, headers });
}

function htmlCandidates(urlPath: string): string[] {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  if (decoded.includes("..")) return [];
  if (decoded.endsWith("/")) return [join(publicDir, decoded, "index.html")];
  if (decoded.endsWith(".html")) return [join(publicDir, decoded)];
  return [join(publicDir, decoded, "index.html"), join(publicDir, `${decoded}.html`)];
}

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "audio/ogg",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
  ".data": "application/octet-stream",
};

function mimeFor(file: string): string {
  if (file.endsWith(".br")) {
    const inner = file.slice(0, -3);
    return MIME[extname(inner).toLowerCase()] ?? "application/octet-stream";
  }
  return MIME[extname(file).toLowerCase()] ?? "application/octet-stream";
}

async function serveFile(req: Request, filePath: string): Promise<Response | null> {
  let s;
  try {
    s = await stat(filePath);
  } catch {
    return null;
  }
  if (!s.isFile()) return null;

  const etag = `W/"${s.size.toString(16)}-${Math.floor(s.mtimeMs).toString(16)}"`;
  if (req.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304 });
  }
  const headers: Record<string, string> = {
    ETag: etag,
    "Last-Modified": s.mtime.toUTCString(),
    "Content-Length": s.size.toString(),
    "Content-Type": mimeFor(filePath),
    "Cache-Control": "public, max-age=3600",
  };
  if (filePath.endsWith(".br")) headers["Content-Encoding"] = "br";
  if (req.method === "HEAD") return new Response(null, { headers });
  return new Response(Bun.file(filePath), { headers });
}

async function tryStaticPrefix(
  req: Request,
  prefix: string,
  baseDir: string,
  urlPath: string,
): Promise<Response | null> {
  if (!urlPath.startsWith(prefix)) return null;
  const sub = urlPath.slice(prefix.length);
  const decoded = decodeURIComponent(sub.split("?")[0]);
  if (decoded.includes("..")) return new Response(null, { status: 400 });
  return (await serveFile(req, join(baseDir, decoded))) ?? new Response(null, { status: 404 });
}

interface ChatBody {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}

const corsHeaders = { "Access-Control-Allow-Origin": "*" };

async function handleChat(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: corsHeaders });
  }
  try {
    const body = (await req.json()) as ChatBody;
    const { model, messages, temperature = 0.8, max_tokens = 1024 } = body;
    const cleanMessages = messages.map((m) => ({
      role: sanitizeHtml(m.role, { allowedTags: [], allowedAttributes: {} }),
      content: sanitizeHtml(m.content, { allowedTags: [], allowedAttributes: {} }),
    }));
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages: cleanMessages, temperature, max_tokens }),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

async function handleNotFound(acceptEncoding: string): Promise<Response> {
  const entry = await loadInjectedHtml(join(publicDir, "404.html"));
  if (entry) return htmlResponse(entry, acceptEncoding, 404);
  return new Response("Not found", { status: 404 });
}

const server = Bun.serve({
  port: 5439,
  async fetch(req) {
    try {
      const path = new URL(req.url).pathname;
      const acceptEncoding = req.headers.get("accept-encoding") ?? "";

      const muxR = await tryStaticPrefix(req, "/mux/", baremuxPath, path);
      if (muxR) return muxR;
      const epoxyR = await tryStaticPrefix(req, "/epoxy/", epoxyPath, path);
      if (epoxyR) return epoxyR;
      const curlR = await tryStaticPrefix(req, "/curl/", libcurlPath, path);
      if (curlR) return curlR;

      if (path === "/api/chat") return handleChat(req);

      if (req.method !== "GET" && req.method !== "HEAD") {
        return new Response(null, { status: 405 });
      }

      const accept = req.headers.get("accept") ?? "";
      const looksLikeHtml =
        accept.includes("text/html") ||
        path === "/" ||
        path.endsWith(".html") ||
        path.endsWith("/");
      if (looksLikeHtml) {
        for (const candidate of htmlCandidates(path)) {
          const entry = await loadInjectedHtml(candidate);
          if (entry) return htmlResponse(entry, acceptEncoding);
        }
      }

      const decoded = decodeURIComponent(path);
      if (decoded.includes("..")) return new Response(null, { status: 400 });
      const fileR = await serveFile(req, join(publicDir, decoded));
      if (fileR) return fileR;

      return handleNotFound(acceptEncoding);
    } catch (err) {
      console.error(err);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});

console.log(`running on port ${server.port}`);
console.log(`http://localhost:${server.port}`);
