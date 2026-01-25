<script>
  let { data } = $props();

  const directors = $derived(data.content.directors);
  const reelParams =
    "background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0";
  const resolveId = (person) => person.id || person.slug || "";
  let selectedId = $state("");
  const selectedDirector = $derived(
    selectedId
      ? directors.find((item) => (item.id || item.slug) === selectedId)
      : null,
  );
  const selectedReel = $derived.by(() => {
    if (!selectedDirector) {
      return "";
    }

    const separator = selectedDirector.reelUrl.includes("?") ? "&" : "?";
    return `${selectedDirector.reelUrl}${separator}${reelParams}`;
  });
</script>

<svelte:head>
  <title>Directors | {data.content.site.name}</title>
</svelte:head>

<div class="directors-stage">
  {#if selectedDirector}
    <div class="directors-bg">
      <iframe
        src={selectedReel}
        title={`${selectedDirector.name} reel`}
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <div class="directors-overlay"></div>
  {/if}

  <div class="container directors-content">
    <div class="director-minimal" on:mouseleave={() => (selectedId = "")}>
      {#each directors as director}
        <a
          href={`/directors/${director.slug || director.id}`}
          class:selected={selectedId === resolveId(director)}
          on:mouseenter={() => (selectedId = resolveId(director))}
          on:focus={() => (selectedId = resolveId(director))}
        >
          {director.name}
        </a>
      {/each}
    </div>
  </div>
</div>
