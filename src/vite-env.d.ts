/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly POCKETBASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
