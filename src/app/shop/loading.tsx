export default function ShopLoading() {
  const skeletonPulse: React.CSSProperties = {
    background: 'linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%)',
    backgroundSize: '200% 100%',
    animation: 'mifa-shimmer 1.6s ease-in-out infinite',
    borderRadius: 6,
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        @keyframes mifa-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Header skeleton */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
          padding: 'clamp(24px,4vw,48px) 0',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="wrap">
          {/* Breadcrumb */}
          <div
            style={{ ...skeletonPulse, width: 140, height: 12, marginBottom: 18 }}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ ...skeletonPulse, width: 220, height: 32, marginBottom: 10, borderRadius: 8 }} />
              <div style={{ ...skeletonPulse, width: 120, height: 12 }} />
            </div>
            <div style={{ ...skeletonPulse, width: 96, height: 32, borderRadius: 22 }} />
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Category filters skeleton */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {[80, 100, 68, 90, 72, 84, 76].map((w, i) => (
            <div
              key={i}
              style={{ ...skeletonPulse, width: w, height: 32, borderRadius: 22 }}
            />
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {[80, 64, 72, 80].map((w, i) => (
              <div key={i} style={{ ...skeletonPulse, width: w, height: 28, borderRadius: 8 }} />
            ))}
          </div>
        </div>

        {/* Product grid skeleton — 8 cards */}
        <div id="featured-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="prod-skel">
              <div className="ps-img" style={skeletonPulse} />
              <div className="ps-body">
                <div className="ps-line short skeleton" style={skeletonPulse} />
                <div className="ps-line med skeleton" style={skeletonPulse} />
                <div className="ps-line skeleton" style={skeletonPulse} />
                <div className="ps-line short skeleton" style={skeletonPulse} />
                <div
                  className="ps-line skeleton"
                  style={{ ...skeletonPulse, height: 30, borderRadius: 8, marginTop: 4 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
