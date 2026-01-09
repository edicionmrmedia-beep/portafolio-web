<script>
  let { data } = $props();

  const dops = $derived(data.content.dops);
  const reelParams =
    "background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0";
  let selectedId = $state("");
  const selectedDop = $derived(
    selectedId ? dops.find((item) => item.id === selectedId) : null
  );
  const selectedReel = $derived.by(() => {
    if (!selectedDop) {
      return "";
    }

    const separator = selectedDop.reelUrl.includes("?") ? "&" : "?";
    return `${selectedDop.reelUrl}${separator}${reelParams}`;
  });
</script>

<svelte:head>
  <title>DOPs | {data.content.site.name}</title>
</svelte:head>

<section class="section">
  <div class="directors-stage">
    {#if selectedDop}
      <div class="directors-bg">
        <iframe
          src={selectedReel}
          title={`${selectedDop.name} reel`}
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="directors-overlay"></div>
    {/if}

    <div class="container directors-content">
      <div class="director-minimal" on:mouseleave={() => (selectedId = "")}>
        {#each dops as dop}
          <a
            href={`/dops/${dop.slug}`}
            class:selected={selectedId === dop.id}
            on:mouseenter={() => (selectedId = dop.id)}
            on:focus={() => (selectedId = dop.id)}
          >
            {dop.name}
          </a>
        {/each}
      </div>
    </div>
  </div>
</section>
