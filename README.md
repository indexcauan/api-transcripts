# Fire Bots Transcript API

[Português](#português) • [English](#english)

---

## Português

API HTTP para armazenar e exibir transcripts de tickets com visual semelhante ao Discord e uma marca-d'água discreta da [Fire Bots](https://firerobots.com.br).

### Recursos

- Mensagens, respostas, menções, reações e Markdown.
- Embeds, imagens, vídeos e outros anexos.
- Components V2: Container, Section, Text Display, Thumbnail, Media Gallery, File, Separator, Action Row, botões e menus de seleção.
- Armazenamento persistente em JSON e expiração automática opcional.
- Autenticação opcional por API key.
- Layout responsivo e imagem Docker para produção.

### Requisitos e instalação

- Node.js 22 ou mais recente.
- npm.

```bash
npm install
```

No Windows:

```powershell
Copy-Item .env.example .env
npm run dev
```

No Linux ou macOS:

```bash
cp .env.example .env
npm run dev
```

A API estará disponível em `http://localhost:3000`.

### Configuração

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3000` | Porta HTTP da API. |
| `PUBLIC_BASE_URL` | `http://localhost:3000` | Endereço público usado nas URLs geradas. |
| `API_KEY` | vazio | Chave opcional para proteger as rotas da API. |
| `TRANSCRIPT_TTL_DAYS` | `0` | Dias até a remoção automática; `0` desativa a expiração. |
| `TRUST_PROXY` | `false` | Use `true` atrás de um proxy confiável. |

Com `API_KEY` configurada, envie `Authorization: Bearer SUA_CHAVE` ou `X-API-Key: SUA_CHAVE`. A página pública `/transcripts/:id` não exige autenticação.

### Criar um transcript

Envie `POST /v1/transcripts` com `Content-Type: application/json`:

```json
{
  "guild": {
    "id": "123",
    "name": "Fire Bots",
    "iconUrl": "https://cdn.discordapp.com/icons/123/icon.png"
  },
  "channel": {
    "id": "456",
    "name": "ticket-joao",
    "topic": "Atendimento de João"
  },
  "messages": [
    {
      "id": "789",
      "timestamp": "2026-09-26T15:30:00.000Z",
      "author": {
        "id": "111",
        "username": "Fire Bots",
        "global_name": "Fire Bots",
        "avatar_url": "https://cdn.discordapp.com/avatars/111/avatar.png",
        "bot": true
      },
      "content": "Olá! Este é o seu ticket.",
      "embeds": [{
        "title": "Atendimento iniciado",
        "description": "A equipe responderá em breve.",
        "color": 15548997
      }],
      "components": [{
        "type": 17,
        "accent_color": 15548997,
        "components": [
          { "type": 10, "content": "## Central de atendimento\nUse os botões abaixo." },
          { "type": 14, "divider": true, "spacing": 1 },
          { "type": 1, "components": [
            { "type": 2, "style": 4, "label": "Fechar ticket", "custom_id": "close", "disabled": true },
            { "type": 2, "style": 5, "label": "Site", "url": "https://firerobots.com.br" }
          ]}
        ]
      }]
    }
  ]
}
```

Resposta `201 Created`:

```json
{
  "id": "ID_GERADO",
  "url": "https://seu-dominio.com/transcripts/ID_GERADO",
  "createdAt": "2026-09-26T15:31:00.000Z",
  "messageCount": 1
}
```

### Rotas

| Método | Rota | Descrição | Autenticação opcional |
| --- | --- | --- | --- |
| `POST` | `/v1/transcripts` | Cria e armazena um transcript. | Sim |
| `GET` | `/transcripts/:id` | Exibe a página pública. | Não |
| `GET` | `/v1/transcripts/:id` | Retorna o documento JSON. | Sim |
| `DELETE` | `/v1/transcripts/:id` | Remove um transcript. | Sim |
| `GET` | `/health` | Verifica a disponibilidade da API. | Não |

### Produção

```bash
npm run build
npm start
```

Com Docker:

```bash
docker build -t firebots-transcript-api .
docker run -d --name firebots-transcripts -p 3000:3000 \
  -e PUBLIC_BASE_URL=https://transcripts.exemplo.com \
  -e API_KEY=uma-chave-segura \
  -v firebots-transcripts:/app/data/transcripts \
  firebots-transcript-api
```

Os documentos ficam em `data/transcripts`. Componentes interativos aparecem em modo somente leitura.

---

## English

HTTP API for storing and displaying ticket transcripts with a Discord-like appearance and a subtle [Fire Bots](https://firerobots.com.br) watermark.

### Features

- Messages, replies, mentions, reactions, and Markdown.
- Embeds, images, videos, and other attachments.
- Components V2: Container, Section, Text Display, Thumbnail, Media Gallery, File, Separator, Action Row, buttons, and select menus.
- Persistent JSON storage and optional automatic expiration.
- Optional API key authentication.
- Responsive layout and a production-ready Docker image.

### Requirements and installation

- Node.js 22 or newer.
- npm.

```bash
npm install
```

On Windows:

```powershell
Copy-Item .env.example .env
npm run dev
```

On Linux or macOS:

```bash
cp .env.example .env
npm run dev
```

The API will be available at `http://localhost:3000`.

### Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | API HTTP port. |
| `PUBLIC_BASE_URL` | `http://localhost:3000` | Public address used in generated URLs. |
| `API_KEY` | empty | Optional key used to protect API routes. |
| `TRANSCRIPT_TTL_DAYS` | `0` | Days before automatic deletion; `0` disables expiration. |
| `TRUST_PROXY` | `false` | Set to `true` behind a trusted proxy. |

When `API_KEY` is configured, send `Authorization: Bearer YOUR_KEY` or `X-API-Key: YOUR_KEY`. The public `/transcripts/:id` page does not require authentication.

### Create a transcript

Send `POST /v1/transcripts` with `Content-Type: application/json`:

```json
{
  "guild": {
    "id": "123",
    "name": "Fire Bots",
    "iconUrl": "https://cdn.discordapp.com/icons/123/icon.png"
  },
  "channel": {
    "id": "456",
    "name": "ticket-john",
    "topic": "Support for John"
  },
  "messages": [
    {
      "id": "789",
      "timestamp": "2026-09-26T15:30:00.000Z",
      "author": {
        "id": "111",
        "username": "Fire Bots",
        "global_name": "Fire Bots",
        "avatar_url": "https://cdn.discordapp.com/avatars/111/avatar.png",
        "bot": true
      },
      "content": "Hello! This is your ticket.",
      "embeds": [{
        "title": "Support started",
        "description": "The team will reply shortly.",
        "color": 15548997
      }],
      "components": [{
        "type": 17,
        "accent_color": 15548997,
        "components": [
          { "type": 10, "content": "## Support center\nUse the buttons below." },
          { "type": 14, "divider": true, "spacing": 1 },
          { "type": 1, "components": [
            { "type": 2, "style": 4, "label": "Close ticket", "custom_id": "close", "disabled": true },
            { "type": 2, "style": 5, "label": "Website", "url": "https://firerobots.com.br" }
          ]}
        ]
      }]
    }
  ]
}
```

`201 Created` response:

```json
{
  "id": "GENERATED_ID",
  "url": "https://your-domain.com/transcripts/GENERATED_ID",
  "createdAt": "2026-09-26T15:31:00.000Z",
  "messageCount": 1
}
```

### Routes

| Method | Route | Description | Optional authentication |
| --- | --- | --- | --- |
| `POST` | `/v1/transcripts` | Creates and stores a transcript. | Yes |
| `GET` | `/transcripts/:id` | Displays the public page. | No |
| `GET` | `/v1/transcripts/:id` | Returns the JSON document. | Yes |
| `DELETE` | `/v1/transcripts/:id` | Deletes a transcript. | Yes |
| `GET` | `/health` | Checks API availability. | No |

### Production

```bash
npm run build
npm start
```

With Docker:

```bash
docker build -t firebots-transcript-api .
docker run -d --name firebots-transcripts -p 3000:3000 \
  -e PUBLIC_BASE_URL=https://transcripts.example.com \
  -e API_KEY=a-secure-key \
  -v firebots-transcripts:/app/data/transcripts \
  firebots-transcript-api
```

Documents are stored in `data/transcripts`. Interactive components are displayed in read-only mode.
