import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const contentPath = fileURLToPath(new URL('../../../data/content.json', import.meta.url));

export async function readContent() {
  const raw = await readFile(contentPath, 'utf-8');
  return JSON.parse(raw);
}

export async function writeContent(content) {
  const serialized = JSON.stringify(content, null, 2);
  await writeFile(contentPath, serialized, 'utf-8');
}

export async function updateContent(updater) {
  const content = await readContent();
  const next = await updater(content);
  await writeContent(next);
  return next;
}
