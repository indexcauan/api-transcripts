import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { TranscriptDocument } from './types.js';

const directory = path.resolve(process.cwd(), 'data', 'transcripts');
const safeId = /^[A-Za-z0-9_-]{8,80}$/;

export async function initStore() { await mkdir(directory, { recursive: true }); }

export async function saveTranscript(document: TranscriptDocument) {
  if (!safeId.test(document.id)) throw new Error('Invalid transcript id');
  await initStore();
  const target = path.join(directory, `${document.id}.json`);
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(document), 'utf8');
  await rename(temporary, target);
}

export async function getTranscript(id: string): Promise<TranscriptDocument | null> {
  if (!safeId.test(id)) return null;
  try { return JSON.parse(await readFile(path.join(directory, `${id}.json`), 'utf8')) as TranscriptDocument; }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error; }
}

export async function deleteTranscript(id: string) {
  if (!safeId.test(id)) return false;
  try { await unlink(path.join(directory, `${id}.json`)); return true; }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false; throw error; }
}

export async function purgeExpired(ttlDays: number) {
  if (ttlDays <= 0) return;
  await initStore();
  const cutoff = Date.now() - ttlDays * 86_400_000;
  for (const file of await readdir(directory)) {
    if (!file.endsWith('.json')) continue;
    try {
      const raw = JSON.parse(await readFile(path.join(directory, file), 'utf8')) as TranscriptDocument;
      if (new Date(raw.createdAt).getTime() < cutoff) await unlink(path.join(directory, file));
    } catch { /* An invalid file is ignored instead of taking the API down. */ }
  }
}
