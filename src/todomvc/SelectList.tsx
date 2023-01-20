import { DB, SQLite3 } from "@vlcn.io/wa-crsqlite";
import React from "react";

export default function SelectList({
  sqlite,
  currentDb,
}: {
  sqlite: SQLite3;
  currentDb: DB | null;
}) {
  // if current db is not null, shut it down before opening a new one
  return <div></div>;
}
