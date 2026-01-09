<script>
  import PersonCard from "$lib/components/PersonCard.svelte";
  import WorkCard from "$lib/components/WorkCard.svelte";

  let { data } = $props();

  const directors = $derived(data.content.directors);
  const featuredWork = $derived(data.content.work.slice(0, 3));
</script>

<svelte:head>
  <title>{data.content.site.name}</title>
</svelte:head>

<section class="section hero">
  <div class="hero-media">
    <iframe
      src="https://player.vimeo.com/video/1152673167?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0"
      title="The Founders background reel"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
  <div class="hero-shade"></div>
  <div class="container hero-grid">
    <div class="hero-copy reveal">
      <img class="hero-logo" src="/logo.png" alt="The Founders" />
    </div>
  </div>

  <div class="container hero-support">
    <p>
      The Founders is a direction-first studio based in Mexico City. We work
      with a curated pool of directors and cinematographers, leading advertising
      and branded content for global brands.
    </p>
    <img class="hero-ornament" src="/caballos.png" alt="" />
  </div>
</section>
