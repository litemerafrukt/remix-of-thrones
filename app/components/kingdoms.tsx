import type { KingdomBoundaries } from "~/models/kingdoms"
import { Layer, Source } from "react-map-gl"

type Props = { boundaries: KingdomBoundaries[] }

export default function Kingdoms({ boundaries }: Props) {
  return (
    <Source
      id="kingdom-boundaries"
      type="geojson"
      data={{
        type: "FeatureCollection",
        features: boundaries.map((boundary) => ({
          type: "Feature",
          geometry: boundary,
          properties: boundary.properties,
        })),
      }}
    >
      <Layer
        id="kingdoms"
        type="fill"
        source="kingdom-boundaries"
        paint={{
          "fill-color": "#222",
          "fill-opacity": 0.05,
        }}
      />
      <Layer
        id="kingdoms-outline"
        type="line"
        source="kingdom-boundaries"
        paint={{
          "line-color": "#000",
        }}
      />
    </Source>
  )
}
