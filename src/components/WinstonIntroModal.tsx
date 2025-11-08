'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WinstonIntroModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show modal on every page load after a short delay for better UX
    setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 2000);
  }, []);

  // Disable map interactions when modal is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      // Disable map interactions
      const mapContainer = document.querySelector('.leaflet-container');
      if (mapContainer) {
        (mapContainer as HTMLElement).style.pointerEvents = 'none';
      }
    } else {
      document.body.style.overflow = 'unset';
      // Re-enable map interactions
      const mapContainer = document.querySelector('.leaflet-container');
      if (mapContainer) {
        (mapContainer as HTMLElement).style.pointerEvents = 'auto';
      }
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
      const mapContainer = document.querySelector('.leaflet-container');
      if (mapContainer) {
        (mapContainer as HTMLElement).style.pointerEvents = 'auto';
      }
    };
  }, [isVisible]);

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const startChatting = () => {
    // Close the modal first
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      
      // Dispatch custom event to open Winston chat widget
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('openWinstonChat'));
        }
      }, 300);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[9999] ${
          isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
        <div 
          className={`winston-modal bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto transform transition-all duration-300 border border-gray-100 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-white border-b border-gray-100 px-8 py-6 rounded-t-lg">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-xl w-6 h-6 flex items-center justify-center transition-colors"
            >
              ×
            </button>
            
            <div className="pr-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Meet Agent Winston
                  </h2>
                  <p className="text-sm text-blue-600 font-medium">
                    Antigua MLS AI Concierge
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              I'm Winston, your intelligent real-estate assistant. Tell me what you're dreaming of — I'll find it.
            </p>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4 text-sm uppercase tracking-wide">Sample Queries</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">"Show me your top 5 ocean-view villas under $1 million"</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">"Find family-friendly homes near schools"</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">"I want a modern condo with sunset views"</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">"Which listings are great for investment?"</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mt-5 leading-relaxed">
                Chat with me using the widget below — I'll search, compare, and suggest the best options across Antigua & Barbuda.
              </p>
            </div>

            {/* Agent Section */}
            <div className="border-t border-gray-100 pt-5 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Are you an agent?</p>
                  <p className="text-xs text-gray-600">Access your dashboard and listings</p>
                </div>
                <Link
                  href="/sign-in"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Sign In →
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md transition-colors text-sm font-medium"
              >
                Maybe Later
              </button>
              <button
                onClick={startChatting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md transition-colors text-sm font-medium"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}