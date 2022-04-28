import type { Row } from 'postgres'

export const addRowMetadataAsProperties = (row: Row, ...keys: string[]) => {
  const geojson = JSON.parse(row.st_asgeojson)
  geojson.properties = keys.reduce((props, key) => {
    props[key] = row[key]
    return props
  }, {} as Record<string, string>)

  return geojson
}
