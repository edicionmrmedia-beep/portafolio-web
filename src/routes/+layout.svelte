<script>
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';

  let { children, data } = $props();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/directors', label: 'Directors' },
    { href: '/dops', label: 'DOPs' },
    { href: '/work', label: 'Work' },
    { href: '/contact', label: 'Contact' }
  ];
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta
    name="description"
    content="The Founders is a high-end direction and production studio based in Mexico City."
  />
</svelte:head>

<div class="site">
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="/">The Founders</a>
      <nav class="nav">
        {#each navLinks as link}
          <a class="nav-link" href={link.href}>{link.label}</a>
        {/each}
      </nav>
      <div class="header-meta">
        <span>{data.content.site.location}</span>
        <a href={`mailto:${data.content.site.email}`}>{data.content.site.email}</a>
      </div>
    </div>
  </header>

  <main>
    {@render children()}
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <div class="footer-title">The Founders</div>
        <p>High-End Direction & Production Studio</p>
      </div>
      <div class="footer-links">
        <a href={`mailto:${data.content.site.email}`}>{data.content.site.email}</a>
        <a href={data.content.site.instagram} target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </div>
  </footer>
</div>
