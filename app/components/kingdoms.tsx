import type { KingdomBoundary } from "~/models/kingdoms"
import { Layer, Source } from "react-map-gl"
import { useAtom } from "jotai"
import { selectedAtom } from "~/store/selected"

const wrapKingdomAsGeoJson = (
  geometry: KingdomBoundary
): GeoJSON.Feature & { properties: { name: string; gid: number } } => ({
  type: "Feature",
  geometry,
  properties: geometry.properties,
})

type Props = { boundaries: KingdomBoundary[] }

export default function Kingdoms({ boundaries }: Props) {
  const [selectedKingdom] = useAtom(selectedAtom)

  return boundaries.map((boundary, i) => {
    const geoJSON = wrapKingdomAsGeoJson(boundary)

    return (
      <Kingdom
        key={geoJSON.properties.gid}
        geoJSON={geoJSON}
        isSelected={geoJSON.properties.gid === selectedKingdom}
      />
    )
  })
}

type KingdomProps = {
  geoJSON: GeoJSON.Feature & { properties: { gid: number } }
  isSelected: boolean
}
function Kingdom({ geoJSON, isSelected }: KingdomProps) {
  const gid = geoJSON.properties.gid
  const id = `kingdom-boundary-${gid}`
  const fillColor = isSelected ? "#0a0" : "#222"

  return (
    <Source id={id} type="geojson" data={geoJSON}>
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
    </Source>
  )
}
