import type { MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import mapboxCss from "mapbox-gl/dist/mapbox-gl.css"
import normalize from "normalize.css"
import rootCss from "./root.css"

export function links() {
  return [
    { rel: "stylesheet", href: normalize },
    { rel: "stylesheet", href: mapboxCss },
    { rel: "stylesheet", href: rootCss },
  ]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix of thrones",
  viewport: "width=device-width,initial-scale=1",
})

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
