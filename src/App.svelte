<script>
	import { onMount } from "svelte";
	import { csvParse, autoType } from "d3-dsv";
	import { Map, MapSource, MapLayer } from "@onsvisual/svelte-maps";
	import Body from "./components/Body.svelte";
	import Header from "./components/Header.svelte";
	import Main from "./components/Main.svelte";
  import Panel from "./components/Panel.svelte";
	import MapContainer from "./components/MapContainer.svelte";
	import Legend from "./components/Legend.svelte";
	import BarChart from "./components/BarChart.svelte";

	const datasets_path = "./data/content.json";
	const csv_path = (geo, tile, key) => `https://onsvisual.github.io/dot-density-data/output/data/${geo}/${tile}/${key}.csv`;
	const tiles_path = (key) => window.location.hostname === "localhost" ? `pmtiles://./tiles/${key}-z11.pmtiles` : `pmtiles://https://onsvisual.github.io/dot-density-data/output/tiles/${key}-z11.pmtiles`;
	// const available = ["accommodation_type_3a",	"hh_tenure_5a", "country_of_birth_3a", "legal_partnership_status_3a", "economic_activity_status_4a", "sex", "ethnic_group_tb_6a"];
	const colors = ['#3bb2d0', '#e55e5e', '#223b53', '#fbb03b', '#ccc'];
	const layers = [
		{
			key: "lad",
			url: "https://cdn.ons.gov.uk/maptiles/administrative/2021/authorities-ew/v2/boundaries/{z}/{x}/{y}.pbf",
			layer: "lad",
			promoteId: "areacd"
		}
	];

	let datasets;
	let _dataset;
	let dataset;
	let data;

	let selected = "K04000001";
	let hovered;

	function makeColors(categories) {
		let cols = ["match", ["get", "cat"]];
		categories.forEach((cat, i) => {
			cols.push(cat);
			cols.push(colors[i]);
		});
		cols.push("rgba(0,0,0,0)");
		console.log(cols);
		return cols;
	}

	async function preloadData(dataset) {
		let str = await (await fetch(csv_path("lad", "ew", dataset.classCode))).text();
		let data_raw = csvParse(str, autoType);
		let data_new = {};
		data_raw.forEach(d => data_new[d.areacd] = d);
		data = data_new;
	}

	async function updateDataset() {
		data = null;
		dataset = _dataset;
		preloadData(dataset);
	}

	onMount(async () => {
		let ds = await (await fetch(datasets_path)).json();
		// datasets = ds.filter(d => available.includes(d.classCode));
		datasets = [...ds].sort((a, b) => a.varName.localeCompare(b.varName));
		dataset = _dataset = datasets[0];
		preloadData(dataset);
	});
</script>

<Body>
	<Header/>
	<Main>
		<Panel>
			<div slot="area">
				{selected ? selected : ""}
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
			<Map style="https://bothness.github.io/ons-basemaps/data/style-omt.json" location={{bounds: [-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085]}} controls pmtiles>
				{#if dataset}
				{#key dataset}
				<MapSource
					id="dots"
					type="vector"
					url="{tiles_path(dataset.classCode)}">
					<MapLayer
						id="dots"
						type="circle"
						sourceLayer="{dataset.classCode}"
						paint={{
							"circle-color": makeColors(dataset.categories.map(c => c.code)),
							"circle-radius": {
							"stops": [
									[8, 1],
									[13, 1.5],
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
					promoteId={l.promoteId}>
					<MapLayer
						id="{l.key}-fill"
						type="fill"
						hover bind:hovered
						select bind:selected
						paint={{"fill-color": "rgba(0,0,0,0)"}}/>
					<MapLayer
						id="{l.key}-line"
						type="line"
						paint={{
							'line-color': ['case',
								['==', ['feature-state', 'hovered'], true], 'orange',
								['==', ['feature-state', 'selected'], true], 'black',
								'rgba(64,64,64,0.2)'
							],
							'line-width': ['case',
								['==', ['feature-state', 'hovered'], true], 2,
								['==', ['feature-state', 'selected'], true], 2,
								0.5
							]
						}}
						order="place_other"/>
				</MapSource>
				{/each}
			</Map>
			<Legend>
				{#if dataset && data}
				<BarChart {dataset} {data} {hovered} {selected}/>
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