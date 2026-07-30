// components/ui/Skeleton.tsx
// Skeleton loading components — animate-pulse Tailwind

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: 'var(--bg4, #e9f0f9)', ...style }}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-xl overflow-hidden"
      style={{ background: 'var(--bg3, #fff)', border: '1.5px solid var(--border, #e4ebf5)' }}
    >
      {/* Image placeholder */}
      <div style={{ height: 200, background: 'var(--bg4, #e9f0f9)' }} />

      {/* Body */}
      <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Category */}
        <div style={{ height: 10, width: '35%', borderRadius: 6, background: 'var(--bg4, #e9f0f9)' }} />
        {/* Name */}
        <div style={{ height: 14, width: '90%', borderRadius: 6, background: 'var(--bg4, #e9f0f9)' }} />
        <div style={{ height: 14, width: '70%', borderRadius: 6, background: 'var(--bg4, #e9f0f9)' }} />
        {/* Price */}
        <div style={{ height: 18, width: '45%', borderRadius: 6, background: 'var(--bg4, #e9f0f9)', marginTop: 2 }} />
        {/* Button */}
        <div style={{ height: 38, width: '100%', borderRadius: 8, background: 'var(--bg4, #e9f0f9)', marginTop: 4 }} />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-xl overflow-hidden"
      style={{ background: 'var(--bg3, #fff)', border: '1.5px solid var(--border, #e4ebf5)' }}
    >
      {/* Color band */}
      <div style={{ height: 110, background: 'var(--bg4, #e9f0f9)' }} />

      {/* Body */}
      <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 16, width: '65%', borderRadius: 6, background: 'var(--bg4, #e9f0f9)' }} />
        <div style={{ height: 11, width: '100%', borderRadius: 5, background: 'var(--bg4, #e9f0f9)' }} />
        <div style={{ height: 11, width: '80%', borderRadius: 5, background: 'var(--bg4, #e9f0f9)' }} />
        <div style={{ height: 10, width: '30%', borderRadius: 5, background: 'var(--bg4, #e9f0f9)', marginTop: 4 }} />
      </div>
    </div>
  );
}

export function ShopPageSkeleton() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header skeleton */}
      <div
        className="animate-pulse"
        style={{ background: 'var(--sl3)', padding: 'clamp(24px,4vw,48px) 0', borderBottom: '1px solid var(--border)' }}
      >
        <div className="wrap">
          <div style={{ height: 10, width: 160, borderRadius: 5, background: 'var(--bg4)', marginBottom: 14 }} />
          <div style={{ height: 30, width: 260, borderRadius: 8, background: 'var(--bg4)', marginBottom: 10 }} />
          <div style={{ height: 12, width: 120, borderRadius: 5, background: 'var(--bg4)' }} />
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Filter chips skeleton */}
        <div className="animate-pulse" style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ height: 32, width: 80 + (i % 3) * 20, borderRadius: 22, background: 'var(--bg4)' }} />
          ))}
        </div>

        {/* Product grid skeleton */}
        <div id="featured-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoriesPageSkeleton() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header skeleton */}
      <div
        className="animate-pulse"
        style={{ background: 'var(--sl3)', padding: 'clamp(28px,5vw,52px) 0' }}
      >
        <div className="wrap">
          <div style={{ height: 10, width: 200, borderRadius: 5, background: 'rgba(255,255,255,0.12)', marginBottom: 16 }} />
          <div style={{ height: 34, width: 320, borderRadius: 8, background: 'rgba(255,255,255,0.12)', marginBottom: 10 }} />
          <div style={{ height: 12, width: 240, borderRadius: 5, background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
