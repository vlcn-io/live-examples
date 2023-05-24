export default {
  namespace: "default",
  name: "main",
  active: true,
  content: /*sql*/ `
CREATE TABLE IF NOT EXISTS "todo" ("id" PRIMARY KEY, "text", "completed");
CREATE TABLE IF NOT EXISTS "presence" (id primary key, name, x, y);

SELECT crsql_as_crr('todo');

SELECT crsql_as_crr('presence');`,
};
