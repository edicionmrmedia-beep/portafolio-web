<script>
  let { data } = $props();
</script>

<svelte:head>
  <title>About | {data.content.site.name}</title>
</svelte:head>

<section class="section">
  <div class="container">
    <div class="section-header">
      <h1>About</h1>
    </div>
    <div class="text-block">
      <p>
        The Founders is a high-end direction and production studio built around
        creative leadership and authorship.
      </p>
      <p>
        We represent and collaborate with a carefully curated pool of directors
        and cinematographers, leading projects for brands that demand clarity,
        craft, and control.
      </p>
      <p>
        Our approach is direction-first, ensuring consistency, vision, and
        execution at scale across every production.
      </p>
    </div>
  </div>
</section>
