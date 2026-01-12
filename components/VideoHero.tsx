'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VideoHeroProps {
  videoSrc: string;
  fallbackImage: string;
  overlay?: number; // 0-1, default 0.6
  children: ReactNode;
  className?: string;
  muted?: boolean;
  loop?: boolean;
}

/**
 * VideoHero - Full viewport hero with looping video background
 * Features gradient overlay, centered content, and mobile image fallback
 */
export function VideoHero({
  videoSrc,
  fallbackImage,
  overlay = 0.6,
  children,
  className,
  muted = true,
  loop = true,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile for performance
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && !isMobile) {
      video.play().catch(() => {
        // Autoplay failed, fallback to image
        setIsVideoLoaded(false);
      });
    }
  }, [isMobile]);

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      className={cn(
        'relative w-full h-screen min-h-[600px] max-h-[1200px]',
        'flex items-center justify-center',
        'overflow-hidden',
        className
      )}
    >
      {/* Video Background (Desktop) */}
      {!isMobile && (
        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            'transition-opacity duration-1000',
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          )}
          src={videoSrc}
          muted={muted}
          loop={loop}
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
        />
      )}

      {/* Fallback Image (Mobile or video not loaded) */}
      <div
        className={cn(
          'absolute inset-0 w-full h-full',
          'bg-cover bg-center bg-no-repeat',
          !isMobile && isVideoLoaded ? 'opacity-0' : 'opacity-100',
          'transition-opacity duration-1000'
        )}
        style={{ backgroundImage: `url(${fallbackImage})` }}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(0, 0, 0, ${overlay * 0.8}) 0%,
            rgba(0, 0, 0, ${overlay * 0.4}) 50%,
            rgba(0, 0, 0, ${overlay}) 100%
          )`,
        }}
      />

      {/* Vignette Effect */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(0, 0, 0, 0.4) 100%
          )`,
        }}
      />

      {/* Content */}
      <motion.div
        className={cn(
          'relative z-20',
          'text-center px-4 md:px-8',
          'max-w-5xl mx-auto'
        )}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Wrap children in motion.div for staggered animation */}
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <motion.div key={index} variants={childVariants}>
              {child}
            </motion.div>
          ))
        ) : (
          <motion.div variants={childVariants}>{children}</motion.div>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-accent rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Example usage component for hero headline
export function HeroHeadline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        'font-display uppercase',
        'text-5xl md:text-7xl lg:text-9xl',
        'text-white leading-none tracking-tight',
        'mb-4',
        className
      )}
      style={{
        textShadow: '0 0 60px rgba(255, 0, 64, 0.3)',
      }}
    >
      {children}
    </h1>
  );
}

export function HeroSubheadline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'font-body text-text-secondary',
        'text-lg md:text-xl lg:text-2xl',
        'uppercase tracking-[0.3em]',
        'mb-8',
        className
      )}
    >
      {children}
    </p>
  );
}

export default VideoHero;
