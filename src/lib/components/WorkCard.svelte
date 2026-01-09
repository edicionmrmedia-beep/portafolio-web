<script>
  let { item, delay = 0 } = $props();

  const delayClass = $derived(delay ? `delay-${delay}` : "");
  const imageValue = $derived(item.thumbnail || item.image || "");
  const imageStyle = $derived.by(() => {
    if (!imageValue) {
      return "";
    }

    const trimmed = imageValue.trim();
    if (
      trimmed.startsWith("linear-gradient") ||
      trimmed.startsWith("radial-gradient") ||
      trimmed.startsWith("conic-gradient") ||
      trimmed.startsWith("url(")
    ) {
      return `background-image: ${trimmed}`;
    }

    return `background-image: url(${trimmed})`;
  });
</script>

<article class={`card reveal ${delayClass}`}>
  <a
    class="card-image work-card"
    href={item.videoUrl}
    target="_blank"
    rel="noreferrer"
    style={imageStyle}
    aria-label={`Watch ${item.title}`}
  >
    <span class="work-title">{item.title}</span>
  </a>
</article>
