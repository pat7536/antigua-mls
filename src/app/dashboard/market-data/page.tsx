'use client';

export default function MarketDataPage() {
  const marketStats = [
    { label: 'Average Property Price', value: '$485,000', change: '+12%', trend: 'up' },
    { label: 'Properties Sold (30 days)', value: '47', change: '+8%', trend: 'up' },
    { label: 'Average Days on Market', value: '65', change: '-5%', trend: 'down' },
    { label: 'Price per Sq Ft', value: '$320', change: '+15%', trend: 'up' },
  ];

  const areaData = [
    { area: 'Jolly Harbour', avgPrice: '$650,000', properties: 23, trend: 'up' },
    { area: 'St. Johns', avgPrice: '$420,000', properties: 18, trend: 'up' },
    { area: 'Nonsuch Bay', avgPrice: '$780,000', properties: 12, trend: 'down' },
    { area: 'Valley Church', avgPrice: '$520,000', properties: 15, trend: 'up' },
    { area: 'English Harbour', avgPrice: '$890,000', properties: 8, trend: 'up' },
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
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.trend === 'up' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Area Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Top Areas by Price
          </h3>
          <div className="space-y-4">
            {areaData.map((area) => (
              <div key={area.area} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{area.area}</div>
                  <div className="text-sm text-gray-600">{area.properties} properties</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{area.avgPrice}</div>
                  <div className={`text-sm ${
                    area.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {area.trend === 'up' ? '↗' : '↘'} Trending
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Market Insights
          </h3>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">Strong Market Growth</h4>
              <p className="text-sm text-gray-600 mt-1">
                The Antigua real estate market has shown consistent growth over the past quarter, 
                with luxury properties in coastal areas leading the way.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900">High Demand Areas</h4>
              <p className="text-sm text-gray-600 mt-1">
                Jolly Harbour and English Harbour continue to be the most sought-after locations, 
                with properties selling 23% faster than the island average.
              </p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium text-gray-900">Investment Opportunity</h4>
              <p className="text-sm text-gray-600 mt-1">
                Properties near the new marina development are showing increased interest 
                from international buyers, presenting strong investment potential.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Pro Tip:</strong> Market data is updated monthly. Contact us for the most recent 
              comparative market analysis for specific properties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}