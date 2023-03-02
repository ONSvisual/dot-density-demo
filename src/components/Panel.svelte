<script>
  import { onMount } from "svelte";
  import Footer from "./Footer.svelte";
  import Icon from "./Icon.svelte";

  export let title = "Dot density maps";
  export let description = "An experimental mapping of Census 2021 data for England and Wales using dots to represent people or households.";

  let topics_open = true;

  onMount(() => {
    let w = document.body.clientWidth;
    topics_open = w > 768;
  });
</script>

<div class="panel">
  <div>
    <div class="header">
      <h1>
        {title}
      </h1>
      <div>
        {@html description}
      </div>
    </div>
    <div class="body">
      <section class="area">
        <h2>Area</h2>
        <div class="area-box">
          <slot name="area"/>
        </div>
      </section>
      <section class="topics">
        <h2>Topics</h2>
        <nav class="breadcrumb">
          <button on:click={() => topics_open = !topics_open}>
            <div>{topics_open ? "Select a topic" : "Click to show topics"}</div>
            <Icon type="chevron" rotation={topics_open ? 90 : -90}/>
          </button>
        </nav>
        <div class="content" style:display={topics_open ? "block" : "none"}>
          <div class="content-label">Choose a topic to view it on the map.</div>
          <slot name="topics"/>
        </div>
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
    justify-content: space-between;
    gap: .5rem;
    font-size: 1.25rem;
    line-height: 1.75rem;
    width: 100%;
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
  }
  section.topics .content-label {
    margin-bottom: .5rem;
  }
  section.area > div.area-box {
    display: block;
    width: 100%;
    margin-top: 4px;
  }
  .breadcrumb > button {
    background: none;
    border: 0;
    margin: 0;
    text-align: right;
    padding: 4px 4px 4px 0;
    flex-grow: 1;
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
  @media (max-width: 768px) {
    div.panel {
      width: 100%;
      border-bottom: 2px solid rgb(229, 231, 235);
    }
    div.panel .header {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    div.panel .header > h1 {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    div.panel .header > div {
      font-size: 0.9rem;
      line-height: 1.25rem;
    }
  }
</style>
