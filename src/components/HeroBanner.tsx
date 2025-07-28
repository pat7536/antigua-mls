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


      {/* Fallback background if image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 -z-10"></div>
    </div>
  );
}
