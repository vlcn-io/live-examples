type ListEntry = {
  dbid: string;
  name: string;
  accessed: number;
};

const fromStorage = localStorage.getItem("todo-lists") || "[]";
let parsed: ListEntry[];
try {
  parsed = JSON.parse(fromStorage);
} catch (e) {
  parsed = [];
  localStorage.setItem("todo-lists", "[]");
}
parsed.sort((a, b) => b.accessed - a.accessed);
const lists = new Map<string, ListEntry>(parsed.map((l) => [l.dbid, l]));

function persistLists() {
  localStorage.setItem("todo-lists", JSON.stringify([...lists.values()]));
}

const todoLists = {
  get lists() {
    return lists;
  },

  add(list: ListEntry) {
    lists.set(list.dbid, list);
    persistLists();
  },

  remove(dbid: string) {
    const index = lists.delete(dbid);
    persistLists();
  },

  touch(dbid: string) {
    const list = lists.get(dbid);
    if (list) {
      list.accessed = Math.floor(Date.now() / 1000);
      persistLists();
    }
  },

  rename(dbid: string, name: string) {
    const list = lists.get(dbid);
    if (list) {
      list.name = name;
      persistLists();
    }
  },

  lastAccessed(): ListEntry | undefined {
    return lists.values().next().value;
  },
};

export default todoLists;
