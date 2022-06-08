import postgres from "postgres"
const connectionString: string = process.env.DATABASE_URL!
if (!connectionString) throw new Error("DATABASE_URL must be set")

declare global {
  var __db__: postgres.Sql<{}>
}

let sql: postgres.Sql<{}>

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  sql = postgres(connectionString)
} else {
  if (!global.__db__) {
    global.__db__ = postgres(connectionString)
  }
  sql = global.__db__
}

export { sql }
