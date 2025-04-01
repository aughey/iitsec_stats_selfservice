interface DataTableProps {
    title: string;
    columns: string[];
    data: Array<{
        category: string;
        values: { [key: string]: number | string };
    }>;
}

export default function DataTable({ title, columns, data }: DataTableProps) {
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
                        {data.map((row, idx) => (
                            <tr key={row.category} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200">{row.category}</td>
                                {columns.map(col => (
                                    <td key={col} className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                                        {row.values[col] || 0}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 