CREATE TABLE IF NOT EXISTS "todo" ("id" PRIMARY KEY NOT NULL, "text", "completed");
CREATE TABLE IF NOT EXISTS "presence" (id primary key NOT NULL, name, x, y);

SELECT crsql_as_crr('todo');
SELECT crsql_as_crr('presence');