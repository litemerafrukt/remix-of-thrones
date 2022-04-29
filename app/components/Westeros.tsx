import { useAtom } from "jotai"
import { useRef } from "react"
import type { MapRef, MapLayerMouseEvent } from "react-map-gl"
import Map from "react-map-gl"
import { selectAtom } from "~/store/selected"

interface Props {
  mapboxToken: string
  className?: string
  children?: React.ReactNode
}

export default function Westeros({ mapboxToken, className, children }: Props) {
  const map = useRef<MapRef>(null)
  const [, setSelected] = useAtom(selectAtom)

  const handleClick = (event: MapLayerMouseEvent) => {
    const feature = map.current?.queryRenderedFeatures(event.point).at(0)
    if (!feature) return

    if (feature.layer.metadata?.type === "kingdom") {
      setSelected(feature.layer.metadata.gid)
    }
  }

  return (
    <div className={className}>
      <Map
        ref={map}
        onClick={handleClick}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: 21,
          latitude: 13,
          zoom: 3.5,
        }}
        maxBounds={[
          [-20, -40],
          [90, 45],
        ]}
        maxZoom={6}
        mapStyle={{
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
        }}
      >
        {children}
      </Map>
    </div>
  )
}
