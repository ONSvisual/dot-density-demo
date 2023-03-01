import tilebelt from "@mapbox/tilebelt";

export async function getQuads(path) {
  let json = await(await fetch(path)).json();
  let quads = {};
  let centroids;
  for (const key in json) {
    let features = json[key].map(d => ({
      type: "Feature",
      geometry: tilebelt.tileToGeoJSON(d),
      properties: {
        code: d.join("-")
      }
    }));
    quads[key] = {
      type: "FeatureCollection",
      features
    };
    if (key == "oa") {
      centroids = {
        type: "GeometryCollection",
        geometries: features.map(d => getCentroid(d))
      };
    }
  }
  return {quads, centroids};
}

function getCentroid(feature) {
  let coords = feature.geometry.coordinates;
  let x = coords[0].map(d => d[0]);
  let y = coords[0].map(d => d[1]);
  let center = [(Math.max(...x) + Math.min(...x)) / 2, (Math.max(...y) + Math.min(...y)) / 2];
  return {type: "Point", coordinates: center};
}