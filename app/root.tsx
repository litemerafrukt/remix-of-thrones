import type { MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import "mapbox-gl/dist/mapbox-gl.css"
import normalize from "normalize.css"

export function links() {
  return [{ rel: "stylesheet", href: normalize }]
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
