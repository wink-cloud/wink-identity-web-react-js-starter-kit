/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WINK_CLIENT_ID: string;
  readonly VITE_WINK_REALM: string;
  readonly VITE_WINK_BASE_URL: string;
  readonly VITE_WINK_AUTH_URL: string;
  readonly VITE_WINK_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
