<script>
  let { item, delay = 0 } = $props();

  const delayClass = $derived(delay ? `delay-${delay}` : "");
  const getVimeoId = (url) => {
    if (!url) {
      return null;
    }

    const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)(?:$|[?/])/);
    return match ? match[1] : null;
  };

  const getYouTubeId = (url) => {
    if (!url) {
      return null;
    }

    const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
    if (shortMatch) {
      return shortMatch[1];
    }

    const queryMatch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
    if (queryMatch) {
      return queryMatch[1];
    }

    const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
    return embedMatch ? embedMatch[1] : null;
  };

  const resolveThumbnail = (url) => {
    if (!url) {
      return "";
    }

    if (url.includes("vimeo.com")) {
      const vimeoId = getVimeoId(url);
      return vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : "";
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const youtubeId = getYouTubeId(url);
      return youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : "";
    }

    return "";
  };

  const fallbackThumbnail = $derived.by(() => resolveThumbnail(item.videoUrl || ""));
  const imageValue = $derived(item.thumbnail || item.image || fallbackThumbnail || "");
  const displayTitle = $derived(
    item.client ? `${item.title} - ${item.client}` : item.title || item.client || ""
  );
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
    aria-label={`Watch ${displayTitle || item.title}`}
  >
    <span class="work-title">{displayTitle}</span>
  </a>
</article>
