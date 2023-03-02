<script>
  export let data
  export let dataset;
  export let colors = ['#3bb2d0', '#e55e5e', '#223b53', '#fbb03b', '#ccc'];
  export let hovered = null;
  export let selected = null;
</script>

{#if data && dataset}
<div class="chart">
	{#each dataset.categories as cat, i}
	<div class="text-sml">
		{cat.name}
		<span class="bold">{hovered && data[hovered.areacd] ? data[hovered.areacd][cat.code].toFixed(1) : selected && data[selected.areacd] ? data[selected.areacd][cat.code].toFixed(1) : data["K04000001"][cat.code].toFixed(1)}%</span>
		<span class="grey">({data["K04000001"][cat.code].toFixed(1)}%)</span>
	</div>
	<div class="chart-bar-group">
		{#if hovered && data[hovered.areacd]}
		<div class="chart-bar" style:width="{data[hovered.areacd][cat.code]}%" style:background-color="{colors[i]}"/>
		{:else if selected && data[selected.areacd]}
		<div class="chart-bar" style:width="{data[selected.areacd][cat.code]}%" style:background-color="{colors[i]}"/>
		{:else}
		<div class="chart-bar" style:width="{data["K04000001"][cat.code]}%" style:background-color="{colors[i]}"/>
		{/if}
		<div class="chart-marker" style:left="{data["K04000001"][cat.code]}%" style:background-color="black"/>
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
		width: auto;
		height: 16px;
		position: relative;
	}
	.chart-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
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
</style>