import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { getKingdomBoundaries, type KingdomBoundary } from "~/models/kingdoms"
import Westeros from "~/components/Westeros"
import Kingdoms from "~/components/kingdoms"

type LoaderData = {
  MAPBOX_TOKEN?: string
  boundaries: Awaited<ReturnType<typeof getKingdomBoundaries>>
}

let boundariesCache: KingdomBoundary[]

export async function loader() {
  if (!boundariesCache) {
    boundariesCache = await getKingdomBoundaries()
  }

  return json<LoaderData>({
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    boundaries: boundariesCache,
  })
}

export default function Index() {
  const data = useLoaderData()

  return (
    <div className="app-wrap">
      <div className="info-panel">
        <Outlet></Outlet>
      </div>
      <Westeros className="map" mapboxToken={data.MAPBOX_TOKEN}>
        <Kingdoms boundaries={data.boundaries} />
      </Westeros>
    </div>
  )
}
