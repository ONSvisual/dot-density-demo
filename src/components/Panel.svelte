<script>
  import Footer from "./Footer.svelte";

  export let title = "Dot density maps";
  export let description = "An experimental mapping of Census 2021 data for England and Wales using dots.";
</script>

<div class="panel">
  <div>
    <div class="header">
      <h1>
        {title}
      </h1>
      <div>
        {description}
      </div>
    </div>
    <div class="body">
      <section class="area">
        <h2>Area</h2>
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <div class=""><slot name="area"/></div>
        </nav>
      </section>
      <section class="topics">
        <h2>Topics</h2>
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <div class="">All topics</div>
        </nav>
        <div class="content"><div>Select a topic to view it on the map.</div></div>
        <slot name="topics"/>
      </section>
    </div>
    <div class="grow"/>
    <Footer/>
  </div>
</div>

<style>
  div.panel {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 20;
    display: flex;
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.15s;
    right: 0;
    position: relative;
    width: 27rem;
  }
  div.panel > div {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    overflow-y: auto;
    background-color: rgb(255 255 255);
  }
  div.panel .header {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    background-color: rgb(32 96 149);
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    color: rgb(245 245 246);
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  div.panel .header > h1 {
    margin: 0;
    overflow-wrap: break-word;
    color: rgb(245 245 246);
    font-weight: 600;
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  div.panel .header > div {
    font-size: 1rem;
    line-height: 1.5rem;
    color: rgb(245 245 246);
    margin-top: .5rem;
  }
  div.panel .body {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  .grow {
    flex-grow: 1;
  }
  section.area, section.topics {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    margin-bottom: 2rem;
  }
  section.area {
    padding-bottom: 12px;
    border-bottom: 2px solid rgb(229, 231, 235);
    margin-bottom: 0;
  }
  section.area > h2, section.topics > h2 {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    line-height: 1.5rem;
    border-width: 0;font-size: inherit;
    margin: 0;
    padding-top: .75rem;
    font-weight: 700;
    color: rgb(100 116 139);
  }
  section.area > .breadcrumb, section.topics > .breadcrumb {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    border-width: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .5rem;
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
  section.area > .content, section.topics > .content {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-feature-settings: normal;
    color: rgb(34 34 34);
    font-size: 1rem;
    line-height: 1.5rem;
    border-width: 0;
    margin-top: 1rem;
    margin-bottom: .5rem;
  }
</style>
