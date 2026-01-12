# System Patterns

**Project**: BizzLife Entertainment
**Last Updated**: January 11, 2026

## Code Conventions

### File Naming
- Components: PascalCase (`GlowButton.tsx`, `ArtistCard.tsx`)
- Utilities: camelCase (`formatFileSize.ts`, `validateFile.ts`)
- Types: PascalCase with descriptive names (`PricingFeature`, `UploadedFile`)
- Pages: lowercase with hyphens (`artist-profile/page.tsx`)

### Component Structure
```typescript
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props interface
}

/**
 * ComponentName - Brief description
 * Features list of key functionality
 */
export function ComponentName({ props }: ComponentProps) {
  // Implementation
}

export default ComponentName;
```

### Import Order
1. React/Next.js imports
2. Third-party libraries (framer-motion, etc.)
3. Internal utilities (`@/lib/utils`)
4. Types and interfaces
5. Styles (if separate)

## Design Patterns

### Animation Pattern
```typescript
// Standard reveal animation
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}

// Hover lift effect
whileHover={{ y: -4, transition: { duration: 0.2 } }}

// Button press feedback
whileTap={{ scale: 0.98 }}
```

### Color Usage
```typescript
// Background hierarchy
bg-bg-primary     // #000000 - Main background
bg-bg-secondary   // #0A0A0A - Section backgrounds
bg-bg-elevated    // #111111 - Cards, overlays

// Accent colors
bg-accent         // #FF0040 - Primary CTAs
bg-accent-gold    // #FFD700 - Premium/Gold tier

// Text colors
text-white        // Primary text
text-text-secondary // #808080 - Secondary text
text-text-muted   // #4A4A4A - Muted/disabled text
```

### Variant Pattern
```typescript
const variantStyles = {
  default: {
    border: 'border-white/10',
    bg: 'bg-bg-elevated/80 backdrop-blur-sm',
  },
  gold: {
    border: 'border-accent-gold',
    bg: 'bg-bg-elevated/80 backdrop-blur-sm',
  },
  glass: {
    border: 'border-white/20',
    bg: 'bg-white/5 backdrop-blur-lg',
  },
};

const styles = variantStyles[variant];
```

### Responsive Pattern
```typescript
// Mobile-first breakpoints
className="p-4 md:p-6 lg:p-8"
className="text-base md:text-lg lg:text-xl"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

## Database Patterns

### Table Naming
- Plural, lowercase, underscores: `artists`, `signup_requests`, `activity_log`
- Junction tables: `artist_genres`, `user_favorites`

### Common Fields
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### RLS Pattern
```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public can view published"
  ON table_name FOR SELECT
  USING (status = 'published' OR status = 'active');

-- Owner write policy
CREATE POLICY "Users can manage own"
  ON table_name FOR ALL
  USING (auth.uid() = user_id);

-- Admin full access
CREATE POLICY "Admins have full access"
  ON table_name FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

## API Patterns

### Server Action Pattern
```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createSubmission(formData: FormData) {
  const supabase = createClient();

  // Validate input
  const track = formData.get('track');
  if (!track) {
    return { error: 'Track file required' };
  }

  // Process and insert
  const { data, error } = await supabase
    .from('submissions')
    .insert({ /* data */ })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { data };
}
```

### Error Handling Pattern
```typescript
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
  };
}
```

## Component Patterns

### Props with Defaults
```typescript
interface Props {
  variant?: 'default' | 'gold' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function Component({
  variant = 'default',
  size = 'md',
  disabled = false,
}: Props) {
  // Implementation
}
```

### Conditional Styling with cn()
```typescript
import { cn } from '@/lib/utils';

className={cn(
  'base-classes',
  variant === 'gold' && 'gold-specific-classes',
  disabled && 'opacity-50 cursor-not-allowed',
  className // Allow override from props
)}
```

### File Upload Pattern
```typescript
const validateFile = (file: File): string | null => {
  // Check file type
  if (!acceptedTypes.includes(file.type)) {
    return `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
  }

  // Check file size
  if (file.size > maxSize) {
    return `File too large. Maximum: ${formatFileSize(maxSize)}`;
  }

  return null; // Valid
};
```

## Testing Patterns

### Component Test Structure
```typescript
describe('ComponentName', () => {
  it('renders correctly with default props', () => {
    // Test default rendering
  });

  it('applies variant styles correctly', () => {
    // Test variant prop
  });

  it('handles user interactions', () => {
    // Test click, hover, etc.
  });

  it('validates accessibility', () => {
    // Test a11y requirements
  });
});
```

## Performance Patterns

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src={imageSrc}
  alt={imageAlt}
  width={400}
  height={400}
  className="object-cover"
  placeholder="blur"
  blurDataURL={blurPlaceholder}
/>
```

### Lazy Loading
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

---
**Usage**: Reference when implementing new features to maintain consistency
