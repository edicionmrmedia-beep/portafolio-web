<script>
  let { data } = $props();

  const postProduction = $derived(data.content.postProduction || []);
  const reelParams =
    "background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0";
  const resolveId = (person) => person.id || person.slug || "";
  let selectedId = $state("");
  const selectedArtist = $derived(
    selectedId
      ? postProduction.find((item) => (item.id || item.slug) === selectedId)
      : null,
  );
  const selectedReel = $derived.by(() => {
    if (!selectedArtist) {
      return "";
    }

    const separator = selectedArtist.reelUrl.includes("?") ? "&" : "?";
    return `${selectedArtist.reelUrl}${separator}${reelParams}`;
  });
</script>

<svelte:head>
  <title>Post-production | {data.content.site.name}</title>
</svelte:head>

<div class="directors-stage">
  {#if selectedArtist}
    <div class="directors-bg">
      <iframe
        src={selectedReel}
        title={`${selectedArtist.name} reel`}
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <div class="directors-overlay"></div>
  {/if}

  <div class="container directors-content">
    <div class="director-minimal" on:mouseleave={() => (selectedId = "")}>
      {#each postProduction as artist}
        <a
          href={`/post-production/${artist.slug || artist.id}`}
          class:selected={selectedId === resolveId(artist)}
          on:mouseenter={() => (selectedId = resolveId(artist))}
          on:focus={() => (selectedId = resolveId(artist))}
        >
          {artist.name}
        </a>
      {/each}
    </div>
  </div>
</div>
