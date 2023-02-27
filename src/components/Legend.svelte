<div class="legend">
  <div>
    <slot/>
  </div>
</div>

<style>
  div.legend {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    position: absolute;
    display: flex;
    width: 100%;
    justify-content: center;
    bottom: 2rem;
  }
  div.legend > div {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    font-size: 1rem;
    line-height: 1.5rem;
    box-sizing: border-box;
    border-style: solid;
    width: 100%;
    max-width: 50rem;
    border-color: rgb(226 226 227);
    background-color: rgb(255 255 255);
    margin-left: 1rem;
    margin-right: 1rem;
    border-width: 1px;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: .75rem;
    padding-bottom: .75rem;
  }
</style>