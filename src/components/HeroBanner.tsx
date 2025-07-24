'use client';
// Responsive banner component

export default function HeroBanner() {
  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{
        height: '60vh',
        minHeight: '400px',
        maxHeight: '800px',
        backgroundImage: 'url(/antigua-mls.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content - positioned in center */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-8 text-center">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-2xl">
            Antigua MLS
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white drop-shadow-lg mb-6">
            Find your dream property in Antigua
          </p>

          {/* Call to Action */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-lg text-sm sm:text-base"
            onClick={() => {
              const filtersSection = document.querySelector('.container');
              filtersSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Browse Properties
          </button>
        </div>
      </div>

      {/* Fallback background if image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 -z-10"></div>
    </div>
  );
}
