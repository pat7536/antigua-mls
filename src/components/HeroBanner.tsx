'use client';
// Responsive banner component

export default function HeroBanner() {
  return (
    <div
      className="relative w-full overflow-hidden h-48 sm:h-56 md:h-80 lg:h-[32rem] xl:h-[36rem]"
      style={{
        backgroundImage: 'url(/antigua-mls.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Fallback background if image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 -z-10"></div>

      {/* Trusted website badge */}
      <div className="absolute top-4 left-4 z-10">
        <img
          src="/badge.png"
          alt="Trusted Website Badge"
          className="h-16 w-auto sm:h-20 md:h-24 lg:h-28"
        />
      </div>
    </div>
  );
}
