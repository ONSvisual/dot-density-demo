<script>
	import { onMount } from "svelte";
	import { csvParse, autoType } from "d3-dsv";
	import { Map, MapSource, MapLayer } from "@onsvisual/svelte-maps";
	import { getQuads } from "./js/utils";
	import PhaseBanner from "./components/PhaseBanner.svelte";
	import Body from "./components/Body.svelte";
	import Header from "./components/Header.svelte";
	import Main from "./components/Main.svelte";
  import Panel from "./components/Panel.svelte";
	import MapContainer from "./components/MapContainer.svelte";
	import Legend from "./components/Legend.svelte";
	import BarChart from "./components/BarChart.svelte";
	import AreaInfo from "./components/AreaInfo.svelte";
	import Select from "./components/Select.svelte";

	const datasets_path = "./data/content.json";
	const quads_path = "./data/quads.json";
	const csv_path = (geo, quad, key) => `https://onsvisual.github.io/dot-density-data/output/data/${geo}/${quad}/${key}.csv`;
	const tiles_path = (key) => window.location.hostname === "localhost" ? `pmtiles://./tiles/${key}-z11.pmtiles` : `pmtiles://https://onsvisual.github.io/dot-density-data/output/tiles/${key}-z11.pmtiles`;
	// const available = ["accommodation_type_3a",	"hh_tenure_5a", "country_of_birth_3a", "legal_partnership_status_3a", "economic_activity_status_4a", "sex", "ethnic_group_tb_6a"];
	const colors = ['#3bb2d0', '#e55e5e', '#223b53', '#fbb03b', '#ccc'];
	// const colors = ['#206095', '#F66068', '#871A5B', '#A8BD3A', '#CCCCCC'];
	const layers = [
		{
			key: "lad",
			url: "https://cdn.ons.gov.uk/maptiles/administrative/2021/authorities-ew/v2/boundaries/{z}/{x}/{y}.pbf",
			layer: "lad",
			promoteId: "areacd",
			nameField: "areanm"
		},
		{
			key: "msoa",
			url: "https://cdn.ons.gov.uk/maptiles/administrative/2021/msoa/v2/boundaries/{z}/{x}/{y}.pbf",
			layer: "msoa",
			promoteId: "areacd",
			nameField: "hclnm"
		},
		{
			key: "oa",
			url: "https://cdn.ons.gov.uk/maptiles/administrative/2021/oa/v2/boundaries/{z}/{x}/{y}.pbf",
			layer: "oa",
			promoteId: "areacd",
			nameField: "areacd"
		}
	];
	const bounds_ew = [-5.816, 49.864, 1.863, 55.872];

	let geo = "lad";
	let centroids; // The centre points of OA data quads (to calculate feature density)
	let quads; // OA and MSOA data quads (invisible layer on map)
	let datasets; // Array of all available datasets, with metadata
	let dataset; // The selected dataset (from above array)
	let _dataset; // For binding dataset selection before updating "dataset" var
	let data; // Loaded data for current dataset
	let data_quads; // Data quads that have been loaded for current dataset

	let selected;
	let selected_geo;
	let hovered;

	let map = null;
	let zoom;

	function makeColors(categories) {
		let cols = ["match", ["get", "cat"]];
		categories.forEach((cat, i) => {
			cols.push(cat);
			cols.push(colors[i]);
		});
		cols.push("rgba(0,0,0,0)");
		return cols;
	}

	async function preloadData(dataset) {
		let qc = await getQuads(quads_path);
		centroids = qc.centroids;
		quads = qc.quads;
		let str = await (await fetch(csv_path("lad", "ew", dataset.classCode))).text();
		let data_raw = csvParse(str, autoType);
		let data_new = {};
		data_raw.forEach(d => data_new[d.areacd] = d);
		data_quads = new Set(["lad_ew"]);
		data = data_new;
		getNewData();
	}

	async function getQuadData(geo, quad, key) {
		console.log(`Getting quad`, geo, quad, key);
		data_quads.add(`${geo}_${quad}`);
		let str = await (await fetch(csv_path(geo, quad, key))).text();
		let data_raw = csvParse(str, autoType);
		data_raw.forEach(d => data[d.areacd] = d);
	}

	function getNewData() {
		const features = map.getLayer(`quads-${geo}`) ? map.queryRenderedFeatures({ layers: [`quads-${geo}`] }) : [];
		features.forEach(f => {
			let quad = f.properties.code;
			if (!data_quads.has(`${geo}_${quad}`)) getQuadData(geo, quad, dataset.classCode);
		});
	}

	async function updateDataset() {
		data = null;
		dataset = _dataset;
		preloadData(dataset);
	}

	function getGeoType() {
		const features = map.getLayer("centroids") ? map.queryRenderedFeatures({ layers: ["centroids"] }) : [];
		if (Array.isArray(features)) {
			const count = features.length;
			const canvas = map.getCanvas();
			const pixelArea = canvas.clientWidth * canvas.clientHeight;
			return (count * 1e6) / pixelArea > 40 ? "lad" : (count * 1e6) / pixelArea > 3 ? "msoa" : "oa";
		} else {
			return "lad";
		}
	}

	function initMap() {
		map.on("moveend", () => {
			geo = getGeoType();
			getNewData();
		});
	}

	function mapSelect(e, layer) {
		let areacd = e.detail.id;
		let areanm = e.detail.feature.properties[layer.nameField];
		selected = {areacd, areanm};
	}

	function mapHover(e, layer) {
		if (e.detail.feature) {
			let areacd = e.detail.id;
			let areanm = e.detail.feature.properties[layer.nameField];
			hovered = {areacd, areanm};
		} else {
			hovered  = null;
		}
	}

	function doSelect(e) {
		selected = e.detail;
		selected_geo = e.detail.geometry ? e.detail.geometry : null;
		if (e.detail.bbox) map.fitBounds(e.detail.bbox, {padding: 40});
	}

	function doClear() {
		selected = null;
		selected_geo = null;
		map.fitBounds(bounds_ew);
	}

	onMount(async () => {
		let ds = await (await fetch(datasets_path)).json();
		datasets = [...ds].sort((a, b) => a.varName.localeCompare(b.varName));
		dataset = _dataset = datasets[0];
		preloadData(dataset);
	});

	$: console.log("zoom", zoom);
</script>

<Body>
	<PhaseBanner/>
	<Header/>
	<Main>
		<Panel>
			<div slot="area">
				<Select value={selected} on:select={doSelect} on:clear={doClear}/>
			</div>
			<div slot="topics" class="topic-list">
				{#if dataset}
				{#each datasets as d}
				<label class="topic-item" class:active={d.varCode === dataset.varCode}>
					<input type="radio" name="selection" bind:group={_dataset} value={d} on:change={updateDataset}>
					{d.varName}
				</label>
				{/each}
				{/if}
			</div>
		</Panel>
		<MapContainer>
			<Map
				bind:map bind:zoom
				style="https://bothness.github.io/ons-basemaps/data/style-omt.json"
				location={{bounds: bounds_ew}}
				on:load={initMap}
				controls pmtiles>
				{#each Object.keys(quads) as key}
				<MapSource
					id="quads-{key}"
					type="geojson"
					data={quads[key]}>
					<MapLayer
						id="quads-{key}"
						type="fill"
						paint={{"fill-color": "rgba(0,0,0,0)"}}/>
				</MapSource>
				{/each}
				{#if centroids}
				<MapSource
					id="centroids"
					type="geojson"
					data={centroids}>
					<MapLayer
						id="centroids"
						type="circle"
						paint={{
							"circle-radius": 1,
							"circle-color": "rgba(0,0,0,0)"
							}}/>
				</MapSource>
				{/if}
				{#if dataset}
				{#key dataset}
				<MapSource
					id="dots"
					type="vector"
					url="{tiles_path(dataset.classCode)}"
					maxzoom={11}>
					<MapLayer
						id="dots"
						type="circle"
						sourceLayer="{dataset.classCode}"
						paint={{
							"circle-color": makeColors(dataset.categories.map(c => c.code)),
							"circle-radius": {
							"stops": [
									[8, 0.7],
									[12, 1.2],
									[15, 3]
								]
							}
						}}
						order="place_other"/>
				</MapSource>
				{/key}
				{/if}
				{#each layers as l}
				<MapSource
					id={l.key}
					type="vector"
					url={l.url}
					layer={l.layer}
					promoteId={l.promoteId}
					maxzoom={12}>
					<MapLayer
						id="{l.key}-fill"
						type="fill"
						hover on:hover={(e) => mapHover(e, l)}
						select on:select={(e) => mapSelect(e, l)}
						paint={{"fill-color": "rgba(0,0,0,0)"}}
						visible={l.key === geo}/>
					<MapLayer
						id="{l.key}-line"
						type="line"
						paint={{
							'line-color': ['case',
								['==', ['feature-state', 'hovered'], true], 'black',
								'rgba(64,64,64,0.2)'
							],
							'line-width': ['case',
								['==', ['feature-state', 'hovered'], true], 2,
								0.5
							]
						}}
						visible={l.key === geo}
						order="place_suburb"/>
				</MapSource>
				{/each}
				<MapSource
					id="selected"
					type="geojson"
					data={selected_geo ? selected_geo : {type: "FeatureCollection", features: []}}>
					<MapLayer
						id="selected"
						type="line"
						paint={{
							'line-color': 'black',
							'line-width': 2
						}}
						order="place_suburb"/>
				</MapSource>
			</Map>
			<Legend>
				{#if dataset && data}
				<AreaInfo {selected} {hovered} {zoom} {dataset}/>
				<BarChart {dataset} {data} {hovered} {colors} selected={selected}/>
				{/if}
			</Legend>
		</MapContainer>
	</Main>
</Body>

<style>
	div.topic-list {
		-webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    margin: 0;
    padding: 0;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
	}
	label.topic-item {
		-webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    color: inherit;
    text-decoration: inherit;
    display: flex;
		flex-direction: row;
    cursor: pointer;
    align-items: center;
    gap: .5rem;
    border-top: 1px solid rgb(203 213 225);
    padding: .5rem;
	}
	label.active {
		background-color: rgb(245 245 246);
	}
	label.topic-item > input {
		margin: 0;
		border: 0;
		height: 1.2em;
		width: 1.2em;
	}
</style>