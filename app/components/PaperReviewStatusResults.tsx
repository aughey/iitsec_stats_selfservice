'use client'

import DataTable from './DataTable'
import * as XLSX from 'xlsx'
import type { PaperReviewStatusResults } from '../utils/iitsec_analytics'

interface PaperReviewStatusResultsProps {
    results: PaperReviewStatusResults
}

export default function PaperReviewStatusResults({ results }: PaperReviewStatusResultsProps) {
    const prepareSubcommitteeData = () => {
        const data = Object.entries(results.subcommitteeStats).map(([subcommittee, stats]) => ({
            category: subcommittee,
            values: {
                'Accepts': stats.accepts,
                'Rejects': stats.rejects,
                'Total': stats.total,
                'Accept Rate': `${((stats.accepts / stats.total) * 100).toFixed(1)}%`
            }
        }))

        return {
            columns: ['Accepts', 'Rejects', 'Total', 'Accept Rate'],
            data
        }
    }

    const prepareOrgTypeData = () => {
        const data = Object.entries(results.orgTypeStats).map(([orgType, stats]) => ({
            category: orgType,
            values: {
                'Accepts': stats.accepts,
                'Rejects': stats.rejects,
                'Total': stats.total,
                'Accept Rate': `${((stats.accepts / stats.total) * 100).toFixed(1)}%`
            }
        }))

        return {
            columns: ['Accepts', 'Rejects', 'Total', 'Accept Rate'],
            data
        }
    }

    const prepareInternationalData = () => {
        const data = Object.entries(results.internationalStats).map(([type, stats]) => ({
            category: type.charAt(0).toUpperCase() + type.slice(1),
            values: {
                'Accepts': stats.accepts,
                'Rejects': stats.rejects,
                'Total': stats.total,
                'Accept Rate': `${((stats.accepts / stats.total) * 100).toFixed(1)}%`
            }
        }))

        return {
            columns: ['Accepts', 'Rejects', 'Total', 'Accept Rate'],
            data
        }
    }

    const prepareTotalData = () => {
        const data = [{
            category: 'Overall Totals',
            values: {
                'Accepts': results.totalStats.accepts,
                'Rejects': results.totalStats.rejects,
                'Total': results.totalStats.total,
                'Accept Rate': `${((results.totalStats.accepts / results.totalStats.total) * 100).toFixed(1)}%`
            }
        }]

        return {
            columns: ['Accepts', 'Rejects', 'Total', 'Accept Rate'],
            data
        }
    }

    const exportToExcel = () => {
        const subcommitteeData = prepareSubcommitteeData()
        const orgTypeData = prepareOrgTypeData()
        const internationalData = prepareInternationalData()
        const totalData = prepareTotalData()

        // Create workbook
        const wb = XLSX.utils.book_new()

        // Create subcommittee worksheet
        const subcommitteeWs = XLSX.utils.json_to_sheet(
            subcommitteeData.data.map(row => ({
                'Subcommittee': row.category,
                'Accepts': row.values['Accepts'],
                'Rejects': row.values['Rejects'],
                'Total': row.values['Total'],
                'Accept Rate': row.values['Accept Rate']
            }))
        )

        // Create org type worksheet
        const orgTypeWs = XLSX.utils.json_to_sheet(
            orgTypeData.data.map(row => ({
                'Organization Type': row.category,
                'Accepts': row.values['Accepts'],
                'Rejects': row.values['Rejects'],
                'Total': row.values['Total'],
                'Accept Rate': row.values['Accept Rate']
            }))
        )

        // Create international worksheet
        const internationalWs = XLSX.utils.json_to_sheet(
            internationalData.data.map(row => ({
                'Type': row.category,
                'Accepts': row.values['Accepts'],
                'Rejects': row.values['Rejects'],
                'Total': row.values['Total'],
                'Accept Rate': row.values['Accept Rate']
            }))
        )

        // Create totals worksheet
        const totalWs = XLSX.utils.json_to_sheet(
            totalData.data.map(row => ({
                'Category': row.category,
                'Accepts': row.values['Accepts'],
                'Rejects': row.values['Rejects'],
                'Total': row.values['Total'],
                'Accept Rate': row.values['Accept Rate']
            }))
        )

        // Add worksheets to workbook
        XLSX.utils.book_append_sheet(wb, subcommitteeWs, 'Subcommittee Stats')
        XLSX.utils.book_append_sheet(wb, orgTypeWs, 'Org Type Stats')
        XLSX.utils.book_append_sheet(wb, internationalWs, 'International Stats')
        XLSX.utils.book_append_sheet(wb, totalWs, 'Total Stats')

        // Save file
        XLSX.writeFile(wb, 'Paper_Review_Status_Results.xlsx')
    }

    return (
        <div className="mt-8 space-y-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Paper Review Status Results</h2>
                <button
                    onClick={exportToExcel}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Export to Excel
                </button>
            </div>
            <DataTable
                title="Subcommittee Statistics"
                {...prepareSubcommitteeData()}
            />
            <DataTable
                title="Organization Type Statistics"
                {...prepareOrgTypeData()}
            />
            <DataTable
                title="International vs Domestic Statistics"
                {...prepareInternationalData()}
            />
            <DataTable
                title="Overall Statistics"
                {...prepareTotalData()}
            />
        </div>
    )
} 