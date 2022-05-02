import { json, type LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getKingdomSummary } from "~/models/kingdoms"

const kingdomSummaryCache = new Map<string | undefined, any>()

export const loader: LoaderFunction = async ({ params }) => {
  const { gid: selected } = params

  if (!kingdomSummaryCache.has(selected)) {
    const summary = await getKingdomSummary(Number(selected))

    if (Object.keys(summary).length === 0) {
      throw new Error(`No kingdom summary for ${selected}`)
    }
    kingdomSummaryCache.set(selected, summary)
  }

  return json({
    selected,
    summary: kingdomSummaryCache.get(selected),
  })
}

export default function Info() {
  const data = useLoaderData()

  return (
    <>
      <h1>{data.summary.name}</h1>
      <p>{data.summary.summary}</p>
    </>
  )
}
