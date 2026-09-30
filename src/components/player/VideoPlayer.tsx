import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Captions,
  CaptionsOff,
  Check,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { formatClock } from '../../lib/format';
import { SmartImage } from '../ui/SmartImage';

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;
export const QUALITIES = ['Auto', '1080p', '720p', '480p'] as const;

export interface VideoPlayerHandle {
  togglePlay: () => void;
  seekBy: (seconds: number) => void;
  toggleFullscreen: () => void;
  toggleMute: () => void;
}

interface VideoPlayerProps {
  /** Changes whenever a different lesson loads; resets playback */
  lessonId: string;
  title: string;
  sectionLabel: string;
  posterId: string;
  /** Lesson length in seconds */
  duration: number;
  /** Resume point in seconds */
  startAt: number;
  hasNext: boolean;
  /** Called about every 5 seconds of playback, and on pause */
  onPositionChange: (seconds: number) => void;
  onEnded: () => void;
  onNext: () => void;
}

const TICK_MS = 250;

/**
 * Demo video player: a real playback clock and full controls over a still frame, until video
 * streaming is available. Keyboard shortcuts are wired up by the page through the imperative handle.
 */
export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(function VideoPlayer(
  { lessonId, title, sectionLabel, posterId, duration, startAt, hasNext, onPositionChange, onEnded, onNext },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(startAt);
  const [ended, setEnded] = useState(false);
  const [speed, setSpeed] = useState<(typeof PLAYBACK_SPEEDS)[number]>(1);
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>('Auto');
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<number | undefined>(undefined);

  // New lesson: reset playback to its resume point.
  useEffect(() => {
    setPlaying(false);
    setEnded(false);
    setTime(startAt >= duration - 3 ? 0 : startAt);
    // Deliberately keyed on the lesson only.
  }, [lessonId]);

  // Playback clock.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTime((t) => Math.min(duration, t + (TICK_MS / 1000) * speed)), TICK_MS);
    return () => window.clearInterval(id);
  }, [playing, speed, duration]);

  // Reaching the end completes the lesson.
  useEffect(() => {
    if (playing && time >= duration) {
      setPlaying(false);
      setEnded(true);
      onPositionChange(0);
      onEnded();
    }
  }, [time, duration, playing, onEnded, onPositionChange]);

  // Save the resume point every 5 seconds of playback.
  const bucket = Math.floor(time / 5);
  useEffect(() => {
    if (playing) onPositionChange(time);
    // Keyed on `bucket` so it runs once per 5 seconds, not on every tick.
  }, [bucket]);

  // Controls fade out after a short period of inactivity while playing.
  const revealControls = useCallback(() => {
    setControlsVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 2500);
  }, []);
  useEffect(() => () => window.clearTimeout(hideTimer.current), []);
  const showControls = !playing || controlsVisible || settingsOpen;

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const togglePlay = useCallback(() => {
    setSettingsOpen(false);
    if (ended || time >= duration) {
      setTime(0);
      setEnded(false);
      setPlaying(true);
      return;
    }
    setPlaying((value) => {
      if (value) onPositionChange(time);
      return !value;
    });
    revealControls();
  }, [ended, time, duration, onPositionChange, revealControls]);

  const seekTo = useCallback(
    (seconds: number) => {
      setTime(Math.max(0, Math.min(duration - 0.5, seconds)));
      setEnded(false);
      revealControls();
    },
    [duration, revealControls],
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void containerRef.current?.requestFullscreen?.();
  }, []);

  const toggleMute = useCallback(() => setMuted((value) => !value), []);

  useImperativeHandle(
    ref,
    () => ({ togglePlay, seekBy: (s: number) => seekTo(time + s), toggleFullscreen, toggleMute }),
    [togglePlay, seekTo, time, toggleFullscreen, toggleMute],
  );

  const effectiveVolume = muted ? 0 : volume;
  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;
  const progress = (time / duration) * 100;
  const rangeStyle = (value: number): CSSProperties => ({
    background: `linear-gradient(to right, #818cf8 ${value}%, rgba(255,255,255,0.28) ${value}%)`,
  });
  const rangeClass =
    'h-1.5 cursor-pointer appearance-none rounded-full outline-none ' +
    '[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow ' +
    '[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white ' +
    'focus-visible:ring-2 focus-visible:ring-white/70';
  const controlButton =
    'grid size-9 shrink-0 place-items-center rounded-lg text-white/90 transition-colors hover:bg-white/15 hover:text-white sm:size-10';

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={`Video player: ${title}`}
      onMouseMove={revealControls}
      onMouseLeave={() => playing && setControlsVisible(false)}
      className={cn(
        'group/player relative aspect-video w-full overflow-hidden bg-black select-none',
        fullscreen ? 'rounded-none' : 'sm:rounded-2xl',
        !showControls && 'cursor-none',
      )}
    >
      {/* Frame: course image with a slow drift while "playing" */}
      <motion.div
        className="absolute inset-0"
        animate={playing ? { scale: 1.08 } : { scale: 1.02 }}
        transition={{ duration: playing ? 20 : 0.6, ease: 'linear' }}
      >
        <SmartImage photoId={posterId} alt="" width={1280} ratio={16 / 9} widths={[960, 1280, 1920]} sizes="100vw" priority className="size-full" />
      </motion.div>
      <div aria-hidden className={cn('absolute inset-0 transition-colors duration-500', playing ? 'bg-black/35' : 'bg-[#0B1220]/65')} />

      {/* Click anywhere to play/pause */}
      <button
        type="button"
        aria-label={playing ? 'Pause' : 'Play'}
        onClick={togglePlay}
        className="absolute inset-0 z-0 cursor-[inherit] focus:outline-none"
      />

      <span className="pointer-events-none absolute top-3 right-3 rounded-md bg-black/45 px-2 py-1 text-[10px] font-semibold tracking-wider text-white/80 uppercase backdrop-blur sm:top-4 sm:right-4">
        Demo
      </span>

      {/* Paused: title + big play button */}
      <AnimatePresence>
        {!playing && !ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            {/* Small screens show the title just below the player instead, leaving room for the controls. */}
            <p className="text-xs font-semibold tracking-[0.14em] text-white/70 uppercase max-sm:hidden">{sectionLabel}</p>
            <p className="mt-2 max-w-xl font-display text-2xl leading-snug font-bold text-white max-sm:hidden lg:text-[1.75rem]">{title}</p>
            <span className="-mt-6 grid size-14 place-items-center sm:mt-7 sm:size-20 rounded-full bg-white text-brand-600 shadow-[0_18px_40px_-10px_rgb(0_0_0/0.6)] transition-transform group-hover/player:scale-105">
              <Play aria-hidden className="ml-1 size-6 sm:size-9" fill="currentColor" strokeWidth={0} />
            </span>
            {time > 1 && <p className="mt-4 text-xs font-medium text-white/75 max-sm:hidden">Resume from {formatClock(time)}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ended */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0B1220]/85 px-6 text-center"
          >
            <span className="grid size-12 place-items-center rounded-full bg-emerald-500 text-white sm:size-14">
              <Check aria-hidden className="size-6 sm:size-7" strokeWidth={3} />
            </span>
            <p className="mt-4 font-display text-lg font-bold text-white sm:text-xl">Lesson complete</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={togglePlay} className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white/20">
                <RotateCcw aria-hidden className="size-4" /> Replay
              </button>
              {hasNext && (
                <button type="button" onClick={onNext} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand">
                  Next Lesson <SkipForward aria-hidden className="size-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Captions */}
      {captions && playing && (
        <p className="pointer-events-none absolute inset-x-0 bottom-20 z-10 mx-auto w-fit max-w-[85%] rounded-md bg-black/70 px-3 py-1.5 text-center text-xs text-white sm:bottom-24 sm:text-sm">
          [Demo captions] {title}
        </p>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/85 via-black/45 to-transparent px-3 pt-10 pb-2 transition-opacity duration-300 sm:px-4 sm:pb-3',
          showControls ? 'opacity-100' : 'pointer-events-none opacity-0',
          ended && 'hidden',
        )}
      >
        <input
          type="range"
          min={0}
          max={duration}
          step={1}
          value={Math.floor(time)}
          onChange={(e) => seekTo(Number(e.target.value))}
          aria-label="Seek"
          aria-valuetext={`${formatClock(time)} of ${formatClock(duration)}`}
          className={cn(rangeClass, 'w-full')}
          style={rangeStyle(progress)}
        />
        <div className="mt-1.5 flex items-center gap-0.5 sm:gap-1">
          <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause (Space)' : 'Play (Space)'} className={controlButton}>
            {playing ? <Pause aria-hidden className="size-5" fill="currentColor" strokeWidth={0} /> : <Play aria-hidden className="size-5" fill="currentColor" strokeWidth={0} />}
          </button>
          <button type="button" onClick={() => seekTo(time - 10)} aria-label="Back 10 seconds" className={cn(controlButton, 'max-[359px]:hidden')}>
            <RotateCcw aria-hidden className="size-[18px]" />
          </button>
          <button type="button" onClick={() => seekTo(time + 10)} aria-label="Forward 10 seconds" className={cn(controlButton, 'max-[359px]:hidden')}>
            <RotateCw aria-hidden className="size-[18px]" />
          </button>
          <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className={controlButton}>
            <VolumeIcon aria-hidden className="size-5" />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={effectiveVolume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setMuted(Number(e.target.value) === 0);
            }}
            aria-label="Volume"
            className={cn(rangeClass, 'mr-2 hidden w-20 sm:block')}
            style={rangeStyle(effectiveVolume * 100)}
          />
          <span className="ml-1 text-xs font-medium whitespace-nowrap text-white/90 tabular-nums sm:text-sm">
            {formatClock(time)} <span className="text-white/50">/ {formatClock(duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            {speed !== 1 && <span className="hidden rounded bg-white/15 px-1.5 py-0.5 text-[11px] font-semibold text-white sm:inline">{speed}x</span>}
            <button
              type="button"
              onClick={() => setCaptions((value) => !value)}
              aria-label={captions ? 'Turn captions off' : 'Turn captions on'}
              aria-pressed={captions}
              className={cn(controlButton, 'max-[389px]:hidden')}
            >
              {captions ? <Captions aria-hidden className="size-5" /> : <CaptionsOff aria-hidden className="size-5 opacity-70" />}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen((value) => !value)}
                aria-label="Settings"
                aria-expanded={settingsOpen}
                className={controlButton}
              >
                <Settings aria-hidden className={cn('size-5 transition-transform duration-300', settingsOpen && 'rotate-45')} />
              </button>
              <AnimatePresence>
                {settingsOpen && (
                  <motion.div
                    role="dialog"
                    aria-label="Playback settings"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.stopPropagation();
                        setSettingsOpen(false);
                      }
                    }}
                    className="absolute right-0 bottom-full mb-2 w-60 rounded-xl bg-[#111827]/95 p-3 text-sm text-white shadow-2xl ring-1 ring-white/10 backdrop-blur"
                  >
                    <p className="px-1 text-[11px] font-semibold tracking-wider text-white/50 uppercase">Playback speed</p>
                    <div className="mt-1.5 grid grid-cols-5 gap-1">
                      {PLAYBACK_SPEEDS.map((value) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={speed === value}
                          onClick={() => setSpeed(value)}
                          className={cn('rounded-md py-1.5 text-xs font-semibold transition-colors', speed === value ? 'bg-brand-500 text-white' : 'text-white/80 hover:bg-white/10')}
                        >
                          {value}x
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 px-1 text-[11px] font-semibold tracking-wider text-white/50 uppercase">Quality</p>
                    <div className="mt-1.5 grid grid-cols-4 gap-1">
                      {QUALITIES.map((value) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={quality === value}
                          onClick={() => setQuality(value)}
                          className={cn('rounded-md py-1.5 text-xs font-semibold transition-colors', quality === value ? 'bg-brand-500 text-white' : 'text-white/80 hover:bg-white/10')}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-lg px-1 py-1">
                      <span className="text-[11px] font-semibold tracking-wider text-white/50 uppercase">Captions</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={captions}
                        aria-label="Captions"
                        onClick={() => setCaptions((value) => !value)}
                        className={cn('relative inline-flex h-6 w-10 items-center rounded-full transition-colors', captions ? 'bg-brand-500' : 'bg-white/25')}
                      >
                        <span className={cn('inline-block size-4 rounded-full bg-white transition-transform', captions ? 'translate-x-5' : 'translate-x-1')} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'} className={controlButton}>
              {fullscreen ? <Minimize aria-hidden className="size-5" /> : <Maximize aria-hidden className="size-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
