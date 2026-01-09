import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const contentPath = resolve(process.cwd(), 'static', 'content.json');

const readContentFromFile = async () => {
  const raw = await readFile(contentPath, 'utf-8');
  return JSON.parse(raw);
};

const readContentFromFetch = async (fetch, url) => {
  const response = await fetch(new URL('/content.json', url));

  if (!response.ok) {
    throw new Error(`Failed to load content.json: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export async function readContent({ fetch, url } = {}) {
  if (fetch && url) {
    try {
      return await readContentFromFetch(fetch, url);
    } catch (error) {
      try {
        return await readContentFromFile();
      } catch {
        throw error;
      }
    }
  }

  return readContentFromFile();
}

export async function writeContent(content) {
  const serialized = JSON.stringify(content, null, 2);
  await writeFile(contentPath, serialized, 'utf-8');
}

export async function updateContent(updater, options = {}) {
  const content = await readContent(options);
  const next = await updater(content);
  await writeContent(next);
  return next;
}
