import type { MediaFile, VideoAsset } from '../types/instructor';

/*
 * Media handling for the course builder. Uploads are simulated: files never leave the browser.
 * To connect a real media service, replace `uploadFile` (and keep the same return shape) — the UI only
 * depends on these functions.
 */

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const RESOURCE_EXTENSIONS = ['pdf', 'zip', 'docx'];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;
export const MAX_RESOURCE_BYTES = 50 * 1024 * 1024;

const extension = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

/** 504 → "08:24", 3725 → "1:02:05" */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export function validateImage(file: File): string | undefined {
  if (!IMAGE_TYPES.includes(file.type)) return 'Use a JPG, PNG or WEBP image.';
  if (file.size > MAX_IMAGE_BYTES) return `Images must be under ${formatBytes(MAX_IMAGE_BYTES)}.`;
  return undefined;
}

export function validateVideo(file: File): string | undefined {
  if (!VIDEO_TYPES.includes(file.type)) return 'Use an MP4 or WebM video.';
  if (file.size > MAX_VIDEO_BYTES) return `Videos must be under ${formatBytes(MAX_VIDEO_BYTES)}.`;
  return undefined;
}

export function validateResource(file: File): string | undefined {
  if (!RESOURCE_EXTENSIONS.includes(extension(file.name))) return 'Attach a PDF, ZIP or DOCX file.';
  if (file.size > MAX_RESOURCE_BYTES) return `Files must be under ${formatBytes(MAX_RESOURCE_BYTES)}.`;
  return undefined;
}

/**
 * Resizes and crops an image to 1280×720 (16:9) and returns a JPEG data URL. Keeping thumbnails small
 * lets drafts fit in localStorage.
 */
export function processThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const width = 1280;
      const height = 720;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas unavailable'));
        return;
      }
      // "cover" crop around the centre
      const scale = Math.max(width / img.width, height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That image could not be read.'));
    };
    img.src = url;
  });
}

/** Video length in seconds, read from the file's metadata. */
export function readVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    video.src = url;
  });
}

/*
 * Local previews. Videos are far too large for localStorage, so their object URLs live only for this
 * browser session, keyed by an asset id. After a reload the metadata remains and the preview asks for
 * the file again.
 */
const previews = new Map<string, string>();

export function setPreview(key: string, file: File) {
  const existing = previews.get(key);
  if (existing) URL.revokeObjectURL(existing);
  previews.set(key, URL.createObjectURL(file));
}

export const getPreview = (key: string) => previews.get(key);

export function clearPreview(key: string) {
  const existing = previews.get(key);
  if (existing) URL.revokeObjectURL(existing);
  previews.delete(key);
}

export interface UploadHandle {
  promise: Promise<MediaFile>;
  cancel: () => void;
}

/**
 * Simulated upload with progress (≈1.5–4 s depending on size). Swap for a real request
 * (e.g. XMLHttpRequest with upload.onprogress) when a media API exists.
 */
export function uploadFile(file: File, onProgress: (percent: number) => void): UploadHandle {
  let timer = 0;
  let cancelled = false;
  const duration = Math.min(4000, 1500 + (file.size / (1024 * 1024)) * 40);
  const promise = new Promise<MediaFile>((resolve, reject) => {
    const started = performance.now();
    const tick = () => {
      if (cancelled) {
        reject(new Error('Upload cancelled'));
        return;
      }
      const percent = Math.min(100, ((performance.now() - started) / duration) * 100);
      onProgress(Math.round(percent));
      if (percent >= 100) resolve({ name: file.name, size: file.size, type: file.type });
      else timer = window.setTimeout(tick, 80);
    };
    tick();
  });
  return {
    promise,
    cancel: () => {
      cancelled = true;
      window.clearTimeout(timer);
    },
  };
}

export async function toVideoAsset(file: File, uploaded: MediaFile): Promise<VideoAsset> {
  return { ...uploaded, durationSeconds: Math.round(await readVideoDuration(file)) };
}
