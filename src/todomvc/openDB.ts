import { DB, SQLite3 } from "@vlcn.io/wa-crsqlite";
import tblrx from "@vlcn.io/rx-tbl";
import startSync, { uuidStrToBytes } from "@vlcn.io/client-websocket";

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
  await db.exec(
    "CREATE TABLE IF NOT EXISTS todo (id primary key, text, completed)"
  );
  await db.exec(
    "CREATE TABLE IF NOT EXISTS presence (id primary key, name, x, y)"
  );
  await db.exec("SELECT crsql_as_crr('todo')");
  await db.exec("SELECT crsql_as_crr('presence')");

  const rx = tblrx(db);
  const sync = await startSync(`ws://${window.location.hostname}:8080/sync`, {
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
