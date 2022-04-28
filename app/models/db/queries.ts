import postgres from "postgres"
const connectionString: string = process.env.DATABASE_URL!
if (!connectionString) throw new Error("DATABASE_URL must be set")

const sql = postgres(connectionString)

/** Query the kingdom boundaries */
export const getKingdomBoundaries = async () =>
  sql`
    SELECT ST_AsGeoJSON(geog), name, gid
    FROM kingdoms;`

/** Query the locations as geojson for a given type */
export const getLocations = async (type: string) =>
  sql`
      SELECT ST_AsGeoJSON(geog), name, type, gid
      FROM locations
      WHERE UPPER(type) = UPPER(${type});`

/** Calculate the area of a given region, by id */
export const getRegionSize = async (kingdomGid: number) =>
  await sql`
      SELECT ST_AREA(geog) as size
      FROM kingdoms
      WHERE gid = ${kingdomGid}
      LIMIT(1);`

/** Count the number of castles in a region, by id */
export const countCastles = async (kingdomGid: number) =>
  await sql`
        SELECT count(*)
        FROM kingdoms, locations
        WHERE ST_intersects(kingdoms.geog, locations.geog)
        AND kingdoms.gid = ${kingdomGid}
        AND locations.type = 'Castle';`

/** Get the summary for a location or region, by id */
export const getSummary = async (table: string, gid: number) =>
  await sql`
      SELECT summary, url
      FROM ${sql(table)}
      WHERE gid = ${gid}
      LIMIT(1);`
