'use client'

import DataTable from './DataTable'
import * as XLSX from 'xlsx'

interface CrossTabResult {
    [key: string]: { [key: string]: number }
}

interface AnalyticsResultsProps {
    orgTypeCrossTab: CrossTabResult
    intlCrossTab: CrossTabResult
    countryCrossTab: CrossTabResult
    orgTypePercentages: { [key: string]: number }
    orgTypeBySubcommitteeCrossTab: CrossTabResult
}

export default function AnalyticsResults({
    orgTypeCrossTab,
    intlCrossTab,
    countryCrossTab,
    orgTypePercentages,
    orgTypeBySubcommitteeCrossTab
}: AnalyticsResultsProps) {
    const prepareDataForTable = (data: CrossTabResult) => {
        const allColumns = new Set<string>()
        Object.values(data).forEach(row => {
            Object.keys(row).forEach(col => allColumns.add(col))
        })
        const columns = Array.from(allColumns)

        const tableData = Object.entries(data).map(([category, values]) => ({
            category,
            values
        }))

        return { columns, data: tableData }
    }

    const preparePercentagesData = () => {
        const data = Object.entries(orgTypePercentages).map(([category, percentage]) => ({
            category,
            values: {
                'Percentage': `${(percentage * 100).toFixed(1)}%`
            }
        }))
        return { columns: ['Percentage'], data }
    }

    const all_tables = [
        {
            sheet_name: 'By Subcommittee and Org Type',
            title: 'Submissions by Subcommittee and Organization Type',
            data: prepareDataForTable(orgTypeCrossTab)
        },
        {
            sheet_name: 'By Org Type and Subcommittee',
            title: 'Submissions by Organization Type and Subcommittee',
            data: prepareDataForTable(orgTypeBySubcommitteeCrossTab)
        },
        {
            sheet_name: 'International Submissions',
            title: 'International Submissions by Subcommittee',
            data: prepareDataForTable(intlCrossTab)
        },
        {
            sheet_name: 'By Country and Subcommittee',
            title: 'Submissions by Country and Subcommittee',
            data: prepareDataForTable(countryCrossTab)
        },
        {
            sheet_name: 'By Organization Type',
            title: 'Submissions by Organization Type',
            data: preparePercentagesData()
        }
    ]

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new()

        // Helper function to convert table data to Excel format
        const convertToExcelData = (tableData: any[], columns: string[]) => {
            const headers = ['Category', ...columns]
            const rows = tableData.map(row => [
                row.category,
                ...columns.map(col => row.values[col] || 0)
            ])
            return [headers, ...rows]
        }

        all_tables.forEach(({ sheet_name, data }) => {
            const excelData = convertToExcelData(data.data, data.columns)
            const worksheet = XLSX.utils.aoa_to_sheet(excelData)
            XLSX.utils.book_append_sheet(workbook, worksheet, sheet_name)
        })

        // Save the file
        XLSX.writeFile(workbook, 'analytics_results.xlsx')
    }

    return (
        <div className="mt-8 space-y-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Analytics Results</h2>
                <button
                    onClick={exportToExcel}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Export to Excel
                </button>
            </div>
            {all_tables.map(({ title, data }) => (
                <DataTable
                    key={title}
                    title={title}
                    {...data}
                />
            ))}
        </div>
    )
} 