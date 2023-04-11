<script>
  export let selected;
  export let hovered;
  export let zoom;
  export let dataset;

  function getCount(zoom) {
    const zooms = [
      50000, 20000, 10000,
      5000, 2000, 1000,
      500, 200, 100,
      50, 20, 10,
      5, 2, 1
    ];
    // return zooms[Math.floor(zoom)];
    return zoom < 14 ? zooms[Math.floor(zoom)] : 1;
  }
  $: count = getCount(zoom);
</script>

<div class="info">
  <div class="info-place">{hovered ? hovered.areanm : selected ? selected.areanm : "England and Wales"}</div>
  <div class="info-dataset">{dataset ? dataset.varName : ""}</div>
  <div class="info-small mt">One dot = {count ? count.toLocaleString() : ''} {count === 1 ? dataset.unit.replace("households", "household").replace("people", "person"): dataset.unit}</div>
  <div class="info-small"><div class="marker"/> (% for England and Wales)</div>
</div>

<style>
  .info {
    margin-right: 10px;
  }
  .info-place {
    font-size: 1.2em;
  }
  .info-dataset {
    font-size: 1.2em;
    font-weight: bold;
    margin-top: 3px;
  }
  .info-small {
    font-size: 0.9em;
    color: #777;
  }
  .mt {
    margin-top: 12px;
    color: #333;
  }
  .marker {
    display: inline-block;
    height: 16px;
    border-left: 3px solid black;
    margin-right: 3px;
    transform: translateY(3px);
  }
</style>