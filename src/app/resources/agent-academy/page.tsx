import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Agent Academy | Antigua MLS',
  description:
    'Your hub for training, insights, and the Deep Dive podcast. Learn, grow, and stay ahead with our real estate resources.',
  openGraph: {
    title: 'Agent Academy | Antigua MLS',
    description:
      'Your hub for training, insights, and the Deep Dive podcast. Learn, grow, and stay ahead with our real estate resources.',
    type: 'website',
  },
};

export default function AgentAcademyPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Agent Academy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Your hub for training, insights, and the Deep Dive podcast.
            </p>

            {/* Podcast Cover Art */}
            <div className="mb-8 flex justify-center">
              <div className="flex justify-center items-center bg-white p-4 rounded-2xl shadow-2xl w-56 h-56 md:w-72 md:h-72 mx-auto">
                <Image
                  src="/assets/podcast/deep-dive-cover.jpg"
                  alt="Deep Dive: Beyond the Beach - Antigua Real Estate Podcast"
                  width={192}
                  height={192}
                  className="object-contain w-48 h-48 md:w-64 md:h-64"
                  priority
                />
              </div>
            </div>

            {/* Listen Now Button */}
            <a
              href="https://podcasts.apple.com/us/podcast/deep-dive-beyond-the-beach-antigua-real-estate/id1833665738"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold text-lg rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
            >
              <span className="mr-3 text-2xl">🎧</span>
              Listen on Apple Podcasts
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Podcast Episodes Section */}
            <section className="mb-16">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">🎙️</span>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Podcast Episodes
                  </h2>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">
                    Deep Dive: Beyond the Beach
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Explore the depths of Antigua&apos;s real estate market with
                    insider insights, expert interviews, and market analysis
                    that goes beyond the surface.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://podcasts.apple.com/us/podcast/deep-dive-beyond-the-beach-antigua-real-estate/id1833665738"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <span className="mr-2">🍎</span>
                      Apple Podcasts
                    </a>

                    <button className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      <span className="mr-2">🎵</span>
                      More Platforms Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Future Resources Section */}
            <section>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">📚</span>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Future Guides & Resources
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">📋</span>
                      <h3 className="text-lg font-semibold text-emerald-800">
                        Training Guides
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      Comprehensive training materials covering market analysis,
                      client relations, and property valuation techniques.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">✅</span>
                      <h3 className="text-lg font-semibold text-blue-800">
                        Checklists
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      Essential checklists for property listings, client
                      onboarding, and transaction management.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">📊</span>
                      <h3 className="text-lg font-semibold text-amber-800">
                        Market Reports
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      Regular market insights, trends analysis, and forecasting
                      reports for the Antigua real estate market.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">🎯</span>
                      <h3 className="text-lg font-semibold text-rose-800">
                        Best Practices
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      Industry best practices, legal guidelines, and
                      professional standards for real estate agents.
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-600 rounded-lg">
                    <span className="mr-2">🚧</span>
                    Coming soon: training guides, checklists, and more.
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
