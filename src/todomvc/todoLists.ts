type ListEntry = { local: string; remote: string; accessed: number };

const fromStorage = localStorage.getItem("todo-lists") || "[]";
let parsed: ListEntry[];
try {
  parsed = JSON.parse(fromStorage);
} catch (e) {
  parsed = [];
  localStorage.setItem("todo-lists", "[]");
}
const lists = parsed;

const todoLists = {
  get lists() {
    return lists;
  },

  add(list: ListEntry) {
    lists.push(list);
    localStorage.setItem("todo-lists", JSON.stringify(lists));
  },

  remove(list: string) {
    const index = lists.findIndex((l) => l.local === list);
    if (index !== -1) {
      lists.splice(index, 1);
      localStorage.setItem("todo-lists", JSON.stringify(lists));
    }
  },

  touch(list: string) {
    const index = lists.findIndex((l) => l.local === list);
    if (index !== -1) {
      const list = lists[index];
      list.accessed = Math.floor(Date.now() / 1000);
      localStorage.setItem("todo-lists", JSON.stringify(lists));
    }
  },

  lastAccessed(): ListEntry | undefined {
    const last = lists.reduce((acc, cur) => {
      if (cur.accessed > acc.accessed) {
        return cur;
      }
      return acc;
    }, lists[0]);
    return last;
  },
};

export default todoLists;
