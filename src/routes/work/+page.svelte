<script>
  import { onMount } from "svelte";

  let { data } = $props();

  const work = $derived(data.content.work);
  const reelParams =
    "background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0";

  const buildVimeoEmbed = (url) => {
    if (!url) {
      return "";
    }

    if (url.includes("player.vimeo.com/video/")) {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}${reelParams}`;
    }

    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}?${reelParams}`;
    }

    return url;
  };

  const isVimeo = (url) => Boolean(url && url.includes("vimeo.com"));

  onMount(() => {
    const videos = Array.from(
      document.querySelectorAll(".work-project video")
    );
    if (!videos.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
              playPromise.catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videos.forEach((video) => {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      observer.observe(video);
    });

    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Work | {data.content.site.name}</title>
</svelte:head>

<section class="work-scroll">
  {#each work as item}
    <article class="work-project">
      <div class="work-media">
        {#if isVimeo(item.videoUrl)}
          <iframe
            src={buildVimeoEmbed(item.videoUrl)}
            title={`${item.title} video`}
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          ></iframe>
        {:else}
          <video src={item.videoUrl} autoplay muted loop playsinline></video>
        {/if}
      </div>
      <div class="work-meta">
        <div class="work-meta-client">{item.client}</div>
        <div class="work-meta-title">{item.title}</div>
      </div>
    </article>
  {/each}
</section>
