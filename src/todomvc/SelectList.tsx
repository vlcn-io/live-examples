import { CtxAsync } from "@vlcn.io/react";
import { DB, SQLite3 } from "@vlcn.io/wa-crsqlite";
import React from "react";

export default function SelectList({
  sqlite,
  currentCtx,
  onDbOpened,
}: {
  sqlite: SQLite3;
  currentCtx: CtxAsync | null;
  onDbOpened: (db: DB, localdbid: string) => void;
}) {
  // if current db is not null, shut it down before opening a new one
  return <div></div>;
}
