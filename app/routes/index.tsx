import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getKingdomBoundaries } from "~/models/kingdoms"
import Westeros from "~/components/Westeros"
import Kingdoms from "~/components/Kingdoms"
import InfoPanel from "~/components/InfoPanel"

type LoaderData = {
  MAPBOX_TOKEN?: string
  boundaries: Awaited<ReturnType<typeof getKingdomBoundaries>>
}

export async function loader() {
  const boundaries = await getKingdomBoundaries()

  return json<LoaderData>({
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    boundaries,
  })
}

export default function Index() {
  const data = useLoaderData()

  return (
    <div className="app-wrap">
      <InfoPanel className="info-panel" />
      <Westeros className="map" mapboxToken={data.MAPBOX_TOKEN}>
        <Kingdoms boundaries={data.boundaries} />
      </Westeros>
    </div>
  )
}
