import { DB, SQLite3 } from "@vlcn.io/crsqlite-wasm";
import tblrx from "@vlcn.io/rx-tbl";
import startSync from "@vlcn.io/client-websocket";
import schema from "../schemas/todo-mvc?raw";
import workerUri from "@vlcn.io/client-websocket/worker.js?url";

export type Ctx = {
  db: DB;
  rx: ReturnType<typeof tblrx>;
  sync: Awaited<ReturnType<typeof startSync>>;
  dbid: string;
};

export default async function openDB(
  sqlite: SQLite3,
  dbid: string
): Promise<Ctx> {
  const db = await sqlite.open(dbid + "-v1");
  for (const x of schema.split(";")) {
    await db.exec(x);
  }

  const rx = tblrx(db);
  const sync = await startSync(getConnString(), {
    localDb: db,
    remoteDbId: dbid,
    create: {
      schemaName: "todo-mvc",
    },
    rx,
    worker: false,
    workerUri,
  });

  return {
    db,
    rx,
    sync,
    dbid,
  };
}

function getConnString() {
  if (import.meta.env.DEV) {
    return `ws://${window.location.hostname}:8080/sync`;
  } else {
    return `wss://${window.location.hostname}/sync`;
  }
}
