'use client'

export default function StatsCard({ title, value, icon, color = 'blue', trend, description }) {
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        lightBg: 'bg-blue-50',
        iconBg: 'bg-blue-100'
      },
      green: {
        bg: 'bg-green-500',
        text: 'text-green-600',
        lightBg: 'bg-green-50',
        iconBg: 'bg-green-100'
      },
      yellow: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-600',
        lightBg: 'bg-yellow-50',
        iconBg: 'bg-yellow-100'
      },
      red: {
        bg: 'bg-red-500',
        text: 'text-red-600',
        lightBg: 'bg-red-50',
        iconBg: 'bg-red-100'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        lightBg: 'bg-purple-50',
        iconBg: 'bg-purple-100'
      },
      indigo: {
        bg: 'bg-indigo-500',
        text: 'text-indigo-600',
        lightBg: 'bg-indigo-50',
        iconBg: 'bg-indigo-100'
      }
    }
    return colors[color] || colors.blue
  }

  const colorClasses = getColorClasses(color)

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 ${colorClasses.iconBg} rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">{icon}</span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend.type === 'increase' ? 'text-green-600' : 
                    trend.type === 'decrease' ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {trend.type === 'increase' && (
                      <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {trend.type === 'decrease' && (
                      <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="sr-only">
                      {trend.type === 'increase' ? 'Increased' : 'Decreased'} by
                    </span>
                    {trend.value}
                  </div>
                )}
              </dd>
              {description && (
                <dd className="text-sm text-gray-600 mt-1">
                  {description}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}