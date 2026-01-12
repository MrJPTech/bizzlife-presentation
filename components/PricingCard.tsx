'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  period?: string;
  description?: string;
  features: PricingFeature[];
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  popular?: boolean;
  variant?: 'default' | 'gold' | 'glass';
  className?: string;
  badge?: string;
}

/**
 * PricingCard - Glass effect pricing tier card
 * Features popular highlight, discount display, and animated hover effects
 */
export function PricingCard({
  name,
  price,
  originalPrice,
  period = 'one-time',
  description,
  features,
  ctaText = 'Get Started',
  ctaHref,
  onCtaClick,
  popular = false,
  variant = 'default',
  className,
  badge,
}: PricingCardProps) {
  const variantStyles = {
    default: {
      border: popular ? 'border-accent' : 'border-white/10',
      glow: popular ? 'shadow-glow' : '',
      bg: 'bg-bg-elevated/80 backdrop-blur-sm',
      buttonBg: 'bg-accent hover:shadow-glow',
      buttonText: 'text-white',
    },
    gold: {
      border: 'border-accent-gold',
      glow: 'shadow-glow-gold',
      bg: 'bg-bg-elevated/80 backdrop-blur-sm',
      buttonBg: 'bg-accent-gold hover:shadow-glow-gold',
      buttonText: 'text-black',
    },
    glass: {
      border: popular ? 'border-accent' : 'border-white/20',
      glow: popular ? 'shadow-glow' : '',
      bg: 'bg-white/5 backdrop-blur-lg',
      buttonBg: popular ? 'bg-accent' : 'bg-white/10 hover:bg-white/20',
      buttonText: 'text-white',
    },
  };

  const styles = variantStyles[variant];

  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaHref) {
      window.location.href = ctaHref;
    }
  };

  return (
    <motion.div
      className={cn(
        'relative flex flex-col',
        'border rounded-none',
        'p-6 md:p-8',
        styles.border,
        styles.bg,
        styles.glow,
        'transition-all duration-300',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className={cn(
              'px-4 py-1',
              'text-xs font-display uppercase tracking-wider',
              variant === 'gold'
                ? 'bg-accent-gold text-black'
                : 'bg-accent text-white'
            )}
          >
            Most Popular
          </span>
        </div>
      )}

      {/* Custom Badge */}
      {badge && !popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-white/10 text-white text-xs font-display uppercase tracking-wider">
            {badge}
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="font-display text-xl md:text-2xl text-white uppercase tracking-wider mb-2">
        {name}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-text-secondary text-sm mb-6">{description}</p>
      )}

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          {originalPrice && (
            <span className="text-text-muted line-through text-lg">
              ${originalPrice}
            </span>
          )}
          <span
            className={cn(
              'font-display text-4xl md:text-5xl',
              variant === 'gold' ? 'text-accent-gold' : 'text-white'
            )}
          >
            ${price}
          </span>
        </div>
        <span className="text-text-secondary text-sm uppercase tracking-wider">
          {period}
        </span>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-8">
        {features.map((feature, index) => (
          <li
            key={index}
            className={cn(
              'flex items-start gap-3',
              !feature.included && 'opacity-40'
            )}
          >
            {feature.included ? (
              <svg
                className={cn(
                  'w-5 h-5 flex-shrink-0 mt-0.5',
                  feature.highlight
                    ? variant === 'gold'
                      ? 'text-accent-gold'
                      : 'text-accent'
                    : 'text-white'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span
              className={cn(
                'text-sm',
                feature.highlight
                  ? 'text-white font-medium'
                  : 'text-text-secondary'
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        onClick={handleClick}
        className={cn(
          'w-full py-4',
          'font-display text-base uppercase tracking-wider',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
          variant === 'gold'
            ? 'focus:ring-accent-gold'
            : 'focus:ring-accent',
          styles.buttonBg,
          styles.buttonText
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {ctaText}
      </motion.button>
    </motion.div>
  );
}

// Pricing Grid wrapper
export function PricingGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-6 md:gap-8',
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        'max-w-6xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

// Example PleaseListenToMyMusic pricing
export function SubmissionPricingCard() {
  return (
    <PricingCard
      name="Music Submission"
      price={5}
      period="per track"
      description="Get your music heard by industry professionals"
      features={[
        { text: 'Professional A&R review', included: true, highlight: true },
        { text: 'Genre-specific feedback', included: true },
        { text: 'Response within 14 days', included: true },
        { text: 'Secure file handling', included: true },
        { text: 'Consideration for label signing', included: true, highlight: true },
      ]}
      ctaText="Submit Your Track"
      popular
    />
  );
}

export default PricingCard;
