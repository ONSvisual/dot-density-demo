<script>
  export let data
  export let dataset;
  export let colors = ['#3bb2d0', '#e55e5e', '#223b53', '#fbb03b', '#ccc'];
  export let hovered = null;
  export let selected = null;
	export let filter = [];

	function updateFilter(cat) {
		if (filter.includes(cat.code)) {
			filter = filter.filter(code => code !== cat.code);
		} else {
			filter = [...filter, cat.code];
		}
	}
</script>

{#if data && dataset}
<div class="chart">
	{#each dataset.categories as cat, i}
	<div class="text-sml" class:inactive={filter.includes(cat.code)}>
		{cat.name}
		<span class="bold">{hovered && data[hovered.areacd] ? data[hovered.areacd][cat.code].toFixed(1) : selected && data[selected.areacd] ? data[selected.areacd][cat.code].toFixed(1) : data["K04000001"][cat.code].toFixed(1)}%</span>
		<span class="grey">({data["K04000001"][cat.code].toFixed(1)}%)</span>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="chart-bar-group" class:inactive={filter.includes(cat.code)} on:click={() => updateFilter(cat)}>
		{#if hovered && data[hovered.areacd]}
		<div class="chart-bar" style:width="{data[hovered.areacd][cat.code]}%" style:background-color="{colors[i]}"/>
		{:else if selected && data[selected.areacd]}
		<div class="chart-bar" style:width="{data[selected.areacd][cat.code]}%" style:background-color="{colors[i]}"/>
		{:else}
		<div class="chart-bar" style:width="{data["K04000001"][cat.code]}%" style:background-color="{colors[i]}"/>
		{/if}
		<div class="chart-marker" style:left="{data["K04000001"][cat.code]}%" style:background-color="black"/>
		<div class="chart-hover-label">{filter.includes(cat.code) ? "Show category" : "Hide category"}</div>
	</div>
	{/each}
</div>
{/if}

<style>
  .chart {
		width: 100%;
		border-collapse: collapse;
    line-height: 1.2;
	}
	.chart-bar-group {
		width: 100%;
		height: 16px;
		position: relative;
	}
	.chart-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
	}
	.chart-hover-label {
		position: absolute;
		display: none;
	}
	.chart-bar-group:hover > .chart-bar, .chart-bar-group:hover > .chart-marker {
		opacity: 0.5;
	}
	.chart-bar-group:hover > .chart-hover-label {
		display: block;
		font-size: 0.9em;
	}
	.chart-marker {
		position: absolute;
		top: 0;
		height: 100%;
		width: 3px;
		transform: translateX(-50%);
	}
	.bold {
		font-weight: bold;
	}
	.text-sml {
		font-size: 0.9rem;
		padding-top: 2px;
	}
	span.grey {
		color: #777;
	}
	.text-sml.inactive, .chart-bar-group.inactive > .chart-bar, .chart-bar-group.inactive > .chart-marker {
		opacity: 0.5;
	}
</style>