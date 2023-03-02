<div class="map-container">
  <slot/>
</div>

<style>
  div.map-container {
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    position: relative;
    flex-grow: 1;
    height: 90vh;
  }
  @media (max-width: 768px) {
    div.map-container {
      width: 100%;
      height: 500px;
    }
  }
</style>