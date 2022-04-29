import { addRowMetadataAsProperties } from "./db/addRowMetadataAsProperties"
import { getKingdomBoundaries as qKingdomBoundaries } from "./db/queries"

export type KingdomBoundary = {
  type: "MultiPolygon"
  coordinates: GeoJSON.Position[][][]
  properties: { name: string; gid: number }
}

export const getKingdomBoundaries = async (): Promise<KingdomBoundary[]> => {
  const boundaries = await qKingdomBoundaries()
  if (boundaries.length === 0) {
    return Promise.reject(new Error("No kingdom boundaries found"))
  }

  const kingdomBoundaries = boundaries.map((row) =>
    addRowMetadataAsProperties(row, "name", "gid")
  )

  return kingdomBoundaries as KingdomBoundary[]
}
