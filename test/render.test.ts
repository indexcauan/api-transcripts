import assert from 'node:assert/strict';
import test from 'node:test';
import { internals, renderTranscript } from '../src/render.js';

test('escapes message HTML and rejects unsafe links', () => {
  assert.match(internals.markdown('<script>alert(1)</script>'), /&lt;script&gt;/);
  assert.equal(internals.safeUrl('javascript:alert(1)'), '');
});

test('renders embeds, Components V2 and watermark', () => {
  const html = renderTranscript({
    id: 'abcdefgh', createdAt: new Date().toISOString(), guild: { name: 'Fire Bots' }, channel: { name: 'ticket-001' },
    messages: [{ author: { username: 'Cliente', bot: false }, content: 'Olá', embeds: [{ title: 'Atendimento', color: 0xed4245 }], components: [{ type: 17, accent_color: 0xed4245, components: [{ type: 10, content: '**Ticket encerrado**' }] }] }]
  });
  assert.match(html, /class="embed"/);
  assert.match(html, /class="container"/);
  assert.match(html, /<strong>Ticket encerrado<\/strong>/);
  assert.match(html, /firerobots\.com\.br/);
});
