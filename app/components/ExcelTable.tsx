'use client'

interface ExcelTableProps {
    headers: string[];
    data: any[][];
}

export default function ExcelTable({ headers, data }: ExcelTableProps) {
    if (!headers.length || !data.length) return null;

    return (
        <div className="overflow-x-auto w-full mt-8">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {cell?.toString() || ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 