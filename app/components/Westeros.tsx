import mapboxgl from "mapbox-gl"
import { createContext, useRef, useState } from "react"
import { useEffectOnce } from "~/hooks/useEffectOnce"

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

  useEffectOnce(() => {
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

    return () => {
      map.current?.remove()
      map.current = null
    }
  })

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
