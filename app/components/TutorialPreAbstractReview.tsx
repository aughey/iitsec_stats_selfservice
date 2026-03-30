import { TutorialPreAbstractReviewSummary } from '../utils/iitsec_analytics'
import { tutorialRecordFields, formatFieldValue } from '../config/recordFields'

interface TutorialPreAbstractReviewProps {
    summaries: TutorialPreAbstractReviewSummary[]
}

function convertToCSV(tutorials: TutorialPreAbstractReviewSummary[]): string {
    const headers = tutorialRecordFields
        .map(field => field.displayName)
        .join(',')

    const rows = tutorials.map(tutorial => {
        return tutorialRecordFields
            .map(field => {
                const value = tutorial[field.key as keyof TutorialPreAbstractReviewSummary]
                if (field.type === 'comment') {
                    const comments = Array.isArray(value) ? value.join('; ') : ''
                    return `"${comments.replace(/"/g, '""')}"`
                }
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

function formatTableCell(field: typeof tutorialRecordFields[0], value: string | number | string[] | null | undefined) {
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

export default function TutorialPreAbstractReview({ summaries }: TutorialPreAbstractReviewProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Tutorial Pre-Abstract Review Results</h2>
                <button
                    onClick={() => {
                        const csv = convertToCSV(summaries)
                        downloadCSV(csv, 'tutorial_pre_abstract_review.csv')
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {tutorialRecordFields.map(field => (
                                <th key={field.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {field.displayName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {summaries.map((tutorial) => (
                            <tr key={String(tutorial.ID)}>
                                {tutorialRecordFields.map(field => (
                                    <td key={field.key} className={`px-6 py-4 whitespace-${field.type === 'string' || field.type === 'comment' ? 'normal' : 'nowrap'} text-sm text-gray-900`}>
                                        {formatTableCell(field, tutorial[field.key as keyof TutorialPreAbstractReviewSummary])}
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
