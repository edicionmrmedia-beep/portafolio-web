import { fail } from '@sveltejs/kit';
import { updateContent, readContent } from '$lib/server/content';

const defaultBio =
  'Director focused on advertising and branded content, with experience leading campaigns for global brands and premium talent.';
const defaultDopBio =
  'Cinematographer specializing in high-end advertising and branded content productions.';
const fallbackImage = 'linear-gradient(140deg, #cdb08a 0%, #8a6b4f 55%, #2b1c18 100%)';

const slugify = (value) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const parseList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const unique = (items) => Array.from(new Set(items));

export const load = async () => {
  const content = await readContent();
  return { content };
};

export const actions = {
  addDirector: async ({ request }) => {
    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    const reelUrl = form.get('reelUrl')?.toString().trim();
    const image = form.get('image')?.toString().trim();
    const bio = form.get('bio')?.toString().trim();
    const logosRaw = form.get('logos')?.toString().trim();
    const selectedRaw = form.get('selectedWork')?.toString().trim();

    if (!name) {
      return fail(400, { message: 'Name is required.' });
    }

    const slug = slugify(name);

    if (!slug) {
      return fail(400, { message: 'Name must include letters or numbers.' });
    }

    try {
      await updateContent((content) => {
        if (content.directors.some((item) => item.slug === slug)) {
          throw new Error('Director already exists.');
        }

        const director = {
          id: slug,
          slug,
          name,
          role: 'Director',
          image: image || fallbackImage,
          bio: bio || defaultBio,
          reelUrl: reelUrl || 'https://player.vimeo.com/video/76979871',
          selectedWork: selectedRaw ? parseList(selectedRaw) : [],
          logos: logosRaw ? parseList(logosRaw) : []
        };

        content.directors.push(director);
        return content;
      });
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to add director.' });
    }

    return { success: true, message: 'Director added.' };
  },
  addDop: async ({ request }) => {
    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    const reelUrl = form.get('reelUrl')?.toString().trim();
    const image = form.get('image')?.toString().trim();
    const bio = form.get('bio')?.toString().trim();
    const selectedRaw = form.get('selectedWork')?.toString().trim();

    if (!name) {
      return fail(400, { message: 'Name is required.' });
    }

    const slug = slugify(name);

    if (!slug) {
      return fail(400, { message: 'Name must include letters or numbers.' });
    }

    try {
      await updateContent((content) => {
        if (content.dops.some((item) => item.slug === slug)) {
          throw new Error('Cinematographer already exists.');
        }

        const dop = {
          id: slug,
          slug,
          name,
          role: 'Director of Photography',
          image: image || fallbackImage,
          bio: bio || defaultDopBio,
          reelUrl: reelUrl || 'https://player.vimeo.com/video/50311099',
          selectedWork: selectedRaw ? parseList(selectedRaw) : []
        };

        content.dops.push(dop);
        return content;
      });
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to add cinematographer.' });
    }

    return { success: true, message: 'Cinematographer added.' };
  },
  addWork: async ({ request }) => {
    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    const client = form.get('client')?.toString().trim();
    const year = form.get('year')?.toString().trim();
    const videoUrl = form.get('videoUrl')?.toString().trim();
    const image = form.get('image')?.toString().trim();
    const directorSlug = form.get('director')?.toString().trim();
    const dopSlug = form.get('dop')?.toString().trim();

    if (!title || !client || !videoUrl) {
      return fail(400, { message: 'Title, client, and video URL are required.' });
    }

    const id = slugify(`${client}-${title}`);

    try {
      await updateContent((content) => {
        if (content.work.some((item) => item.id === id)) {
          throw new Error('Work entry already exists.');
        }

        const entry = {
          id,
          title,
          client,
          year: year || '2024',
          videoUrl,
          image: image || fallbackImage,
          director: directorSlug || null,
          dop: dopSlug || null
        };

        content.work.unshift(entry);

        if (directorSlug) {
          const director = content.directors.find((item) => item.slug === directorSlug);
          if (director) {
            director.selectedWork = unique([id, ...(director.selectedWork || [])]);
          }
        }

        if (dopSlug) {
          const dop = content.dops.find((item) => item.slug === dopSlug);
          if (dop) {
            dop.selectedWork = unique([id, ...(dop.selectedWork || [])]);
          }
        }

        return content;
      });
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to add work.' });
    }

    return { success: true, message: 'Work added.' };
  }
};
