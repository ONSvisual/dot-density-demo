<script context="module">
  import { csvParse, autoType } from "d3-dsv";
  import Pbf from "pbf";
  import vt from "@mapbox/vector-tile";
  import tb from "@mapbox/tilebelt";
  import inPolygon from "@turf/boolean-point-in-polygon";

	// Config for places data
  const baseurl = "https://cdn.ons.gov.uk/maptiles/cm-geos/v2";
  const geotypes = [
    {keys: ["E00", "W00"], label: "Output area"},
    {keys: ["E02", "W02"], label: "MSOA"},
    {keys: ["E06", "W06", "E07", "E08", "E09"], label: "Local authority"}
  ];
  export const geotypes_lookup = (() => {
    let lookup = {};
    geotypes.forEach(g => g.keys.forEach(k => lookup[k] = g.label));
    return lookup;
  })();

	async function getData(url) {
    let res = await fetch(url);
    return csvParse(await res.text(), autoType);
	}

	export async function getPlaces() {
		let data = await getData(`./data/places.csv`);
    let lookup = {};
    data.forEach(d => lookup[d.areacd] = d);
		data.forEach(d => {
      let geotype = geotypes_lookup[d.areacd.slice(0,3)];
      d.group = d.parent ? `${geotype} in ${lookup[d.parent].areanm}` : geotype;
    });
		data.sort((a, b) => a.areanm.localeCompare(b.areanm));
		return data;
	}

	// Get boundary, bbox and output area lookup
	export async function getPlace(code) {
    let geo;
    try {
      let geo_raw = await fetch(`${baseurl}/${code}.geojson`);
      geo = await geo_raw.json();
    }
    catch(err) {
      return null;
    }

    let group = geo.meta.geotype === "OA" ? "Output area" :
      geo.meta.geotype === "MSOA" ? "MSOA" :
      geo.meta.geotype === "LAD" ? "Local authority" :
      "";
    let place = {
      type: 'place',
      areanm: geo.meta.name,
      areacd: geo.meta.code,
      group,
      geometry: geo.geo_json.features[2],
      bbox: geo.geo_json.features[1].geometry.coordinates
    };

    return place;
	}

  export async function getOAfromLngLat(lng, lat) {
    const tile = tb.pointToTile(lng, lat, 12);
    const url = `https://cdn.ons.gov.uk/maptiles/administrative/2021/oa/v2/boundaries/${tile[2]}/${tile[0]}/${tile[1]}.pbf`;
    try {
      const geojson = await getTileAsGeoJSON(url, tile);
      const pt = { type: "Point", coordinates: [lng, lat] };
      for (const f of geojson.features) {
        if (inPolygon(pt, f.geometry)) return f.properties.areacd;
      }
      return null;
    } catch {
      return null;
    }
  }

  async function getTileAsGeoJSON(url, tile) {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const pbf = new Pbf(buf);
    const geojson = { type: "FeatureCollection", features: [] };
    const t = new vt.VectorTile(pbf);
    for (const key in t.layers) {
      for (let i = 0; i < t.layers[key].length; i++) {
        geojson.features.push(t.layers[key].feature(i).toGeoJSON(...tile));
      }
    }
    return geojson;
  }
</script>
<script>
  import { onMount, createEventDispatcher } from "svelte";
	import Select from "./SelectInner.svelte";

  const dispatch = createEventDispatcher();

  export let autoClear = false;
  export let placeholder = "Find an area or postcode";
  export let listMaxHeight = 250;
  export let value;
  let valuePrev;
	
	// Data and state for select box
	let items;
	let filterText;
	
  // Function for select box
	async function getOptions(filterText) {
		if (filterText.length > 2 && /\d/.test(filterText)) {
			let res = await fetch(`https://api.postcodes.io/postcodes/${filterText}/autocomplete`);
			let json = await res.json();
			return json.result ? json.result.map(d => ({
        areacd: d,
        areanm: d,
        group: '',
        postcode: true
      })) : [];
		} else if (filterText.length > 2) {
			return items.filter(p => p.areanm.toLowerCase().slice(0, filterText.length) == filterText.toLowerCase());
		}
		return [];
	}
	async function doSelect(e) {
		if (e.detail?.postcode) {
      let res = await fetch(`https://api.postcodes.io/postcodes/${e.detail.areacd}`);
			let json = await res.json();
			if (json.result) {
        let oa = await getOAfromLngLat(json.result.longitude, json.result.latitude);
        if (oa) {
          let place = await getPlace(oa);
          value = valuePrev = place;
          dispatch('select', place);
        }
      }
		} else if (e.detail && e.detail.areacd !== valuePrev?.areacd) {
      let place = await getPlace(e.detail.areacd);
      value = valuePrev = place;
      dispatch('select', place);
		}
	}
  
	onMount(async () => {
    items = await getPlaces();
  });
</script>

{#if items}
<Select id="select" mode="search" idKey="areacd" labelKey="areanm" groupKey="group" {value} {items} {placeholder} {listMaxHeight} bind:filterText loadOptions={getOptions} on:select={doSelect} on:clear {autoClear}/>
{/if}