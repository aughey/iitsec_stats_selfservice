'use client'

import DataTable from './DataTable'
import * as XLSX from 'xlsx'
import type { PaperReviewStatusResults } from '../utils/iitsec_analytics'

interface PaperReviewStatusResultsProps {
    results: PaperReviewStatusResults
}

interface StatsDisplayProps {
    accepts: number
    rejects: number
    total: number
    acceptRate: string
}

interface GroupedStatusProps {
    title: string
    items: Array<{
        type: string
        accepts: number
        rejects: number
        total: number
        acceptRate: string
    }>
}

function StatsDisplay({ accepts, rejects, total, acceptRate }: StatsDisplayProps) {
    return (
        <div className="text-gray-700 space-x-4">
            <span><span className="font-medium">Accepts:</span> {accepts}</span>
            <span><span className="font-medium">Rejects:</span> {rejects}</span>
            <span><span className="font-medium">Total:</span> {total}</span>
            <span><span className="font-medium">Accept Rate:</span> {acceptRate}</span>
        </div>
    )
}

function GroupedStatus({ title, items }: GroupedStatusProps) {
    return (
        <div className="mt-4">
            <h5 className="font-medium mb-2 text-gray-900">{title}:</h5>
            <div className="space-y-4">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-gray-100 p-3 rounded border border-gray-200">
                        <div className="font-medium text-gray-900">{item.type}</div>
                        <StatsDisplay
                            accepts={item.accepts}
                            rejects={item.rejects}
                            total={item.total}
                            acceptRate={item.acceptRate}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function PaperReviewStatusResults({ results }: PaperReviewStatusResultsProps) {
    const prepareSubcommitteeData = () => {
        const data = Object.entries(results.subcommitteeStats).map(([subcommittee, stats]) => {
            // Get org type breakdown for this subcommittee
            const orgTypeBreakdown = Object.entries(stats.byOrganization).map(([orgType, orgStats]) => ({
                type: orgType,
                accepts: orgStats.accepts,
                rejects: orgStats.rejects,
                total: orgStats.total,
                acceptRate: `${((orgStats.accepts / orgStats.total) * 100).toFixed(1)}%`
            }));

            // Get international breakdown for this subcommittee
            const internationalBreakdown = Object.entries(stats.byInternational).map(([type, intlStats]) => ({
                type: type.charAt(0).toUpperCase() + type.slice(1),
                accepts: intlStats.accepts,
                rejects: intlStats.rejects,
                total: intlStats.total,
                acceptRate: `${((intlStats.accepts / intlStats.total) * 100).toFixed(1)}%`
            }));

            return {
                category: subcommittee,
                values: {
                    'Accepts': stats.accepts,
                    'Rejects': stats.rejects,
                    'Total': stats.total,
                    'Accept Rate': `${((stats.accepts / stats.total) * 100).toFixed(1)}%`,
                    'Org Type Breakdown': orgTypeBreakdown,
                    'International Breakdown': internationalBreakdown
                }
            }
        })

        return {
            columns: ['Accepts', 'Rejects', 'Total', 'Accept Rate', 'Org Type Breakdown', 'International Breakdown'],
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
        <div className="mt-8 space-y-8 bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Paper Review Status Results</h2>
                <button
                    onClick={exportToExcel}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Export to Excel
                </button>
            </div>
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Subcommittee Statistics</h3>
                    <div className="space-y-6">
                        {prepareSubcommitteeData().data.map((row, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <h4 className="text-lg font-medium mb-3 text-gray-900">{row.category}</h4>
                                <StatsDisplay
                                    accepts={row.values['Accepts']}
                                    rejects={row.values['Rejects']}
                                    total={row.values['Total']}
                                    acceptRate={row.values['Accept Rate']}
                                />

                                <GroupedStatus
                                    title="By Organization Type"
                                    items={row.values['Org Type Breakdown']}
                                />

                                <GroupedStatus
                                    title="By International Status"
                                    items={row.values['International Breakdown']}
                                />
                            </div>
                        ))}
                    </div>
                </div>
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
        </div>
    )
} 