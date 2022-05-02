import type { KingdomBoundary } from "~/models/kingdoms"
import { Layer, Source } from "react-map-gl"
import { useAtom } from "jotai"
import { selectedAtom } from "~/store/selected"
import { memo } from "react"

const wrapKingdomAsGeoJson = (
  geometry: KingdomBoundary
): GeoJSON.Feature & { properties: { name: string; gid: number } } => ({
  type: "Feature",
  geometry,
  properties: geometry.properties,
})

type Props = { boundaries: KingdomBoundary[] }

export default memo(function Kingdoms({ boundaries }: Props) {
  const [selectedKingdom] = useAtom(selectedAtom)

  return (
    <>
      {boundaries.map((boundary) => {
        const geoJSON = wrapKingdomAsGeoJson(boundary)
        const gid = geoJSON.properties.gid
        const id = `kingdom-boundary-${gid}`

        return <Source key={id} id={id} type="geojson" data={geoJSON} />
      })}

      {boundaries.map((boundary) => {
        return (
          <Kingdom
            key={boundary.properties.gid}
            boundary={boundary}
            isSelected={boundary.properties.gid === selectedKingdom}
          />
        )
      })}
    </>
  )
})

const Kingdom = memo(Kingdom_)

type KingdomProps = {
  boundary: KingdomBoundary
  isSelected: boolean
}
function Kingdom_({ boundary, isSelected }: KingdomProps) {
  const gid = boundary.properties.gid
  const id = `kingdom-boundary-${gid}`
  const fillColor = isSelected ? "#0a0" : "#222"

  return (
    <>
      <Layer
        id={`kingdom-${gid}`}
        metadata={{ type: "kingdom", gid }}
        type="fill"
        source={id}
        paint={{
          "fill-color": fillColor,
          "fill-opacity": 0.15,
        }}
      />
      <Layer
        id={`kingdom-outline-${gid}`}
        type="line"
        source={id}
        paint={{
          "line-color": "#000",
        }}
      />
    </>
  )
}
