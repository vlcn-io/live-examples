import { createRoot } from "react-dom/client";
// @ts-ignore
import { stringify as uuidStringify } from "uuid";

import "../todomvc/base.css";
import "../todomvc/style.css";

import App from "./App";
import { Ctx } from "./ctx.js";
import sqliteWasm from "@vlcn.io/crsqlite-wasm";
import tblrx from "@vlcn.io/rx-tbl";
import { wdbRtc } from "@vlcn.io/sync-p2p";

import wasmUrl from "@vlcn.io/crsqlite-wasm/crsqlite.wasm?url";

async function main() {
  const sqlite = await sqliteWasm(() => wasmUrl);

  const db = await sqlite.open("p2p-wdb-todomvc-10");
  (window as any).db = db;

  await db.exec(
    "CREATE TABLE IF NOT EXISTS todo (id primary key, text, completed)"
  );
  await db.exec("SELECT crsql_as_crr('todo')");
  const r = await db.execA("SELECT crsql_siteid()");
  const siteid = uuidStringify(r[0][0]);

  const rx = await tblrx(db);
  const rtc = await wdbRtc(
    db,
    // window.location.hostname === "localhost"
    //   ? {
    //       host: "localhost",
    //       port: 9000,
    //       path: "/examples",
    //     }
    // : undefined
    undefined
  );

  window.onbeforeunload = () => {
    db.close();
  };

  startApp({
    db,
    siteid,
    rtc,
    rx,
  });
}

function startApp(ctx: Ctx) {
  (window as any).ctx = ctx;
  const root = createRoot(document.getElementById("container")!);
  root.render(<App ctx={ctx} />);
}

main();
