import type { MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import "mapbox-gl/dist/mapbox-gl.css"

export async function loader() {
  return json({
    ENV: {
      MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    },
  })
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix of thrones",
  viewport: "width=device-width,initial-scale=1",
})

export default function App() {
  const data = useLoaderData()
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        /> */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
