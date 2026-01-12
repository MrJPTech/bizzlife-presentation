'use client';

import { motion } from 'framer-motion';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants = {
  primary: {
    base: 'bg-accent text-white',
    hover: 'hover:shadow-glow',
    glow: 'rgba(255, 0, 64, 0.5)',
  },
  secondary: {
    base: 'bg-accent-secondary text-white',
    hover: 'hover:shadow-[0_0_30px_rgba(255,107,53,0.5)]',
    glow: 'rgba(255, 107, 53, 0.5)',
  },
  outline: {
    base: 'bg-transparent border-2 border-accent text-accent',
    hover: 'hover:bg-accent/10 hover:shadow-glow',
    glow: 'rgba(255, 0, 64, 0.3)',
  },
  gold: {
    base: 'bg-accent-gold text-black',
    hover: 'hover:shadow-glow-gold',
    glow: 'rgba(255, 215, 0, 0.5)',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-sm min-h-[44px]',
  md: 'px-6 py-3 text-base min-h-[48px]',
  lg: 'px-8 py-4 text-lg min-h-[52px]',
};

/**
 * GlowButton - Primary CTA with neon glow effect
 * Record label aesthetic with sharp edges and dramatic hover states
 */
export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = variants[variant];
    const sizeStyles = sizes[size];

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2',
          'font-display uppercase tracking-wider',
          'transition-all duration-300 ease-out',
          // Sharp edges for confidence
          'rounded-none',
          // Variants and sizes
          variantStyles.base,
          variantStyles.hover,
          sizeStyles,
          // States
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black',
          className
        )}
        disabled={disabled || isLoading}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
        {...props}
      >
        {/* Animated glow border on hover */}
        <motion.span
          className="absolute inset-0 rounded-none"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 1,
            boxShadow: [
              `0 0 20px ${variantStyles.glow}`,
              `0 0 40px ${variantStyles.glow}`,
              `0 0 20px ${variantStyles.glow}`,
            ],
            transition: {
              duration: 1.5,
              repeat: Infinity,
            },
          }}
        />

        {/* Content */}
        <span className="relative flex items-center gap-2">
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <>
              {leftIcon}
              {children}
              {rightIcon}
            </>
          )}
        </span>
      </motion.button>
    );
  }
);

GlowButton.displayName = 'GlowButton';

export default GlowButton;
