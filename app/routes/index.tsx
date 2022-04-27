import Map from "react-map-gl"

export default function Index() {
  return <div>{process?.env?.MAPBOX_TOKEN ?? window.ENV.MAPBOX_TOKEN}</div>
  // return (
  //   <Map
  //     mapboxAccessToken={process?.env?.MAPBOX_TOKEN ?? window.ENV.MAPBOX_TOKEN}
  //     initialViewState={{
  //       longitude: -122.4,
  //       latitude: 37.8,
  //       zoom: 14,
  //     }}
  //     style={{ width: 600, height: 400 }}
  //     mapStyle="mapbox://styles/mapbox/streets-v9"
  //   />
  // )
}
