import { PreAbstractReviewSummary } from '../utils/analytics'

interface PreAbstractReviewProps {
    summaries: PreAbstractReviewSummary[]
}

function convertToCSV(papers: PreAbstractReviewSummary[]): string {
    // Define headers
    const headers = [
        'ID',
        'Title',
        'Birddog Volunteer',
        'Mean Substance Rating',
        'Mean Originality Rating',
        'Mean Sales Pitch',
        'Accept',
        'Reject',
        'Discuss',
        'Birddog Comments',
        'Committee Comments'
    ].join(',');

    // Convert each paper to CSV row
    const rows = papers.map(paper => {
        return [
            paper.ID,
            `"${paper.Title.replace(/"/g, '""')}"`,
            `"${paper.Birddog_Volunteer.replace(/"/g, '""')}"`,
            paper.Mean_Substance_Rating,
            paper.Mean_Originality_Rating,
            paper.Mean_Sales_Pitch,
            paper.Num_Accept,
            paper.Num_Reject,
            paper.Num_Discuss,
            `"${paper.Comments_for_Birddog.join('; ').replace(/"/g, '""')}"`,
            `"${paper.Comments_for_Subcommittee.join('; ').replace(/"/g, '""')}"`
        ].join(',');
    });

    return [headers, ...rows].join('\n');
}

function downloadCSV(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default function PreAbstractReview({ summaries }: PreAbstractReviewProps) {
    // Group summaries by subcommittee
    const summariesBySubcommittee = summaries.reduce((acc, summary) => {
        const subcommittee = summary.Assigned_Subcommittee;
        if (!acc[subcommittee]) {
            acc[subcommittee] = [];
        }
        acc[subcommittee].push(summary);
        return acc;
    }, {} as Record<string, PreAbstractReviewSummary[]>);

    return (
        <div className="space-y-8">
            {Object.entries(summariesBySubcommittee).map(([subcommittee, papers]) => (
                <details key={subcommittee} className="bg-white rounded-lg shadow overflow-hidden">
                    <summary className="text-xl font-bold p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 flex justify-between items-center">
                        <span>{subcommittee}</span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                const csv = convertToCSV(papers);
                                downloadCSV(csv, `${subcommittee.replace(/\s+/g, '_')}_reviews.csv`);
                            }}
                            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Download CSV
                        </button>
                    </summary>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birddog Volunteer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean Substance</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean Originality</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean Sales Pitch</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accept</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discuss</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birddog Comments</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Committee Comments</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {papers.map((paper) => (
                                    <tr key={paper.ID}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.ID}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{paper.Title}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{paper.Birddog_Volunteer || 'None'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.Mean_Substance_Rating}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.Mean_Originality_Rating}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.Mean_Sales_Pitch}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.Num_Accept}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.Num_Reject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.Num_Discuss}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                                            {paper.Comments_for_Birddog.length > 0 ? (
                                                <ul className="list-disc pl-5">
                                                    {paper.Comments_for_Birddog.map((comment, i) => (
                                                        <li key={i}>{comment}</li>
                                                    ))}
                                                </ul>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                                            {paper.Comments_for_Subcommittee.length > 0 ? (
                                                <ul className="list-disc pl-5">
                                                    {paper.Comments_for_Subcommittee.map((comment, i) => (
                                                        <li key={i}>{comment}</li>
                                                    ))}
                                                </ul>
                                            ) : '-'}
                                        </td>
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