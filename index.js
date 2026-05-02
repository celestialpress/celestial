import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
// ONLY REMOVE WHEN SELF-HOSTING
// import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, stat } from "node:fs/promises";
import fetch from "node-fetch";
import dotenv from "dotenv";
import sanitizeHtml from "sanitize-html";
import cors from "cors";

// privacy, also remove when self-hosting
// logging.set_level(logging.NONE);

dotenv.config();

// paths
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  if (req.url.endsWith(".br")) {
    res.set("Content-Encoding", "br");
    if (req.url.includes(".js.br")) {
      res.type("application/javascript");
    } else if (req.url.includes(".wasm.br")) {
      res.type("application/wasm");
    } else if (req.url.includes(".data.br")) {
      res.type("application/octet-stream");
    } else if (req.url.includes(".wasm.framework.js.br")) {
       res.type("application/javascript");
    }
  }
  next();
});


const publicDir = join(fileURLToPath(import.meta.url), "../public/");

const adScript = `<script>console.log("injected");</script>`;

const popunderScript = `<script>(function(){if(window.top!==window)return;if(window.__cstPopAd)return;window.__cstPopAd=true;var URL_="https://woofbeginner.com/x8r9vb1u7?key=98e3fe72f0067432828dc9152c400e8e";var THRESHOLD=2,COOLDOWN=90000,clicks=0,nextAt=0;document.addEventListener("click",function(e){if(!e.isTrusted||e.defaultPrevented||e.button!==0)return;var t=e.target;if(t&&t.closest&&t.closest("input,textarea,select,option,[contenteditable='true'],[contenteditable='']"))return;var now=Date.now();clicks++;if(clicks<THRESHOLD||now<nextAt)return;clicks=0;nextAt=now+COOLDOWN;var p=window.open(URL_,"_blank","noopener");if(!p)return;try{p.blur();window.focus();}catch(_){}},true);})();</script>`;

const adInjection = `${adScript}\n${popunderScript}`;

function injectAds(html) {
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${adInjection}\n</body>`);
  }
  return `${html}\n${adInjection}`;
}

async function resolveHtmlFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  if (decoded.includes("..")) return null;
  const candidates = [];
  if (decoded.endsWith("/")) {
    candidates.push(join(publicDir, decoded, "index.html"));
  } else if (decoded.endsWith(".html")) {
    candidates.push(join(publicDir, decoded));
  } else {
    candidates.push(join(publicDir, decoded, "index.html"));
    candidates.push(join(publicDir, `${decoded}.html`));
  }
  for (const file of candidates) {
    try {
      const s = await stat(file);
      if (s.isFile()) return file;
    } catch {}
  }
  return null;
}

app.use(async (req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const accept = req.headers.accept || "";
  if (!accept.includes("text/html") && req.path !== "/" && !req.path.endsWith(".html") && !req.path.endsWith("/")) {
    return next();
  }
  const file = await resolveHtmlFile(req.path);
  if (!file) return next();
  try {
    const html = await readFile(file, "utf8");
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(injectAds(html));
  } catch {
    next();
  }
});

app.use(express.static(publicDir));
app.use("/mux/", express.static(baremuxPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/curl/", express.static(libcurlPath));
app.use("/scram/", express.static(scramjetPath));
app.use(cors());

// ai (maybe)
app.post("/api/chat", async (req, res) => {
  try {
    const { model, messages, temperature = 0.8, max_tokens = 1024 } = req.body;

    const cleanMessages = messages.map((m) => ({
      role: sanitizeHtml(m.role, { allowedTags: [], allowedAttributes: {} }),
      content: sanitizeHtml(m.content, {
        allowedTags: [],
        allowedAttributes: {},
      }),
    }));

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: cleanMessages,
          temperature,
          max_tokens,
        }),
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(async (req, res, next) => {
  try {
    const html = await readFile(join(publicDir, "404.html"), "utf8");
    res.status(404).set("Content-Type", "text/html; charset=utf-8").send(injectAds(html));
  } catch {
    res.status(404).send("Not found");
  }
});

const server = createServer();

server.on("request", (req, res) => {
  app(req, res);
});
server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(5439, () => {
  console.log("running on port 5439");
  console.log("http://localhost:5439");
});
