import { useAtom } from "jotai"
import { useRef } from "react"
import type { MapRef, MapLayerMouseEvent } from "react-map-gl"
import Map from "react-map-gl"
import { selectAtom } from "~/store/selected"

interface Props {
  mapboxToken: string
  children?: React.ReactNode
}

export default function Westeros({ mapboxToken, children }: Props) {
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
    <Map
      ref={map}
      onClick={handleClick}
      mapboxAccessToken={mapboxToken}
      initialViewState={{
        longitude: 35,
        latitude: 20,
        zoom: 3.5,
      }}
      style={{ width: "100vw", height: "100vh" }}
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
            minzoom: 1,
            maxzoom: 9,
          },
        ],
      }}
    >
      {children}
    </Map>
  )
}
