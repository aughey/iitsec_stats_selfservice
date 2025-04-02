import { PreAbstractReviewSummary } from '../utils/analytics'
import { recordFields, formatFieldValue } from '../config/recordFields'

interface PreAbstractReviewProps {
    summaries: PreAbstractReviewSummary[]
}

function convertToCSV(papers: PreAbstractReviewSummary[]): string {
    // Define headers using record fields
    const headers = recordFields
        .filter(field => field.type !== 'comment')
        .map(field => field.displayName)
        .join(',')

    // Convert each paper to CSV row
    const rows = papers.map(paper => {
        return recordFields
            .filter(field => field.type !== 'comment')
            .map(field => {
                const value = paper[field.key as keyof PreAbstractReviewSummary]
                const formattedValue = formatFieldValue(field, value)
                return field.type === 'string' ? `"${String(formattedValue).replace(/"/g, '""')}"` : formattedValue
            })
            .join(',')
    })

    return [headers, ...rows].join('\n')
}

function downloadCSV(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

function formatTableCell(field: typeof recordFields[0], value: string | number | string[] | null | undefined) {
    if (field.type === 'comment') {
        if (!Array.isArray(value)) return '-';
        if (value.length === 0) return '-';
        return (
            <ul className="list-disc pl-5">
                {value.map((comment: string, i: number) => (
                    <li key={i}>{comment}</li>
                ))}
            </ul>
        );
    }
    return formatFieldValue(field, value);
}

export default function PreAbstractReview({ summaries }: PreAbstractReviewProps) {
    // Group summaries by subcommittee
    const summariesBySubcommittee = summaries.reduce((acc, summary) => {
        const subcommittee = summary.Assigned_Subcommittee || 'Unassigned'
        if (!acc[subcommittee]) {
            acc[subcommittee] = []
        }
        acc[subcommittee].push(summary)
        return acc
    }, {} as Record<string, PreAbstractReviewSummary[]>)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Pre-Abstract Review Results</h2>
                <button
                    onClick={() => {
                        const csv = convertToCSV(summaries)
                        downloadCSV(csv, 'pre_abstract_review.csv')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Export CSV
                </button>
            </div>

            {Object.entries(summariesBySubcommittee).map(([subcommittee, papers]) => (
                <details key={subcommittee} className="bg-white rounded-lg shadow overflow-hidden">
                    <summary className="px-6 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between group">
                        <h3 className="text-lg font-semibold text-gray-900">{subcommittee}</h3>
                        <svg className="w-5 h-5 text-gray-500 transform transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {recordFields.map(field => (
                                        <th key={field.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {field.displayName}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {papers.map((paper) => (
                                    <tr key={paper.ID}>
                                        {recordFields.map(field => (
                                            <td key={field.key} className={`px-6 py-4 whitespace-${field.type === 'string' || field.type === 'comment' ? 'normal' : 'nowrap'} text-sm text-gray-900`}>
                                                {formatTableCell(field, paper[field.key as keyof PreAbstractReviewSummary])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            ))}
        </div>
    )
} 