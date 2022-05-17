import { useNavigate } from "@remix-run/react"
import { useAtom } from "jotai"
import mapboxgl from "mapbox-gl"
import { createContext, useEffect, useRef, useState } from "react"
import type { MapRef, MapLayerMouseEvent } from "react-map-gl"
import { selectAtom } from "~/store/selected"

interface Props {
  mapboxToken: string
  className?: string
  children?: React.ReactNode
}

export const MapContext = createContext<mapboxgl.Map | null>(null)

export default function Westeros({ mapboxToken, className, children }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const map = useRef<mapboxgl.Map | null>(null)
  const mapContainer = useRef(null)
  // const [, setSelected] = useAtom(selectAtom)
  // const navigate = useNavigate()

  // const handleClick = async (event: MapLayerMouseEvent) => {
  //   const feature = map.current?.queryRenderedFeatures(event.point).at(0)
  //   if (!feature) return

  //   if (feature.layer.metadata?.type === "kingdom") {
  //     setSelected(feature.layer.metadata.gid)
  //     navigate(`/info/${feature.layer.metadata.gid}`)
  //   }
  // }

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      mapboxgl.accessToken = mapboxToken

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: [
                "https://cartocdn-gusc.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "simple-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 2,
              maxzoom: 7,
            },
          ],
        },
        maxBounds: [
          [-20, -40],
          [90, 45],
        ],
        maxZoom: 6,
        center: [21, 13],
        zoom: 3.5,
      }).on("load", () => {
        setIsLoaded(true)
      })
    }
  }, [mapboxToken])

  return (
    <div className={className}>
      <div ref={mapContainer} style={{ height: "100%" }}>
        <MapContext.Provider value={map.current}>
          {isLoaded && children}
        </MapContext.Provider>
      </div>
    </div>
  )
}
