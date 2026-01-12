'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  title: string;
  artist?: string;
  coverImage?: string;
  waveformData?: number[]; // Pre-generated waveform data (0-1 values)
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

/**
 * AudioPlayer - Custom audio player with waveform visualization
 * Features play/pause, progress seek, time display, and waveform
 * Note: For full waveform visualization, integrate with WaveSurfer.js
 */
export function AudioPlayer({
  src,
  title,
  artist,
  coverImage,
  waveformData,
  className,
  onPlay,
  onPause,
  onEnded,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Generate placeholder waveform if none provided
  const waveform = waveformData || Array.from({ length: 50 }, () => Math.random() * 0.5 + 0.3);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      onPause?.();
    } else {
      audio.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, onPlay, onPause]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  }, [duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      className={cn(
        'bg-bg-elevated rounded-none',
        'p-4 md:p-6',
        'border border-white/10',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-4">
        {/* Cover Image */}
        {coverImage && (
          <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
            <img
              src={coverImage}
              alt={`${title} cover`}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <motion.div
                className="absolute inset-0 border-2 border-accent"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        )}

        {/* Controls & Info */}
        <div className="flex-1 min-w-0">
          {/* Title & Artist */}
          <div className="mb-3">
            <h4 className="font-display text-white text-lg md:text-xl truncate uppercase">
              {title}
            </h4>
            {artist && (
              <p className="text-text-secondary text-sm truncate">{artist}</p>
            )}
          </div>

          {/* Waveform Progress */}
          <div
            ref={progressRef}
            className="relative h-12 cursor-pointer group"
            onClick={handleSeek}
          >
            {/* Waveform Bars */}
            <div className="absolute inset-0 flex items-center gap-[2px]">
              {waveform.map((height, index) => {
                const barProgress = (index / waveform.length) * 100;
                const isActive = barProgress <= progress;

                return (
                  <motion.div
                    key={index}
                    className={cn(
                      'flex-1 rounded-full transition-colors duration-100',
                      isActive ? 'bg-accent' : 'bg-white/20 group-hover:bg-white/30'
                    )}
                    style={{ height: `${height * 100}%` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.01, duration: 0.2 }}
                  />
                );
              })}
            </div>

            {/* Progress Overlay Glow */}
            <div
              className="absolute top-0 left-0 h-full pointer-events-none"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, transparent 80%, rgba(255, 0, 64, 0.3) 100%)',
              }}
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-text-muted text-xs font-mono">
              {formatTime(currentTime)}
            </span>
            <span className="text-text-muted text-xs font-mono">
              {isLoading ? '--:--' : formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <motion.button
          onClick={togglePlay}
          className={cn(
            'w-14 h-14 md:w-16 md:h-16 flex-shrink-0',
            'flex items-center justify-center',
            'bg-accent hover:shadow-glow',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <svg className="w-6 h-6 animate-spin text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : isPlaying ? (
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// Compact variant for lists
export function AudioPlayerCompact({
  src,
  title,
  artist,
  className,
}: Omit<AudioPlayerProps, 'coverImage' | 'waveformData'>) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3',
        'bg-bg-elevated border border-white/5',
        'hover:border-white/20 transition-colors',
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        className={cn(
          'w-10 h-10 flex items-center justify-center',
          'bg-accent/20 hover:bg-accent/40',
          'transition-colors duration-200'
        )}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-accent ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{title}</p>
        {artist && <p className="text-text-muted text-xs truncate">{artist}</p>}
      </div>

      {/* Progress Bar */}
      <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
