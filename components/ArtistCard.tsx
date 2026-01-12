'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ArtistCardProps {
  name: string;
  image: string;
  genres?: string[];
  streamCount?: number;
  href: string;
  featured?: boolean;
  className?: string;
}

/**
 * ArtistCard - Artist showcase with dramatic hover effects
 * Features grayscale to color transition, gradient overlay, and glow border
 */
export function ArtistCard({
  name,
  image,
  genres = [],
  streamCount,
  href,
  featured = false,
  className,
}: ArtistCardProps) {
  const formatStreamCount = (count: number): string => {
    if (count >= 1_000_000_000) {
      return `${(count / 1_000_000_000).toFixed(1)}B`;
    }
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1)}M`;
    }
    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Link href={href} className="block">
      <motion.article
        className={cn(
          'relative overflow-hidden',
          // 3:4 portrait aspect ratio
          'aspect-[3/4]',
          // Base styling
          'bg-bg-elevated',
          'group cursor-pointer',
          featured && 'ring-2 ring-accent',
          className
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={name}
            fill
            className={cn(
              'object-cover',
              // Grayscale by default, color on hover
              'grayscale group-hover:grayscale-0',
              'transition-all duration-500 ease-out',
              // Scale up slightly on hover
              'group-hover:scale-105'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Gradient Overlay - stronger at bottom */}
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-t from-black via-black/40 to-transparent',
            'opacity-80 group-hover:opacity-90',
            'transition-opacity duration-300'
          )}
        />

        {/* Glow Border on Hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 1,
            boxShadow: '0 0 30px rgba(255, 0, 64, 0.5), inset 0 0 30px rgba(255, 0, 64, 0.1)',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 bg-accent text-white text-xs font-display uppercase tracking-wider">
              Featured
            </span>
          </div>
        )}

        {/* Content - Bottom positioned */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-xs text-text-secondary uppercase tracking-wider"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Artist Name */}
          <h3
            className={cn(
              'font-display uppercase text-white',
              'text-2xl md:text-3xl lg:text-4xl',
              'leading-none tracking-tight',
              // Glow text effect on hover
              'group-hover:text-shadow-glow',
              'transition-all duration-300'
            )}
            style={{
              textShadow: 'var(--tw-shadow, none)',
            }}
          >
            {name}
          </h3>

          {/* Stream Count */}
          {streamCount && (
            <div className="mt-2 flex items-center gap-2">
              {/* Spotify Icon */}
              <svg
                className="w-4 h-4 text-[#1DB954]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span className="text-sm text-text-secondary">
                {formatStreamCount(streamCount)} streams
              </span>
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}

export default ArtistCard;
