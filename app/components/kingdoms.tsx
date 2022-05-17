import type { KingdomBoundary } from "~/models/kingdoms"
import { useAtom } from "jotai"
import { selectedAtom } from "~/store/selected"
import { useContext, useEffect } from "react"
import { MapContext } from "./Westeros"
import { useNavigate } from "@remix-run/react"
import { selectAtom } from "~/store/selected"
import { type MapLayerMouseEvent } from "mapbox-gl"

const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0))

const wrapKingdomAsGeoJson = (
  geometry: KingdomBoundary
): GeoJSON.Feature & { properties: { name: string; gid: number } } => ({
  type: "Feature",
  geometry,
  properties: geometry.properties,
})

type Props = { boundaries: KingdomBoundary[] }

export default function Kingdoms({ boundaries }: Props) {
  const map = useContext(MapContext)
  const [selectedKingdom] = useAtom(selectedAtom)

  useEffect(() => {
    if (!map) return

    boundaries.forEach((boundary) => {
      const geoJSON = wrapKingdomAsGeoJson(boundary)
      const gid = geoJSON.properties.gid
      const id = `kingdom-boundary-${gid}`

      map.addSource(id, {
        type: "geojson",
        data: geoJSON,
      })
    })
  }, [map, boundaries])

  return (
    <>
      {boundaries.map((boundary) => {
        const gid = boundary.properties.gid
        return (
          <Kingdom
            key={gid}
            gid={gid}
            sourceId={`kingdom-boundary-${gid}`}
            isSelected={gid === selectedKingdom}
          />
        )
      })}
    </>
  )
}

type KingdomProps = {
  gid: number
  sourceId: `kingdom-boundary-${number}`
  isSelected: boolean
}
function Kingdom({ gid, sourceId, isSelected }: KingdomProps) {
  const map = useContext(MapContext)
  const [, setSelected] = useAtom(selectAtom)
  const navigate = useNavigate()

  const handleClick = async (event: MapLayerMouseEvent) => {
    const feature = map?.queryRenderedFeatures(event.point).at(0)
    if (!feature) return

    if (feature.layer.metadata?.type === "kingdom") {
      setSelected(feature.layer.metadata.gid)
      navigate(`/info/${feature.layer.metadata.gid}`)
    }
  }

  useEffect(() => {
    if (!map) return

    const fillColor = isSelected ? "#0a0" : "#222"

    const addLayer = () => {
      map
        .addLayer({
          id: `kingdom-${gid}`,
          metadata: { type: "kingdom", gid },
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": fillColor,
            "fill-opacity": 0.15,
          },
        })
        .addLayer({
          id: `kingdom-outline-${gid}`,
          metadata: { type: "kingdom", gid },
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "#222",
            "line-opacity": 0.65,
          },
        })
        .on("click", `kingdom-${gid}`, handleClick)
    }

    ;(async () => {
      await nextTick()
      addLayer()
    })()

    return () => {
      try {
        map.removeLayer(`kingdom-${gid}`)
        map.removeLayer(`kingdom-outline-${gid}`)
      } catch {
        // ignore
      }
    }
  }, [map, gid, sourceId, isSelected])

  return null
}
