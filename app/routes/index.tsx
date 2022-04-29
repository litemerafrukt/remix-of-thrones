import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getKingdomBoundaries } from "~/models/kingdoms"
import Westeros from "~/components/Westeros"
import Kingdoms from "~/components/Kingdoms"

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

function InfoPanel({ ...rest }) {
  return (
    <div {...rest}>
      <h1>Info panel</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
        pellentesque, nisi eu vestibulum consectetur, eros nisi volutpat lectus,
        eget condimentum nisl nisl sed nunc. Donec eget consectetur eros. Donec
        eget consectetur eros.
      </p>
    </div>
  )
}
