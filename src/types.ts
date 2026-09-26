export type Snowflake = string;

export interface DiscordUser {
  id?: Snowflake;
  username?: string;
  global_name?: string | null;
  display_name?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  bot?: boolean;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  footer?: { text?: string; icon_url?: string };
  author?: { name?: string; url?: string; icon_url?: string };
  thumbnail?: { url?: string };
  image?: { url?: string };
  fields?: Array<{ name?: string; value?: string; inline?: boolean }>;
}

export interface DiscordComponent {
  type: number;
  id?: number;
  custom_id?: string;
  style?: number;
  label?: string;
  emoji?: { id?: string | null; name?: string | null; animated?: boolean };
  url?: string;
  disabled?: boolean;
  placeholder?: string;
  content?: string;
  accent_color?: number | null;
  spoiler?: boolean;
  divider?: boolean;
  spacing?: number;
  file?: { url?: string };
  media?: { url?: string };
  description?: string;
  name?: string;
  size?: number;
  items?: Array<{ media?: { url?: string }; description?: string; spoiler?: boolean }>;
  accessory?: DiscordComponent;
  components?: DiscordComponent[];
  options?: Array<{ label?: string; value?: string; description?: string; emoji?: DiscordComponent['emoji']; default?: boolean }>;
}

export interface DiscordMessage {
  id?: Snowflake;
  type?: number;
  content?: string;
  timestamp?: string;
  edited_timestamp?: string | null;
  author?: DiscordUser;
  member?: { nick?: string | null; avatar?: string | null; color?: string | number; roles?: string[] };
  avatar_url?: string;
  webhook_id?: Snowflake;
  embeds?: DiscordEmbed[];
  components?: DiscordComponent[];
  attachments?: Array<{ id?: Snowflake; filename?: string; url?: string; proxy_url?: string; content_type?: string; size?: number; width?: number; height?: number; description?: string; spoiler?: boolean }>;
  reactions?: Array<{ count?: number; me?: boolean; emoji?: { id?: string | null; name?: string | null; animated?: boolean } }>;
  referenced_message?: DiscordMessage | null;
  message_reference?: { message_id?: Snowflake };
  /** Highlights the message like a Discord mention. */
  highlight?: boolean;
}

export interface TranscriptDocument {
  id: string;
  createdAt: string;
  guild: { id?: Snowflake; name: string; iconUrl?: string };
  channel: { id?: Snowflake; name: string; topic?: string; type?: number };
  messages: DiscordMessage[];
  metadata?: Record<string, unknown>;
}
