import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { env } from '$env/dynamic/private';

const contentPath = resolve(process.cwd(), 'static', 'content.json');
const kvKey = env.KV_CONTENT_KEY || 'content';
const hasKV = Boolean(env.KV_REST_API_URL && env.KV_REST_API_TOKEN);

const readContentFromFile = async () => {
  const raw = await readFile(contentPath, 'utf-8');
  return JSON.parse(raw);
};

const readContentFromKV = async () => {
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({
    url: env.KV_REST_API_URL || '',
    token: env.KV_REST_API_TOKEN || ''
  });
  const value = await redis.get(kvKey);

  if (!value) {
    throw new Error('KV content is empty.');
  }

  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  return value;
};

const writeContentToKV = async (content) => {
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({
    url: env.KV_REST_API_URL || '',
    token: env.KV_REST_API_TOKEN || ''
  });
  await redis.set(kvKey, JSON.stringify(content));
};

const readContentFromFetch = async (fetch, url) => {
  const response = await fetch(new URL('/content.json', url));

  if (!response.ok) {
    throw new Error(`Failed to load content.json: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export async function readContent({ fetch, url } = {}) {
  if (hasKV) {
    try {
      return await readContentFromKV();
    } catch (error) {
      if (fetch && url) {
        try {
          return await readContentFromFetch(fetch, url);
        } catch {
          return readContentFromFile();
        }
      }

      return readContentFromFile();
    }
  }

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
  if (hasKV) {
    await writeContentToKV(content);
    return;
  }

  const serialized = JSON.stringify(content, null, 2);
  await writeFile(contentPath, serialized, 'utf-8');
}

export async function updateContent(updater, options = {}) {
  const content = await readContent(options);
  const next = await updater(content);
  await writeContent(next);
  return next;
}
