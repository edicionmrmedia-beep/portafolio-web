import { error } from '@sveltejs/kit';
import { readContent } from '$lib/server/content';

export const load = async ({ params, fetch, url }) => {
  const content = await readContent({ fetch, url });
  const postProductionList = content.postProduction || [];
  const postProduction = postProductionList.find(
    (item) => item.slug === params.slug || item.id === params.slug
  );

  if (!postProduction) {
    throw error(404, 'Post-production artist not found');
  }

  const selectedWork = (postProduction.selectedWork || [])
    .map((item) =>
      typeof item === 'string'
        ? content.work.find((workItem) => workItem.id === item)
        : item
    )
    .filter(Boolean);

  return {
    postProduction,
    selectedWork
  };
};
