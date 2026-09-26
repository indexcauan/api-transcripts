import assert from 'node:assert/strict';
import test from 'node:test';
import { internals, renderTranscript } from '../src/render.js';

test('escapes message HTML and rejects unsafe links', () => {
  assert.match(internals.markdown('<script>alert(1)</script>'), /&lt;script&gt;/);
  assert.equal(internals.safeUrl('javascript:alert(1)'), '');
});

test('renders embeds, Components V2 and copyright footer', () => {
  const html = renderTranscript({
    id: 'abcdefgh', createdAt: new Date().toISOString(), guild: { name: 'Fire Bots' }, channel: { name: 'ticket-001' },
    messages: [{ author: { username: 'Cliente', bot: false }, content: 'Olá', embeds: [{ title: 'Atendimento', color: 0xed4245 }], components: [{ type: 17, accent_color: 0xed4245, components: [{ type: 10, content: '**Ticket encerrado**' }] }] }]
  });
  assert.match(html, /class="embed"/);
  assert.match(html, /class="container"/);
  assert.match(html, /<strong>Ticket encerrado<\/strong>/);
  assert.match(html, /Exported 1 message\. • Fire Bots © 2026/);
  assert.doesNotMatch(html, /class="watermark"/);
});

test('renders Components V2 headings, accents and mention highlights', () => {
  const html = renderTranscript({
    id: 'highlight-test', createdAt: new Date().toISOString(), guild: { name: 'Fire Bots' }, channel: { name: 'ticket' },
    messages: [{ highlight: true, author: { username: 'Bot', bot: true }, components: [{ type: 17, components: [{ type: 10, content: '  ## Olá, aplicação!\nNinguém assumiu ainda\napps.tsx' }] }] }]
  });
  assert.match(html, /message[^\"]*highlight/);
  assert.match(html, /<h2>Olá, aplicação!<\/h2>/);
  assert.match(html, /Ninguém assumiu ainda/);
  assert.match(html, /apps\.tsx/);
  assert.doesNotMatch(html, /## Olá/);
});
