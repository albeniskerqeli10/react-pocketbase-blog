import { UploadClient } from '@uploadcare/upload-client';

export const client = new UploadClient({ publicKey: import.meta.env.VITE_UPLOAD_PUBLIC_KEY });
