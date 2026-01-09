import { error } from '@sveltejs/kit';
import { readContent } from '$lib/server/content';

export const load = async ({ params, fetch, url }) => {
  const content = await readContent({ fetch, url });
  const director = content.directors.find((item) => item.slug === params.slug);

  if (!director) {
    throw error(404, 'Director not found');
  }

  const selectedWork = (director.selectedWork || [])
    .map((id) => content.work.find((item) => item.id === id))
    .filter(Boolean);

  return {
    director,
    selectedWork
  };
};
