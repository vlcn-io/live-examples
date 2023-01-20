import { DB, SQLite3 } from "@vlcn.io/wa-crsqlite";
import tblrx from "@vlcn.io/rx-tbl";
import startSync, { uuidStrToBytes } from "@vlcn.io/client-websocket";
import schema from "../schemas/todo-mvc?raw";

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
  const db = await sqlite.open(dbid);
  for (const x of schema.split(";")) {
    await db.exec(x);
  }

  const rx = tblrx(db);
  const sync = await startSync(getConnString(), {
    localDb: db,
    remoteDbId: uuidStrToBytes(dbid),
    create: {
      schemaName: "todo-mvc",
    },
    rx,
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
