import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  FileText,
  FileVideo,
  ImagePlus,
  Loader2,
  Paperclip,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import type { MediaFile, VideoAsset } from '../../types/instructor';
import {
  clearPreview,
  formatBytes,
  formatClock,
  getPreview,
  processThumbnail,
  setPreview,
  toVideoAsset,
  uploadFile,
  validateImage,
  validateResource,
  validateVideo,
  type UploadHandle,
} from '../../lib/courseMedia';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';

/* ------------------------------------------------------------------ */
/*  Drop zone                                                          */
/* ------------------------------------------------------------------ */

interface DropZoneProps {
  accept: string;
  onFile: (file: File) => void;
  /** Accessible label for the hidden file input */
  label: string;
  children: ReactNode;
  className?: string;
  invalid?: boolean;
}

/** Drag-and-drop target with a "Browse Files" fallback. Touch devices use the button. */
export function DropZone({ accept, onFile, label, children, className, invalid }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOver(false);
    const file = event.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={(event) => {
        if (![...event.dataTransfer.types].includes('Files')) return;
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors',
        over
          ? 'border-brand-400 bg-brand-50/70'
          : invalid
            ? 'border-rose-300 bg-rose-50/40'
            : 'border-line-strong bg-canvas/60 hover:border-brand-200',
        className,
      )}
    >
      {children}
      <Button variant="secondary" size="sm" className="mt-4" onClick={() => inputRef.current?.click()}>
        Browse Files
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        aria-label={label}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = '';
        }}
      />
    </div>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
      <AlertCircle aria-hidden className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Thumbnail                                                          */
/* ------------------------------------------------------------------ */

export function ThumbnailUpload({
  value,
  onChange,
  invalid,
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  invalid?: boolean;
}) {
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const replaceRef = useRef<HTMLInputElement>(null);

  const accept = async (file: File) => {
    const problem = validateImage(file);
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      onChange(await processThumbnail(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That image could not be used.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <img src={value} alt="Course thumbnail preview" className="aspect-video w-full object-cover" />
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-xs text-muted">1280 × 720 · saved with your draft</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => replaceRef.current?.click()}>
                Change Image
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={() => onChange(undefined)}
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                Remove
              </Button>
            </div>
            <input
              ref={replaceRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Choose a new thumbnail"
              className="sr-only"
              tabIndex={-1}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void accept(file);
                event.target.value = '';
              }}
            />
          </div>
        </div>
      ) : (
        <DropZone
          accept="image/jpeg,image/png,image/webp"
          label="Upload course thumbnail"
          onFile={(file) => void accept(file)}
          invalid={invalid}
          className="min-h-56 sm:min-h-64"
        >
          <span className="grid size-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-xs ring-1 ring-line">
            {busy ? (
              <Loader2 aria-hidden className="size-6 animate-spin" />
            ) : (
              <ImagePlus aria-hidden className="size-6" strokeWidth={1.8} />
            )}
          </span>
          <p className="mt-4 font-semibold text-ink">Drag &amp; drop your image here</p>
          <p className="mt-1 text-sm text-muted">or</p>
          <p className="mt-3 text-xs text-muted">Recommended size: 1280 × 720 · Supported: JPG, PNG, WEBP</p>
        </DropZone>
      )}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Video                                                              */
/* ------------------------------------------------------------------ */

interface VideoUploadProps {
  /** Key for the in-memory preview (e.g. the lesson id) */
  previewKey: string;
  value?: VideoAsset;
  onChange: (video: VideoAsset | undefined) => void;
  emptyText?: string;
  invalid?: boolean;
  /** Called with true while an upload is running */
  onBusyChange?: (busy: boolean) => void;
}

/** Select → simulated upload with progress → preview with duration. */
export function VideoUpload({ previewKey, value, onChange, emptyText, invalid, onBusyChange }: VideoUploadProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState(() => getPreview(previewKey));
  const handleRef = useRef<UploadHandle | null>(null);

  useEffect(() => () => handleRef.current?.cancel(), []);

  const start = async (file: File) => {
    const problem = validateVideo(file);
    setError(problem);
    if (problem) return;
    handleRef.current?.cancel();
    setFileName(file.name);
    setProgress(0);
    onBusyChange?.(true);
    const handle = uploadFile(file, setProgress);
    handleRef.current = handle;
    try {
      const uploaded = await handle.promise;
      const asset = await toVideoAsset(file, uploaded);
      setPreview(previewKey, file);
      setPreviewUrl(getPreview(previewKey));
      onChange(asset);
    } catch {
      // Cancelled
    } finally {
      setProgress(null);
      handleRef.current = null;
      onBusyChange?.(false);
    }
  };

  const cancel = () => {
    handleRef.current?.cancel();
    setProgress(null);
    onBusyChange?.(false);
  };

  const remove = () => {
    clearPreview(previewKey);
    setPreviewUrl(undefined);
    onChange(undefined);
  };

  if (progress !== null) {
    return (
      <div className="rounded-2xl border border-line bg-white p-4" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <UploadCloud aria-hidden className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{fileName}</p>
            <p className="text-xs text-muted">Uploading… {progress}%</p>
          </div>
          <button
            type="button"
            onClick={cancel}
            aria-label="Cancel upload"
            className="grid size-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
        <div
          role="progressbar"
          aria-label={`Uploading ${fileName}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="mt-3 h-2 overflow-hidden rounded-full bg-brand-50"
        >
          <motion.div
            className="h-full rounded-full bg-brand-gradient"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.12 }}
          />
        </div>
      </div>
    );
  }

  if (value) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {previewUrl ? (
          <video src={previewUrl} controls preload="metadata" className="aspect-video w-full bg-night" />
        ) : (
          <div className="grid aspect-video w-full place-items-center bg-night px-6 text-center text-sm text-slate-300">
            <span>
              <FileVideo aria-hidden className="mx-auto mb-2 size-7 text-slate-400" />
              Preview isn’t kept after a reload in this demo. Select the file again to watch it.
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{value.name}</p>
            <p className="text-xs text-muted">
              Duration {formatClock(value.durationSeconds)} · {formatBytes(value.size)}
            </p>
          </div>
          <div className="flex gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-line-strong bg-white px-4 text-sm font-semibold text-ink shadow-xs transition-colors hover:border-brand-200 hover:bg-brand-50/60 hover:text-brand-700 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100">
              <RefreshCw aria-hidden className="size-4" />
              Replace
              <input
                type="file"
                accept="video/mp4,video/webm"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void start(file);
                  event.target.value = '';
                }}
              />
            </label>
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={remove}
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              Remove
            </Button>
          </div>
        </div>
        {error && (
          <div className="px-4 pb-3">
            <ErrorText>{error}</ErrorText>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <DropZone
        accept="video/mp4,video/webm"
        label="Upload video"
        onFile={(file) => void start(file)}
        invalid={invalid}
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-xs ring-1 ring-line">
          <FileVideo aria-hidden className="size-6" strokeWidth={1.8} />
        </span>
        <p className="mt-3 font-semibold text-ink">Upload / Select Video</p>
        {emptyText && <p className="mt-1 max-w-sm text-sm text-muted">{emptyText}</p>}
        <p className="mt-2 text-xs text-muted">Supported: MP4, WebM</p>
      </DropZone>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Attachments                                                        */
/* ------------------------------------------------------------------ */

interface FileAttachmentsProps {
  files: MediaFile[];
  /** Receives the updated list; `add` is relative to the latest list, so concurrent edits aren't lost */
  onChange: (update: (current: MediaFile[]) => MediaFile[]) => void;
  onBusyChange?: (busy: boolean) => void;
}

export function FileAttachments({ files, onChange, onBusyChange }: FileAttachmentsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const [uploading, setUploading] = useState<{ name: string; progress: number } | null>(null);

  const add = async (file: File) => {
    const problem = validateResource(file);
    setError(problem);
    if (problem) return;
    setUploading({ name: file.name, progress: 0 });
    onBusyChange?.(true);
    const handle = uploadFile(file, (progress) => setUploading({ name: file.name, progress }));
    try {
      const uploaded = await handle.promise;
      onChange((current) => [...current, uploaded]);
    } finally {
      setUploading(null);
      onBusyChange?.(false);
    }
  };

  return (
    <div>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {files.map((file, index) => (
            <motion.li
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 overflow-hidden rounded-xl border border-line bg-white px-3 py-2.5"
            >
              <FileText aria-hidden className="size-4 shrink-0 text-brand-600" />
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{file.name}</span>
              <span className="shrink-0 text-xs text-muted">{formatBytes(file.size)}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => onChange((current) => current.filter((_, i) => i !== index))}
                className="grid size-7 shrink-0 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600"
              >
                <X aria-hidden className="size-4" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
        {uploading && (
          <li className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-muted" aria-live="polite">
            Uploading {uploading.name}… {uploading.progress}%
          </li>
        )}
      </ul>
      <Button
        variant="secondary"
        size="sm"
        icon={Paperclip}
        className="mt-3"
        onClick={() => inputRef.current?.click()}
        disabled={!!uploading}
      >
        Attach File
      </Button>
      <span className="ml-3 text-xs text-muted">PDF, ZIP or DOCX</span>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.zip,.docx,application/pdf,application/zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        aria-label="Attach a resource file"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void add(file);
          event.target.value = '';
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
