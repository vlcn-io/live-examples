const fromStorage = localStorage.getItem('todo-lists') || '[]';
let parsed: {local: string, remote: string}[];
try {
  parsed = JSON.parse(fromStorage);
} catch (e) {
  parsed = [];
  localStorage.setItem('todo-lists', '[]');
}
const lists = parsed;

const api = {
  get lists() {
    return lists;
  },

  addList(list: {local: string, remote: string}) {
    lists.push(list);
    localStorage.setItem('todo-lists', JSON.stringify(lists));
  }
};

export default api;
