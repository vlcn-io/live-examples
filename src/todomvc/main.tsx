import * as React from "react";
import { createRoot } from "react-dom/client";
import sqliteWasm, { SQLite3 } from "@vlcn.io/wa-crsqlite";
import wasmUrl from "@vlcn.io/wa-crsqlite/wa-sqlite-async.wasm?url";

import App from "./App.js";
import "./base.css";
import "./style.css";
import todoLists from "./todoLists.js";

async function main(): Promise<void> {
  const sqlite = await sqliteWasm(() => wasmUrl);
  startApp(sqlite);
}

function startApp(sqlite: SQLite3) {
  const hash = window.location.hash.substring(1).trim();
  const lastAccessed = todoLists.lastAccessed();
  if (hash === "" && lastAccessed) {
    window.location.hash = lastAccessed.dbid;
  }
  const root = createRoot(document.getElementById("container")!);
  root.render(<App sqlite={sqlite} />);
}

/**
 * Need a selection to open file(s) / lists
 * Or connect to remote lists
 *
 * Same name for remote and local dbs?
 * Meta DB with remote and local names? Share remote db name with others?
 *
 * The other option is partial replication...
 *
 * Just keep list of lists in local storage? Given we don't have user logins.
 */

main();
