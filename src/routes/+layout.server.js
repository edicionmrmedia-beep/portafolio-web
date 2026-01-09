import { readContent } from '$lib/server/content';

export const load = async ({ fetch, url }) => {
  const content = await readContent({ fetch, url });
  return { content };
};
