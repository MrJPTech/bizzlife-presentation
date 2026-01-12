'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  logo?: React.ReactNode;
}

/**
 * MobileNavDrawer - Full-screen mobile navigation
 * Features slide animation, backdrop blur, and staggered link animations
 */
export function MobileNavDrawer({
  open,
  onClose,
  links,
  logo,
}: MobileNavDrawerProps) {
  const pathname = usePathname();

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const drawerVariants = {
    closed: { x: '100%' },
    open: { x: 0 },
  };

  const linkContainerVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            transition={{ duration: 0.3 }}
          />

          {/* Drawer */}
          <motion.nav
            className={cn(
              'fixed inset-y-0 right-0 z-50',
              'w-full max-w-md',
              'bg-bg-primary/95 backdrop-blur-lg',
              'flex flex-col'
            )}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              {logo && <div className="text-white">{logo}</div>}

              {/* Close Button */}
              <button
                onClick={onClose}
                className={cn(
                  'p-3 -mr-3',
                  'text-white hover:text-accent',
                  'transition-colors duration-200',
                  'min-w-[48px] min-h-[48px]',
                  'flex items-center justify-center'
                )}
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>

            {/* Navigation Links */}
            <motion.div
              className="flex-1 flex flex-col justify-center px-6 py-8"
              variants={linkContainerVariants}
              initial="closed"
              animate="open"
            >
              {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <motion.div key={link.href} variants={linkVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        'block py-4',
                        'font-display text-3xl md:text-4xl uppercase tracking-wider',
                        'transition-all duration-200',
                        isActive
                          ? 'text-accent'
                          : 'text-white hover:text-accent hover:translate-x-2'
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          className="h-0.5 bg-accent mt-1"
                          layoutId="activeNavIndicator"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <p className="text-text-muted text-sm uppercase tracking-wider">
                Artist Development & Management
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

// Hamburger button component
export function HamburgerButton({
  onClick,
  isOpen,
  className,
}: {
  onClick: () => void;
  isOpen: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-3 min-w-[48px] min-h-[48px]',
        'flex flex-col justify-center items-center gap-1.5',
        'text-white',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <motion.span
        className="w-6 h-0.5 bg-current block"
        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="w-6 h-0.5 bg-current block"
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="w-6 h-0.5 bg-current block"
        animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />
    </button>
  );
}

export default MobileNavDrawer;
