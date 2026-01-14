import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";
import dotenv from "dotenv";
import sanitizeHtml from "sanitize-html";
import cors from "cors";

// privacy
logging.set_level(logging.NONE);

dotenv.config();

// paths
const app = express();
app.use(express.json());
app.use(express.static(join(fileURLToPath(import.meta.url), "../public/")));
app.use("/mux/", express.static(baremuxPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/curl/", express.static(libcurlPath));
app.use(cors());

// ai (maybe)
app.post("/api/chat", async (req, res) => {
  try {
    const { model, messages, temperature = 0.8, max_tokens = 1024 } = req.body;

    const cleanMessages = messages.map(m => ({
      role: sanitizeHtml(m.role, { allowedTags: [], allowedAttributes: {} }),
      content: sanitizeHtml(m.content, { allowedTags: [], allowedAttributes: {} })
    }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, messages: cleanMessages, temperature, max_tokens })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res, next) => {
  res.status(404).sendFile(join(fileURLToPath(import.meta.url), "../public/", "404.html"));
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

server.listen(3000, () => {
  console.log("running on port 3000");
  console.log("http://localhost:3000");
});
