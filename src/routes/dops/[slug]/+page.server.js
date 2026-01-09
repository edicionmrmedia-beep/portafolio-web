import { error } from '@sveltejs/kit';
import { readContent } from '$lib/server/content';

export const load = async ({ params, fetch, url }) => {
  const content = await readContent({ fetch, url });
  const dop = content.dops.find((item) => item.slug === params.slug);

  if (!dop) {
    throw error(404, 'Cinematographer not found');
  }

  const selectedWork = (dop.selectedWork || [])
    .map((id) => content.work.find((item) => item.id === id))
    .filter(Boolean);

  return {
    dop,
    selectedWork
  };
};
