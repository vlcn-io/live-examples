import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import './base.css';
import { Ctx } from "./ctx.js";
import './style.css';

function main(): Promise<Ctx> {

}

function startApp(ctx: Ctx) {
  const root = createRoot(document.getElementById("container")!);
  root.render(<App ctx={ctx} />);
}


/**
 * Need a selection to open file(s) / lists
 * Or connect to remote lists
 * 
 * Same name for remote and local dbs?
 * Meta DB with remote and local names? Share remote db name with others?
 * 
 * The other option is partial replication...
 * 
 * Just keep list of lists in local storage? Given we don't have user logins.
 */
