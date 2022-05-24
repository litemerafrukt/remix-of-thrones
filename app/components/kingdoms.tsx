import type { KingdomBoundary } from "~/models/kingdoms"
import { useAtom } from "jotai"
import { selectedAtom } from "~/store/selected"
import { useCallback, useContext } from "react"
import { MapContext } from "./Westeros"
import { useNavigate } from "@remix-run/react"
import { selectAtom } from "~/store/selected"
import { type MapLayerMouseEvent } from "mapbox-gl"
import { useEffectOnce } from "~/hooks/useEffectOnce"

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

  useEffectOnce(() => {
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

    return () => {
      boundaries.forEach((boundary) => {
        const gid = boundary.properties.gid
        const sourceId = `kingdom-boundary-${gid}`
        try {
          map.removeSource(sourceId)
        } catch {
          // ignore
        }
      })
    }
  })

  return (
    <>
      {boundaries.map((boundary) => {
        const gid = boundary.properties.gid
        return (
          <Kingdom
            key={`${gid} - ${gid === selectedKingdom}`}
            gid={gid}
            sourceId={`kingdom-boundary-${gid}`}
            isSelected={gid === selectedKingdom}
          />
        )
      })}
      {boundaries.map((boundary) => {
        const gid = boundary.properties.gid
        return (
          <KingdomOutlines
            key={gid + "-outlines"}
            gid={gid}
            sourceId={`kingdom-boundary-${gid}`}
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

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = map?.queryRenderedFeatures(event.point).at(0)
      if (!feature) return

      if (feature.layer.metadata?.type === "kingdom") {
        setSelected(feature.layer.metadata.gid)
        navigate(`/info/${feature.layer.metadata.gid}`)
      }
    },
    [map, navigate, setSelected]
  )

  useEffectOnce(() => {
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
        .on("click", `kingdom-${gid}`, handleClick)
    }

    ;(async () => {
      await nextTick()
      addLayer()
    })()

    return () => {
      try {
        map.off("click", `kingdom-${gid}`, handleClick)
        map.removeLayer(`kingdom-${gid}`)
      } catch {
        // ignore
      }
    }
  })

  return null
}

type KingdomOutlineProps = {
  gid: number
  sourceId: `kingdom-boundary-${number}`
}
function KingdomOutlines({ gid, sourceId }: KingdomOutlineProps) {
  const map = useContext(MapContext)

  useEffectOnce(() => {
    if (!map) return

    const addLayer = () => {
      map.addLayer({
        id: `kingdom-outline-${gid}`,
        metadata: { type: "kingdom", gid },
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#222",
          "line-opacity": 0.65,
        },
      })
    }

    ;(async () => {
      await nextTick()
      addLayer()
    })()

    return () => {
      try {
        map.removeLayer(`kingdom-outline-${gid}`)
      } catch {
        // ignore
      }
    }
  })

  return null
}
