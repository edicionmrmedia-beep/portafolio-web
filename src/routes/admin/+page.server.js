import { fail } from '@sveltejs/kit';
import { updateContent, readContent } from '$lib/server/content';

const defaultBio =
  'Director focused on advertising and branded content, with experience leading campaigns for global brands and premium talent.';
const defaultDopBio =
  'Cinematographer specializing in high-end advertising and branded content productions.';

const matchesId = (item, id) => item?.id === id || item?.slug === id;

const slugify = (value) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const parseSelectedWork = (value) => {
  if (!value) {
    return [];
  }

  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    throw new Error('Work list must be valid JSON.');
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => ({
      title: item?.title?.toString().trim() || '',
      client: item?.client?.toString().trim() || '',
      videoUrl: item?.videoUrl?.toString().trim() || ''
    }))
    .filter((item) => item.title && item.client)
    .map((item) => ({
      id: slugify(`${item.client}-${item.title}`),
      ...item
    }));
};

export const load = async ({ fetch, url }) => {
  const content = await readContent({ fetch, url });
  return { content };
};

export const actions = {
  addDirector: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    const reelUrl = form.get('reelUrl')?.toString().trim();
    const bio = form.get('bio')?.toString().trim();
    const selectedRaw = form.get('selectedWork')?.toString().trim();

    if (!name) {
      return fail(400, { message: 'Name is required.' });
    }

    const id = slugify(name);

    if (!id) {
      return fail(400, { message: 'Name must include letters or numbers.' });
    }

    let selectedWork = [];
    try {
      selectedWork = parseSelectedWork(selectedRaw);
    } catch (error) {
      return fail(400, { message: error.message || 'Invalid work list.' });
    }

    try {
      await updateContent(
        (content) => {
          if (content.directors.some((item) => matchesId(item, id))) {
            throw new Error('Director already exists.');
          }

          const director = {
            id,
            name,
            bio: bio || defaultBio,
            reelUrl: reelUrl || 'https://player.vimeo.com/video/76979871',
            selectedWork
          };

          content.directors.push(director);
          return content;
        },
        { fetch, url }
      );
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to add director.' });
    }

    return { success: true, message: 'Director added.' };
  },
  addDop: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    const reelUrl = form.get('reelUrl')?.toString().trim();
    const bio = form.get('bio')?.toString().trim();
    const selectedRaw = form.get('selectedWork')?.toString().trim();

    if (!name) {
      return fail(400, { message: 'Name is required.' });
    }

    const id = slugify(name);

    if (!id) {
      return fail(400, { message: 'Name must include letters or numbers.' });
    }

    let selectedWork = [];
    try {
      selectedWork = parseSelectedWork(selectedRaw);
    } catch (error) {
      return fail(400, { message: error.message || 'Invalid work list.' });
    }

    try {
      await updateContent(
        (content) => {
          if (content.dops.some((item) => matchesId(item, id))) {
            throw new Error('Cinematographer already exists.');
          }

          const dop = {
            id,
            name,
            bio: bio || defaultDopBio,
            reelUrl: reelUrl || 'https://player.vimeo.com/video/50311099',
            selectedWork
          };

          content.dops.push(dop);
          return content;
        },
        { fetch, url }
      );
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to add cinematographer.' });
    }

    return { success: true, message: 'Cinematographer added.' };
  },
  addWork: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    const client = form.get('client')?.toString().trim();
    const videoUrl = form.get('videoUrl')?.toString().trim();

    if (!title || !client || !videoUrl) {
      return fail(400, { message: 'Title, client, and video URL are required.' });
    }

    const id = slugify(`${client}-${title}`);

    try {
      await updateContent(
        (content) => {
          if (content.work.some((item) => item.id === id)) {
            throw new Error('Work entry already exists.');
          }

          const entry = {
            id,
            title,
            client,
            videoUrl
          };

          content.work.unshift(entry);

          return content;
        },
        { fetch, url }
      );
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to add work.' });
    }

    return { success: true, message: 'Work added.' };
  },
  updateDirector: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString().trim();
    const name = form.get('name')?.toString().trim();
    const reelUrl = form.get('reelUrl')?.toString().trim();
    const bio = form.get('bio')?.toString().trim();
    const selectedRaw = form.get('selectedWork')?.toString().trim();

    if (!id) {
      return fail(400, { message: 'Director id is required.' });
    }

    if (!name) {
      return fail(400, { message: 'Name is required.' });
    }

    let selectedWork = [];
    try {
      selectedWork = parseSelectedWork(selectedRaw);
    } catch (error) {
      return fail(400, { message: error.message || 'Invalid work list.' });
    }

    try {
      await updateContent(
        (content) => {
          const director = content.directors.find((item) => matchesId(item, id));
          if (!director) {
            throw new Error('Director not found.');
          }

          director.name = name;
          director.reelUrl = reelUrl || director.reelUrl || 'https://player.vimeo.com/video/76979871';
          director.bio = bio || director.bio || defaultBio;
          director.selectedWork = selectedWork;
          return content;
        },
        { fetch, url }
      );
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to update director.' });
    }

    return { success: true, message: 'Director updated.' };
  },
  deleteDirector: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString().trim();

    if (!id) {
      return fail(400, { message: 'Director id is required.' });
    }

    try {
      await updateContent(
        (content) => {
          const next = content.directors.filter((item) => !matchesId(item, id));
          if (next.length === content.directors.length) {
            throw new Error('Director not found.');
          }

          content.directors = next;
          return content;
        },
        { fetch, url }
      );
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to delete director.' });
    }

    return { success: true, message: 'Director deleted.' };
  },
  updateDop: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString().trim();
    const name = form.get('name')?.toString().trim();
    const reelUrl = form.get('reelUrl')?.toString().trim();
    const bio = form.get('bio')?.toString().trim();
    const selectedRaw = form.get('selectedWork')?.toString().trim();

    if (!id) {
      return fail(400, { message: 'Cinematographer id is required.' });
    }

    if (!name) {
      return fail(400, { message: 'Name is required.' });
    }

    let selectedWork = [];
    try {
      selectedWork = parseSelectedWork(selectedRaw);
    } catch (error) {
      return fail(400, { message: error.message || 'Invalid work list.' });
    }

    try {
      await updateContent(
        (content) => {
          const dop = content.dops.find((item) => matchesId(item, id));
          if (!dop) {
            throw new Error('Cinematographer not found.');
          }

          dop.name = name;
          dop.reelUrl = reelUrl || dop.reelUrl || 'https://player.vimeo.com/video/50311099';
          dop.bio = bio || dop.bio || defaultDopBio;
          dop.selectedWork = selectedWork;
          return content;
        },
        { fetch, url }
      );
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to update cinematographer.' });
    }

    return { success: true, message: 'Cinematographer updated.' };
  },
  deleteDop: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString().trim();

    if (!id) {
      return fail(400, { message: 'Cinematographer id is required.' });
    }

    try {
      await updateContent(
        (content) => {
          const next = content.dops.filter((item) => !matchesId(item, id));
          if (next.length === content.dops.length) {
            throw new Error('Cinematographer not found.');
          }

          content.dops = next;
          return content;
        },
        { fetch, url }
      );
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to delete cinematographer.' });
    }

    return { success: true, message: 'Cinematographer deleted.' };
  },
  updateWork: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString().trim();
    const title = form.get('title')?.toString().trim();
    const client = form.get('client')?.toString().trim();
    const videoUrl = form.get('videoUrl')?.toString().trim();

    if (!id) {
      return fail(400, { message: 'Work ID is required.' });
    }

    if (!title || !client || !videoUrl) {
      return fail(400, { message: 'Title, client, and video URL are required.' });
    }

    try {
      await updateContent(
        (content) => {
          const index = content.work.findIndex((item) => item.id === id);
          if (index < 0) {
            throw new Error('Work entry not found.');
          }

          content.work[index] = {
            id,
            title,
            client,
            videoUrl
          };

          return content;
        },
        { fetch, url }
      );
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to update work.' });
    }

    return { success: true, message: 'Work updated.' };
  },
  deleteWork: async ({ request, fetch, url }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString().trim();

    if (!id) {
      return fail(400, { message: 'Work ID is required.' });
    }

    try {
      await updateContent(
        (content) => {
          const next = content.work.filter((item) => item.id !== id);
          if (next.length === content.work.length) {
            throw new Error('Work entry not found.');
          }

          content.work = next;
          return content;
        },
        { fetch, url }
      );
    } catch (error) {
      return fail(400, { message: error.message || 'Unable to delete work.' });
    }

    return { success: true, message: 'Work deleted.' };
  }
};
