import { addRowMetadataAsProperties } from "./db/addRowMetadataAsProperties"
import * as Q from "./db/queries"

export type KingdomBoundary = {
  type: "MultiPolygon"
  coordinates: GeoJSON.Position[][][]
  properties: { name: string; gid: number }
}

export const getKingdomBoundaries = async (): Promise<KingdomBoundary[]> => {
  const boundaries = await Q.getKingdomBoundaries()
  if (boundaries.length === 0) {
    return Promise.reject(new Error("No kingdom boundaries found"))
  }

  const kingdomBoundaries = boundaries.map((row) =>
    addRowMetadataAsProperties(row, "name", "gid")
  )

  return kingdomBoundaries as KingdomBoundary[]
}

export const getKingdomSummary = async (gid: number): Promise<any> => {
  const [summary] = await Q.getSummary("kingdoms", gid)

  return summary
}
