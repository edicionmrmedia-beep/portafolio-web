import { error } from '@sveltejs/kit';
import { readContent } from '$lib/server/content';

export const load = async ({ params, fetch, url }) => {
  const content = await readContent({ fetch, url });
  const director = content.directors.find(
    (item) => item.slug === params.slug || item.id === params.slug
  );

  if (!director) {
    throw error(404, 'Director not found');
  }

  const selectedWork = (director.selectedWork || [])
    .map((item) =>
      typeof item === 'string'
        ? content.work.find((workItem) => workItem.id === item)
        : item
    )
    .filter(Boolean);

  return {
    director,
    selectedWork
  };
};
