import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { z } from 'zod';
import { deleteTranscript, getTranscript, initStore, purgeExpired, saveTranscript } from './store.js';
import { renderTranscript } from './render.js';
import type { TranscriptDocument } from './types.js';

// Carrega o .env tanto em desenvolvimento (src/) quanto após a compilação (dist/src/).
// Variáveis já definidas pelo ambiente de produção nunca são sobrescritas.
const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
for (const candidate of [
  path.resolve(process.cwd(), '.env'),
  path.resolve(moduleDirectory, '../.env'),
  path.resolve(moduleDirectory, '../../.env')
]) dotenv.config({ path: candidate, override: false, quiet: true });

const app = express();
const port = Number(process.env.PORT || 3000);
const baseUrl = (process.env.PUBLIC_BASE_URL || `http://localhost:${port}`).replace(/\/$/, '');
const apiKey = process.env.API_KEY || '';

if (process.env.NODE_ENV === 'production' && !apiKey) {
  console.warn('AVISO: API_KEY não configurada; as rotas /v1 estão públicas.');
}

app.set('trust proxy', process.env.TRUST_PROXY === 'true');
app.disable('x-powered-by');
app.use(cors());
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], styleSrc: ["'unsafe-inline'"], imgSrc: ["'self'", 'https:', 'data:'], mediaSrc: ['https:'], fontSrc: ["'self'", 'https:', 'data:'], baseUri: ["'none'"], frameAncestors: ["'none'"], formAction: ["'none'"] } } }));
app.use(express.json({ limit: '20mb' }));

const requestSchema = z.object({
  guild: z.object({ id: z.string().optional(), name: z.string().min(1).max(200), iconUrl: z.url().optional() }),
  channel: z.object({ id: z.string().optional(), name: z.string().min(1).max(200), topic: z.string().max(2000).optional(), type: z.number().int().optional() }),
  messages: z.array(z.looseObject({})).max(10000),
  metadata: z.record(z.string(), z.unknown()).optional()
});

function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!apiKey) return next();
  const supplied = req.header('authorization')?.replace(/^Bearer\s+/i, '') || req.header('x-api-key') || '';
  const a = Buffer.from(supplied); const b = Buffer.from(apiKey);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'unauthorized' });
  next();
}

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/v1/transcripts', authenticate, async (req, res, next) => {
  try {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_payload', details: z.treeifyError(parsed.error) });
    const id = crypto.randomBytes(12).toString('base64url');
    const document: TranscriptDocument = { id, createdAt: new Date().toISOString(), ...(parsed.data as Omit<TranscriptDocument, 'id' | 'createdAt'>) };
    await saveTranscript(document);
    return res.status(201).location(`${baseUrl}/transcripts/${id}`).json({ id, url: `${baseUrl}/transcripts/${id}`, createdAt: document.createdAt, messageCount: document.messages.length });
  } catch (error) { next(error); }
});

app.get('/v1/transcripts/:id', authenticate, async (req, res, next) => {
  try { const doc = await getTranscript(String(req.params.id)); return doc ? res.json(doc) : res.status(404).json({ error: 'not_found' }); } catch (error) { next(error); }
});

app.delete('/v1/transcripts/:id', authenticate, async (req, res, next) => {
  try { return (await deleteTranscript(String(req.params.id))) ? res.status(204).end() : res.status(404).json({ error: 'not_found' }); } catch (error) { next(error); }
});

app.get('/transcripts/:id', async (req, res, next) => {
  try { const doc = await getTranscript(String(req.params.id)); if (!doc) return res.status(404).type('text').send('Transcript não encontrado.'); return res.type('html').set('Cache-Control', 'no-store, max-age=0').send(renderTranscript(doc)); } catch (error) { next(error); }
});

app.use((_req, res) => res.status(404).json({ error: 'not_found' }));
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => { console.error(error); res.status(500).json({ error: 'internal_error' }); });

await initStore();
await purgeExpired(Number(process.env.TRANSCRIPT_TTL_DAYS || 0));
setInterval(() => void purgeExpired(Number(process.env.TRANSCRIPT_TTL_DAYS || 0)), 3_600_000).unref();

if (process.env.NODE_ENV !== 'test') app.listen(port, () => console.log(`Fire Bots Transcript API: ${baseUrl}`));
export { app };
