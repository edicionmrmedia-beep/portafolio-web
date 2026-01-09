<script>
  import WorkCard from "$lib/components/WorkCard.svelte";

  let { data } = $props();

  const director = $derived(data.director);
  const selectedWork = $derived(data.selectedWork);
  const reelParams =
    "background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0";
  const backgroundReel = $derived.by(() => {
    const separator = director.reelUrl.includes("?") ? "&" : "?";
    return `${director.reelUrl}${separator}${reelParams}`;
  });
</script>

<svelte:head>
  <title>{director.name} | {data.content.site.name}</title>
</svelte:head>

<section class="section profile-stage">
  <div class="profile-bg">
    <iframe
      src={backgroundReel}
      title={`${director.name} background reel`}
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
  <div class="profile-overlay"></div>
  <div class="container profile profile-content">
    <div class="profile-intro profile-block-offset">
      <div class="profile-header">
        <h1 class="profile-name">{director.name}</h1>
        <div class="profile-role">Director - The Founders</div>
      </div>
      <p>{director.bio}</p>
    </div>

    <div class="profile-block">
      <div class="eyebrow">Selected Work</div>
      {#if selectedWork.length}
        <div class="grid cols-3">
          {#each selectedWork as item, index}
            <WorkCard {item} delay={(index % 3) + 1} />
          {/each}
        </div>
      {:else}
        <p>Selected work will be updated soon.</p>
      {/if}
    </div>
  </div>
</section>
