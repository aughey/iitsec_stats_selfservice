'use client'

import type { CountryStats } from '../utils/analytics'

interface CountryStatsProps {
    countryStats: CountryStats
}

const CountryStats: React.FC<CountryStatsProps> = ({ countryStats }) => {
    const sortedEntries = Object.entries(countryStats)
        .sort(([, a], [, b]) => b - a) // Sort by count in descending order

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Country
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Number of Submissions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedEntries.map(([country, count], index) => (
                        <tr key={country} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {count}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default CountryStats 