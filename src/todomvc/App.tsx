import React, { useState } from "react";

import { SQLite3, DB } from "@vlcn.io/wa-crsqlite";

import todoLists from "./todoLists.js";
import SelectList from "./SelectList.js";
import TodoList from "./TodoList.js";
import { CtxAsync } from "@vlcn.io/react";

const lastUsed = todoLists.lastAccessed();

export default function App({ sqlite }: { sqlite: SQLite3 }) {
  const [openOrConnect, setOpenOrConnect] = useState(lastUsed == null);
  const [ctx, setCtx] = useState<CtxAsync | null>(null);
  const [localdbid, setLocaldbid] = useState<string | null>(null);

  const onDbOpened = () => {};

  return (
    <div>
      {openOrConnect ? (
        <SelectList currentCtx={ctx} sqlite={sqlite} onDbOpened={onDbOpened} />
      ) : (
        <TodoList ctx={ctx} localdbid={localdbid} />
      )}
    </div>
  );
}
