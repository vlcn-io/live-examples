import React, { useState, useCallback } from "react";
import { useDB, useQuery, useSync } from "@vlcn.io/react";
import { newId } from "./id";
import { DBAsync } from "@vlcn.io/xplat-api";
import SyncWorker from "./sync-worker.js?worker";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";
type TodoList = {
  filter: Filter;
  editing: string | null;
};

function Header({ db }: { db: DBAsync }) {
  const [newText, setNewText] = React.useState<string>("");
  return (
    <header className="header">
      <h1>todos</h1>
      <input
        type="text"
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        onKeyUp={(e) => {
          const target = e.target as HTMLInputElement;
          if (e.key === "Enter" && target.value.trim() !== "") {
            db.exec("INSERT INTO todo VALUES (?, ?, ?)", [
              // todo: id as sid given sorted and small
              newId(db.siteid.replaceAll("-", "")),
              target.value,
              0,
            ]);
            setNewText("");
          }
        }}
      />
    </header>
  );
}

const TodoView = ({
  todo,
  editing,
  startEditing,
  saveTodo,
  db,
}: {
  key?: string;
  todo: Todo;
  editing: boolean;
  startEditing: (t: Todo) => void;
  saveTodo: (todo: Todo, text: string) => void;
  db: DBAsync;
}) => {
  let body;

  const [text, setText] = useState(todo.text);
  const deleteTodo = () => {
    db.exec(`DELETE FROM todo WHERE id = ?`, [todo.id]);
  };
  const toggleTodo = () => {
    db.exec(`UPDATE todo SET completed = ? WHERE id = ?`, [
      todo.completed ? 0 : 1,
      todo.id,
    ]);
  };

  if (editing) {
    body = (
      <input
        type="text"
        className="edit"
        autoFocus
        value={text}
        onBlur={() => saveTodo(todo, text)}
        onKeyUp={(e) => e.key === "Enter" && saveTodo(todo, text)}
        onChange={(e) => setText(e.target.value)}
      />
    );
  } else {
    body = (
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.completed}
          onChange={toggleTodo}
        />
        <label
          onDoubleClick={() => {
            setText(todo.text);
            startEditing(todo);
          }}
        >
          {todo.text}
        </label>
        <button className="destroy" onClick={deleteTodo} />
      </div>
    );
  }
  return (
    <li
      className={
        (todo.completed ? "completed " : "") + (editing ? "editing" : "")
      }
    >
      {body}
    </li>
  );
};

function Footer({
  remaining,
  todos,
  clearCompleted,
  todoList,
  setFilter,
}: {
  remaining: number;
  todos: readonly Todo[];
  clearCompleted: () => void;
  todoList: TodoList;
  setFilter: (f: Filter) => void;
}) {
  let clearCompletedButton;
  if (remaining !== todos.length) {
    clearCompletedButton = (
      <button className="clear-completed" onClick={clearCompleted}>
        Clear completed
      </button>
    );
  }

  const updateFilter = (filter: Filter) => {
    setFilter(filter);
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong> {remaining} </strong>
        {remaining === 1 ? "item" : "items"} left
      </span>
      <ul className="filters">
        <li>
          <a
            className={todoList.filter === "all" ? "selected" : ""}
            onClick={() => updateFilter("all")}
          >
            {" "}
            All{" "}
          </a>
        </li>
        <li>
          <a
            className={todoList.filter === "active" ? "selected" : ""}
            onClick={() => updateFilter("active")}
          >
            Active
          </a>
        </li>
        <li>
          <a
            className={todoList.filter === "completed" ? "selected" : ""}
            onClick={() => updateFilter("completed")}
          >
            Completed
          </a>
        </li>
      </ul>
      {clearCompletedButton}
    </footer>
  );
}

const worker = new SyncWorker();
function getEndpoint() {
  let proto = "ws:";
  const hostname = window.location.hostname;
  if (window.location.protocol === "https:") {
    proto = "wss:";
  }
  let port = "";
  if (hostname == "localhost") {
    port = ":8080";
  }

  return `${proto}//${hostname}${port}/sync`;
}
const syncEndpoint = getEndpoint();
export default function TodoList({ dbid }: { dbid: string }) {
  const ctx = useDB(dbid);
  const db = ctx.db;
  useSync({
    dbname: dbid,
    endpoint: syncEndpoint,
    room: dbid,
    worker,
  });
  const [list, setList] = useState<TodoList>({
    editing: null,
    filter: "all",
  });
  const startEditing = useCallback((todo: Todo) => {
    setList((old) => ({
      ...old,
      editing: todo.id,
    }));
  }, []);
  const saveTodo = useCallback((todo: Todo, text: string) => {
    db.exec(`UPDATE todo SET text = ? WHERE id = ?`, [text, todo.id]);
    setList((old) => ({
      ...old,
      editing: null,
    }));
  }, []);

  const clearCompleted = () => {
    db.exec(`DELETE FROM todo WHERE completed = true`);
  };

  const toggleAll = () => {
    if (remaining === 0) {
      // uncomplete all
      db.exec(`UPDATE todo SET completed = false WHERE completed = true`);
    } else {
      // complete all
      db.exec(`UPDATE todo SET completed = true WHERE completed = false`);
    }
  };
  let toggleAllCheck;

  const allTodos: readonly Todo[] = useQuery<Todo>(
    ctx,
    "SELECT * FROM todo ORDER BY id DESC"
  ).data;
  const completeTodos = allTodos.filter((t) => t.completed);
  const activeTodos = allTodos.filter((t) => !t.completed);

  const remaining = activeTodos.length;
  const todos =
    list.filter === "active"
      ? activeTodos
      : list.filter === "completed"
      ? completeTodos
      : allTodos;

  if (allTodos.length) {
    toggleAllCheck = (
      <>
        <input
          id="toggle-all"
          type="checkbox"
          className="toggle-all"
          checked={remaining === 0}
          onChange={toggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
      </>
    );
  }

  return (
    <>
      <span style={{ position: "absolute", top: -20 }}>
        Share the current URL with others to collaborate on this list.
      </span>
      <Header db={db} />
      <section
        className="main"
        style={allTodos.length > 0 ? {} : { display: "none" }}
      >
        {toggleAllCheck}
        <ul className="todo-list">
          {todos.map((t) => (
            <TodoView
              db={db}
              key={t.id}
              todo={t}
              editing={list.editing === t.id}
              startEditing={startEditing}
              saveTodo={saveTodo}
            />
          ))}
        </ul>
        <Footer
          remaining={remaining}
          todos={allTodos}
          todoList={list}
          clearCompleted={clearCompleted}
          setFilter={(f: Filter) => {
            setList((l) => ({
              ...l,
              filter: f,
            }));
          }}
        />
      </section>
    </>
  );
}
