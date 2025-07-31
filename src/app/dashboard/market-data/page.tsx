'use client';

export default function MarketDataPage() {
  const marketStats = [
    {
      label: 'Average Property Price',
      value: '$485K',
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Properties Sold (30 days)',
      value: '47',
      change: '+8%',
      trend: 'up',
    },
    {
      label: 'Average Days on Market',
      value: '65',
      change: '-5%',
      trend: 'down',
    },
    { label: 'Price per Sq Ft', value: '$320', change: '+15%', trend: 'up' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Market Data</h1>
        <p className="text-gray-600">
          Real estate market insights and trends for Antigua
        </p>
      </div>

      {/* Market Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {marketStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  stat.trend === 'up'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 2024 Market Snapshot */}
      <section className="mt-8 px-4 py-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          📊 2024 Antigua Real Estate Market Snapshot
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              🏝️ Economic Context
            </h3>
            <p>
              Antigua's economy is 60–70% tourism-based. Real estate demand is
              up due to a 15% rise in visitor numbers in H1 2024 and GDP growth
              of 6.3%.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              🛂 Citizenship Investment Surge
            </h3>
            <p>
              CBI applications increased by 205% in H1 2024, with 739
              submissions. Minimum real estate investment for eligibility is USD
              $325,000.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              📈 Price Overview
            </h3>
            <ul className="list-disc ml-4">
              <li>
                Avg. residential price: <strong>USD $1,680/m²</strong>
              </li>
              <li>
                Prime villa pricing: <strong>USD $8,600–13,450/m²</strong>
              </li>
              <li>
                Entry-level inventory is tight under <strong>$1M</strong>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              💰 Investment Insights
            </h3>
            <ul className="list-disc ml-4">
              <li>
                Rental yields range: <strong>4–8%</strong>
              </li>
              <li>
                Estimated price growth: <strong>17% over 5 years</strong>
              </li>
              <li>
                Hot zones:{' '}
                <strong>
                  Jolly Harbour, English Harbour, St. Johns, Nonsuch Bay
                </strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            📌 <em>Pro Tip:</em> Track demand in marina districts. Off-plan
            builds are rising fast. Entry-level stock is moving quickly.
          </p>
        </div>
      </section>

      {/* Additional Market Insights */}
      <section className="mt-8 px-4 py-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-md border border-blue-100">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          🏆 Key Market Opportunities
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              🏖️ <span className="ml-2">Beachfront Premium</span>
            </h3>
            <p className="mb-2">
              Oceanfront properties command 30-50% premium over inland
              equivalents.
            </p>
            <div className="text-xs text-blue-600 font-medium">
              • Direct beach access: +45%
              <br />
              • Ocean view: +25%
              <br />• Walking distance: +15%
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              ⛵ <span className="ml-2">Marina Developments</span>
            </h3>
            <p className="mb-2">
              New marina projects driving significant appreciation in
              surrounding areas.
            </p>
            <div className="text-xs text-green-600 font-medium">
              • Jolly Harbour: +22% YoY
              <br />
              • Falmouth Harbour: +18% YoY
              <br />• Nelson's Dockyard: +15% YoY
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              🏗️ <span className="ml-2">Development Pipeline</span>
            </h3>
            <p className="mb-2">
              Major infrastructure projects boosting long-term property values.
            </p>
            <div className="text-xs text-purple-600 font-medium">
              • Airport expansion: 2025
              <br />
              • New cruise terminal: 2024
              <br />• Road improvements: Ongoing
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <p className="text-sm text-gray-700">
            <strong>🎯 Investor Alert:</strong> Limited land availability is
            creating scarcity premium. Properties within 500m of new
            infrastructure projects showing strongest appreciation potential.
          </p>
        </div>
      </section>
    </div>
  );
}
