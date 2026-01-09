<script>
  let { data } = $props();
</script>

<svelte:head>
  <title>Contact | {data.content.site.name}</title>
</svelte:head>

<section class="section">
  <div class="container contact">
    <div class="section-header">
      <div class="eyebrow">Contact</div>
      <h1>Contact</h1>
    </div>
    <p>Based in Mexico City. Available for worldwide productions.</p>
    <div class="contact-links">
      <a class="button" href={`mailto:${data.content.site.email}`}>{data.content.site.email}</a>
      <a class="button" href={data.content.site.instagram} target="_blank" rel="noreferrer">
        Instagram
      </a>
    </div>
  </div>
</section>
