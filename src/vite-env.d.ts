/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_MFA_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
