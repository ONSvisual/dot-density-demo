<div class="main">
  <div>
    <slot/>
  </div>
</div>

<style>
  div.main {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    line-height: inherit;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
  }
  div.main > div {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    min-width: 340px;
    flex-direction: column;
    color: rgb(34 34 34/var(--tw-text-opacity));
    font-size: 1rem;
    line-height: 1.5rem;
  }
</style>