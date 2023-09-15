import express from "express";
import { attachWebsocketServer } from "@vlcn.io/ws-server";
import * as http from "http";

const PORT = parseInt(process.env.PORT || "8080");

const app = express();
const server = http.createServer(app);

const wsConfig = {
  dbFolder: "./dbs",
  schemaFolder: "./src/schemas",
  pathPattern: /\/sync/,
};

attachWebsocketServer(server, wsConfig);

if (process.env.NODE_ENV === "production") {
  express.static("dist");
}

server.listen(PORT, () =>
  console.log("info", `listening on http://localhost:${PORT}!`)
);
