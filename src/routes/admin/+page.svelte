<script>
  import WorkListEditor from "$lib/components/WorkListEditor.svelte";

  let { data, form } = $props();

  const content = $derived(data.content);
  const resolveSelectedWork = (items = []) => {
    const workList = content?.work || [];
    return items
      .map((item) =>
        typeof item === "string"
          ? workList.find((workItem) => workItem.id === item)
          : item
      )
      .filter(Boolean);
  };
</script>

<svelte:head>
  <title>Admin | {content.site.name}</title>
</svelte:head>

<section class="section">
  <div class="container admin">
    <div class="section-header">
      <div class="eyebrow">Admin</div>
      <h1>Content Manager</h1>
      <p>Upload video links and keep the roster updated.</p>
    </div>

    {#if form?.message}
      <div class={`admin-message ${form.success ? 'success' : 'error'}`}>{form.message}</div>
    {/if}

    <div class="admin-grid">
      <fieldset>
        <legend>Add work</legend>
        <form method="post" action="?/addWork">
          <label>
            Title
            <input name="title" placeholder="Project title" required />
          </label>
          <label>
            Client
            <input name="client" placeholder="Brand or client" required />
          </label>
          <label>
            Video URL
            <input name="videoUrl" placeholder="https://player.vimeo.com/..." required />
          </label>
          <button class="button" type="submit">Add work</button>
        </form>
      </fieldset>

      <fieldset>
        <legend>Add director</legend>
        <form method="post" action="?/addDirector">
          <label>
            Name
            <input name="name" placeholder="Full name" required />
          </label>
          <label>
            Reel URL
            <input name="reelUrl" placeholder="https://player.vimeo.com/..." />
          </label>
          <label>
            Bio (optional)
            <textarea name="bio" rows="3"></textarea>
          </label>
          <WorkListEditor name="selectedWork" />
          <button class="button" type="submit">Add director</button>
        </form>
      </fieldset>

      <fieldset>
        <legend>Add cinematographer</legend>
        <form method="post" action="?/addDop">
          <label>
            Name
            <input name="name" placeholder="Full name" required />
          </label>
          <label>
            Reel URL
            <input name="reelUrl" placeholder="https://player.vimeo.com/..." />
          </label>
          <label>
            Bio (optional)
            <textarea name="bio" rows="3"></textarea>
          </label>
          <WorkListEditor name="selectedWork" />
          <button class="button" type="submit">Add DOP</button>
        </form>
      </fieldset>
    </div>

    <div class="admin-list">
      <div>
        <h2>Directors</h2>
        <div class="admin-edit-list">
          {#each content.directors as director (director.id || director.slug || director.name)}
            {@const directorWork = resolveSelectedWork(director.selectedWork)}
            <form class="admin-edit" method="post" action="?/updateDirector">
              <input type="hidden" name="id" value={director.id || director.slug} />
              <div class="admin-edit-id">ID: {director.id || director.slug}</div>
              <label>
                Name
                <input name="name" value={director.name} required />
              </label>
              <label>
                Reel URL
                <input name="reelUrl" value={director.reelUrl} />
              </label>
              <label>
                Bio (optional)
                <textarea name="bio" rows="3">{director.bio}</textarea>
              </label>
              <WorkListEditor name="selectedWork" value={directorWork} />
              <div class="admin-edit-actions">
                <button class="button" type="submit">Save</button>
                <button class="button danger" type="submit" formaction="?/deleteDirector">
                  Delete
                </button>
              </div>
            </form>
          {/each}
        </div>
      </div>
      <div>
        <h2>Cinematographers</h2>
        <div class="admin-edit-list">
          {#each content.dops as dop (dop.id || dop.slug || dop.name)}
            {@const dopWork = resolveSelectedWork(dop.selectedWork)}
            <form class="admin-edit" method="post" action="?/updateDop">
              <input type="hidden" name="id" value={dop.id || dop.slug} />
              <div class="admin-edit-id">ID: {dop.id || dop.slug}</div>
              <label>
                Name
                <input name="name" value={dop.name} required />
              </label>
              <label>
                Reel URL
                <input name="reelUrl" value={dop.reelUrl} />
              </label>
              <label>
                Bio (optional)
                <textarea name="bio" rows="3">{dop.bio}</textarea>
              </label>
              <WorkListEditor name="selectedWork" value={dopWork} />
              <div class="admin-edit-actions">
                <button class="button" type="submit">Save</button>
                <button class="button danger" type="submit" formaction="?/deleteDop">
                  Delete
                </button>
              </div>
            </form>
          {/each}
        </div>
      </div>
      <div>
        <h2>Work</h2>
        <div class="admin-edit-list">
          {#each content.work as item (item.id)}
            <form class="admin-edit" method="post" action="?/updateWork">
              <input type="hidden" name="id" value={item.id} />
              <div class="admin-edit-id">ID: {item.id}</div>
              <label>
                Title
                <input name="title" value={item.title} required />
              </label>
              <label>
                Client
                <input name="client" value={item.client} required />
              </label>
              <label>
                Video URL
                <input name="videoUrl" value={item.videoUrl} required />
              </label>
              <div class="admin-edit-actions">
                <button class="button" type="submit">Save</button>
                <button class="button danger" type="submit" formaction="?/deleteWork">
                  Delete
                </button>
              </div>
            </form>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
