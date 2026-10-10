/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly WP_API_URL?: string;
  readonly USE_FIXTURE_CONTENT?: string;
  readonly PUBLIC_GOOGLE_MAPS_EMBED_URL?: string;
  readonly PUBLIC_MENU_ENABLED?: string;
  readonly PREVIEW_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
