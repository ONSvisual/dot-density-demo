<script>
  export let data
  export let dataset;
  export let colors = ['#3bb2d0', '#e55e5e', '#223b53', '#fbb03b', '#ccc'];
  export let hovered = null;
  export let selected = null;
</script>

{#if data && dataset}
<table class="chart">
  <tbody>
    {#each dataset.categories as cat, i}
    <tr class="text-sml">
      <td colspan=3>{cat.name}</td>
    </tr>
    <tr>
      <td class="chart-bar-group">
        {#if hovered && data[hovered]}
        <div class="chart-bar" style:width="{data[hovered][cat.code]}%" style:background-color="{colors[i]}"/>
        {:else if selected && data[selected]}
        <div class="chart-bar" style:width="{data[selected][cat.code]}%" style:background-color="{colors[i]}"/>
        {:else}
        <div class="chart-bar" style:width="{data["K04000001"][cat.code]}%" style:background-color="{colors[i]}"/>
        {/if}
        <div class="chart-marker" style:left="{data["K04000001"][cat.code]}%" style:background-color="black"/>
      </td>
      <td class="chart-num bold">{hovered && data[hovered] ? data[hovered][cat.code].toFixed(1) : selected && data[selected] ? data[selected][cat.code].toFixed(1) : data["K04000001"][cat.code].toFixed(1)}%</td>
      <td class="chart-num text-sml">({data["K04000001"][cat.code].toFixed(1)}%)</td>
    </tr>
    {/each}
  </tbody>
</table>
{/if}

<style>
  .chart {
		width: 100%;
		border-collapse: collapse;
    line-height: 1.2;
	}
	.chart-bar-group {
		width: auto;
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
	.chart-num {
		width: 60px;
	}
	.bold {
		font-weight: bold;
	}
	.text-sml {
		font-size: 0.9rem;
	}
</style>