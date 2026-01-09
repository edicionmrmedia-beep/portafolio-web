<script>
  let { data, form } = $props();

  const content = $derived(data.content);
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
            Year
            <input name="year" placeholder="2024" />
          </label>
          <label>
            Video URL
            <input name="videoUrl" placeholder="https://player.vimeo.com/..." required />
          </label>
          <label>
            Image (optional)
            <input name="image" placeholder="Linear gradient or image URL" />
          </label>
          <label>
            Director
            <select name="director">
              <option value="">None</option>
              {#each content.directors as director}
                <option value={director.slug}>{director.name}</option>
              {/each}
            </select>
          </label>
          <label>
            DOP
            <select name="dop">
              <option value="">None</option>
              {#each content.dops as dop}
                <option value={dop.slug}>{dop.name}</option>
              {/each}
            </select>
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
            Image (optional)
            <input name="image" placeholder="Linear gradient or image URL" />
          </label>
          <label>
            Bio (optional)
            <textarea name="bio" rows="3"></textarea>
          </label>
          <label>
            Logos (comma separated)
            <input name="logos" placeholder="Nike, Apple, Cartier" />
          </label>
          <label>
            Selected work IDs (comma separated)
            <input name="selectedWork" placeholder="atlas-sustain, lumen-collection" />
          </label>
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
            Image (optional)
            <input name="image" placeholder="Linear gradient or image URL" />
          </label>
          <label>
            Bio (optional)
            <textarea name="bio" rows="3"></textarea>
          </label>
          <label>
            Selected work IDs (comma separated)
            <input name="selectedWork" placeholder="atlas-sustain, kinetic-arc" />
          </label>
          <button class="button" type="submit">Add DOP</button>
        </form>
      </fieldset>
    </div>

    <div class="admin-list">
      <div>
        <h2>Directors</h2>
        <ul>
          {#each content.directors as director}
            <li>{director.name} ({director.slug})</li>
          {/each}
        </ul>
      </div>
      <div>
        <h2>Cinematographers</h2>
        <ul>
          {#each content.dops as dop}
            <li>{dop.name} ({dop.slug})</li>
          {/each}
        </ul>
      </div>
      <div>
        <h2>Work</h2>
        <ul>
          {#each content.work as item}
            <li>{item.client} - {item.title} ({item.id})</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>
