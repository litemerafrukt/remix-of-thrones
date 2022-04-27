import { json } from "@remix-run/node"
import Map from "react-map-gl"
import { useLoaderData } from "@remix-run/react"

export async function loader() {
  return json({
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  })
}

export default function Index() {
  const data = useLoaderData()

  return (
    <Map
      mapboxAccessToken={data.MAPBOX_TOKEN}
      initialViewState={{
        longitude: 5,
        latitude: 20,
        zoom: 4,
      }}
      style={{ width: "100vw", height: "100vh" }}
      // mapStyle="mapbox://styles/mapbox/streets-v9"
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
            minzoom: 4,
            maxzoom: 8,
          },
        ],
      }}
    />
  )
}
