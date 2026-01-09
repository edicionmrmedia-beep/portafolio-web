<script>
  let { person, href, cta = 'View profile', delay = 0 } = $props();

  const delayClass = $derived(delay ? `delay-${delay}` : '');
</script>

<article class={`card reveal ${delayClass}`}>
  <a
    class="card-image"
    href={href}
    style={`background-image: ${person.image}`}
    aria-label={`View profile for ${person.name}`}
  ></a>
  <div>
    <div class="card-title">{person.name}</div>
    <div class="card-meta">{person.role}</div>
  </div>
  <a class="card-cta" href={href}>{cta}</a>
</article>
