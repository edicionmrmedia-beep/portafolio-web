import { error } from '@sveltejs/kit';
import { readContent } from '$lib/server/content';

export const load = async ({ params, fetch, url }) => {
  const content = await readContent({ fetch, url });
  const dop = content.dops.find(
    (item) => item.slug === params.slug || item.id === params.slug
  );

  if (!dop) {
    throw error(404, 'Cinematographer not found');
  }

  const selectedWork = (dop.selectedWork || [])
    .map((item) =>
      typeof item === 'string'
        ? content.work.find((workItem) => workItem.id === item)
        : item
    )
    .filter(Boolean);

  return {
    dop,
    selectedWork
  };
};
