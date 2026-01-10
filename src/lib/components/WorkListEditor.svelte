<script>
  let { name = "selectedWork", value = [] } = $props();

  const normalizeItem = (item = {}) => ({
    title: item?.title?.toString().trim() || "",
    client: item?.client?.toString().trim() || "",
    videoUrl: item?.videoUrl?.toString().trim() || ""
  });

  const emptyItem = () => ({ title: "", client: "", videoUrl: "" });

  let items = $state([emptyItem()]);

  $effect(() => {
    items =
      Array.isArray(value) && value.length
        ? value.map(normalizeItem)
        : [emptyItem()];
  });

  const serialized = $derived.by(() => {
    const cleaned = items
      .map(normalizeItem)
      .filter((item) => item.title && item.client);
    return JSON.stringify(cleaned);
  });

  const addItem = () => {
    items = [...items, emptyItem()];
  };

  const removeItem = (index) => {
    items = items.filter((_, i) => i !== index);
    if (!items.length) {
      items = [emptyItem()];
    }
  };
</script>

<div class="admin-worklist">
  <div class="admin-worklist-header">Work list</div>
  {#each items as item, index}
    <div class="admin-worklist-item">
      <label>
        Title
        <input bind:value={item.title} placeholder="Project title" />
      </label>
      <label>
        Client
        <input bind:value={item.client} placeholder="Brand or client" />
      </label>
      <label>
        Video URL
        <input bind:value={item.videoUrl} placeholder="https://player.vimeo.com/..." />
      </label>
      <div class="admin-worklist-actions">
        <button class="button danger" type="button" on:click={() => removeItem(index)}>
          Remove
        </button>
      </div>
    </div>
  {/each}
  <div class="admin-worklist-actions">
    <button class="button" type="button" on:click={addItem}>Add work</button>
  </div>
  <input type="hidden" name={name} value={serialized} />
</div>
