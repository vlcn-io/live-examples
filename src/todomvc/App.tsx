import React, { useState } from "react";

import { SQLite3 } from "@vlcn.io/crsqlite-wasm";

import SelectList from "./SelectList.js";
import TodoList from "./TodoList.js";
import { Ctx } from "./openDB.js";
import todoLists from "./todoLists.js";

export default function App({ sqlite }: { sqlite: SQLite3 }) {
  const [openOrConnect, setOpenOrConnect] = useState(true);
  const [ctx, setCtx] = useState<Ctx | null>(null);

  const onDbOpened = (ctx: Ctx) => {
    setCtx(ctx);
    setOpenOrConnect(false);
    todoLists.add({
      dbid: ctx.dbid,
      name: "New List",
      accessed: Date.now() / 1000,
    });
    window.location.hash = ctx.dbid;
  };

  return (
    <div>
      {openOrConnect ? (
        <SelectList
          currentCtx={ctx}
          sqlite={sqlite}
          onCancel={() => {
            setOpenOrConnect(false);
          }}
          onDbOpened={onDbOpened}
        />
      ) : (
        <>
          <span style={{ position: "absolute", top: -20 }}>
            Share the current URL with others to collaborate on this list.
          </span>
          <TodoList ctx={ctx} />
        </>
      )}
    </div>
  );
}
