import React from "react";
import { DB } from "@vlcn.io/wa-crsqlite";

export default function TodoList({ db }: { db: DB | null }) {
  // if db is null, spinner to indicate loading
  return <div></div>;
}
