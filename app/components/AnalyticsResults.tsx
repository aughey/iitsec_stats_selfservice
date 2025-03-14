'use client'

interface CrossTabResult {
    [key: string]: { [key: string]: number }
}

interface AnalyticsResultsProps {
    orgTypeCrossTab: CrossTabResult
    intlCrossTab: CrossTabResult
    countryCrossTab: CrossTabResult
    orgTypePercentages: { [key: string]: number }
}

export default function AnalyticsResults({
    orgTypeCrossTab,
    intlCrossTab,
    countryCrossTab,
    orgTypePercentages
}: AnalyticsResultsProps) {
    const renderCrossTab = (data: CrossTabResult, title: string) => {
        const allColumns = new Set<string>()
        Object.values(data).forEach(row => {
            Object.keys(row).forEach(col => allColumns.add(col))
        })
        const columns = Array.from(allColumns)

        return (
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Category</th>
                                {columns.map(col => (
                                    <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data).map(([category, values], idx) => (
                                <tr key={category} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200">{category}</td>
                                    {columns.map(col => (
                                        <td key={col} className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                                            {values[col] || 0}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const renderPercentages = () => (
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Submissions by Organization Type</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Organization Type</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(orgTypePercentages).map(([orgType, percentage], idx) => (
                            <tr key={orgType} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200">{orgType}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                                    {(percentage * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    return (
        <div className="mt-8 space-y-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Analytics Results</h2>
            {renderCrossTab(orgTypeCrossTab, "Submissions by Subcommittee and Organization Type")}
            {renderCrossTab(intlCrossTab, "International Submissions by Subcommittee")}
            {renderCrossTab(countryCrossTab, "Submissions by Country and Subcommittee")}
            {renderPercentages()}
        </div>
    )
} 