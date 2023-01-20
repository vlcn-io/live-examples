import { SQLite3 } from "@vlcn.io/wa-crsqlite";
import React, { useEffect, useState } from "react";
import initDB, { Ctx } from "./openDB.js";

const ITEM_STYLE = {
  cursor: "pointer",
};

const errorStyle = {
  padding: "12px",
  color: "red",
};

import todoLists from "./todoLists.js";
const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

export default function SelectList({
  sqlite,
  currentCtx,
  onDbOpened,
  onCancel,
}: {
  sqlite: SQLite3;
  currentCtx: Ctx | null;
  onDbOpened: (newCtx: Ctx) => void;
  onCancel: () => void;
}) {
  // if current db is not null, shut it down before opening a new one
  const [needConnectInput, setNeedsConnectInput] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [itemStyle, setItemStyle] = useState<{ [key: string]: any }>(
    ITEM_STYLE
  );
  const [error, setError] = useState<null | string>(null);

  // TODO:
  // if currentCtx is null and we have a remote db id in the hash, we should kickoff with that
  useEffect(() => {
    const hash = window.location.hash.substring(1).trim();
    if (hash !== "" && hash.match(uuidRegex)) {
      openDB(hash);
    }
  }, []);

  function onCreateNewList() {
    if (disabled) {
      return;
    }
    openDB(null);
  }

  function disable() {
    setDisabled(true);
    setItemStyle({ ...ITEM_STYLE, opacity: 0.5, cursor: "default" });
  }

  function enable() {
    setDisabled(false);
    setItemStyle(ITEM_STYLE);
  }

  function onConnectDesired() {
    if (disabled) {
      return;
    }
    setNeedsConnectInput(true);
  }

  function onRemoteIdProvided(remoteId: string) {
    if (!remoteId.match(uuidRegex)) {
      setError("Invalid remote id.");
      return;
    }
    openDB(remoteId);
  }

  function exHandler(e: Error) {
    setError(e.message);
    enable();
  }

  function openDB(maybeDbid: string | null) {
    disable();
    const dbid = maybeDbid || crypto.randomUUID();
    if (currentCtx != null) {
      // TODO: sync should just listen for db to stop and stop when that happens
      currentCtx.sync.stop();
      // TODO: rx should listen for db close events too!
      currentCtx.rx.dispose();
    }

    const promise =
      currentCtx != null
        ? currentCtx.db.close().then(() => openDBPostCleanup(dbid))
        : openDBPostCleanup(dbid);

    promise
      .then((ctx: Ctx) => {
        enable();
        setError(null);
        onDbOpened(ctx);
      })
      .catch(exHandler);
  }

  async function openDBPostCleanup(dbid: string) {
    return await initDB(sqlite, dbid);
  }

  function onBack() {
    if (disabled) {
      return;
    }

    if (needConnectInput) {
      setNeedsConnectInput(false);
      setError(null);
      return;
    }

    if (currentCtx == null) {
      return;
    }

    onCancel();
  }

  return (
    <div>
      <header className="header">
        <h1>New</h1>
        {needConnectInput ? (
          <input
            type="text"
            className="new-todo"
            placeholder="Enter the shared list id"
            onKeyUp={(e) => {
              const target = e.target as HTMLInputElement;
              if (e.key === "Enter" && target.value.trim() !== "") {
                onRemoteIdProvided(target.value.trim());
              }
            }}
          />
        ) : null}
        {error != null ? <div style={errorStyle}>{error}</div> : null}
      </header>
      <section className="main">
        <ul className="todo-list">
          {currentCtx != null || needConnectInput ? (
            <li>
              <div className="view">
                <label onClick={onBack} style={itemStyle}>
                  ← Back
                </label>
              </div>
            </li>
          ) : null}
          {needConnectInput ? null : (
            <>
              <li>
                <div className="view">
                  <label onClick={onCreateNewList} style={itemStyle}>
                    Start a new list
                  </label>
                </div>
              </li>
              <li>
                <div className="view">
                  <label onClick={onConnectDesired} style={itemStyle}>
                    Open a shared list
                  </label>
                </div>
              </li>
              {[...todoLists.lists.values()].map((list) => {
                return (
                  <li key={list.dbid}>
                    <div className="view">
                      <label style={itemStyle}>{list.name || list.dbid}</label>
                    </div>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </section>
    </div>
  );
}
