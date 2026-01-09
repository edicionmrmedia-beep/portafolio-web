import { readContent } from '$lib/server/content';

export const load = async () => {
  const content = await readContent();
  return { content };
};
