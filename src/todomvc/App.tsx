import React, { useState } from "react";

import { SQLite3, DB } from "@vlcn.io/wa-crsqlite";

import todoLists from "./todoLists.js";
import SelectList from "./SelectList.js";
import TodoList from "./TodoList.js";

const lastUsed = todoLists.lastAccessed();

export default function App({ sqlite }: { sqlite: SQLite3 }) {
  const [openOrConnect, setOpenOrConnect] = useState(lastUsed == null);
  const [db, setDb] = useState<DB | null>(null);

  return (
    <div className="todoapp">
      <TodoList db={db} />
      {openOrConnect ? <SelectList currentDb={db} sqlite={sqlite} /> : null}
    </div>
  );
}
