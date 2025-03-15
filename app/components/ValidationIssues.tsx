'use client'

import { useState } from 'react'
import type { ValidationResult } from '../utils/validation'
import React from 'react'

interface ValidationIssuesProps {
    validationResult: ValidationResult;
}

const ValidationIssues: React.FC<ValidationIssuesProps> = ({ validationResult }) => {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRow = (rowIndex: number) => {
        const newExpandedRows = new Set(expandedRows);
        if (expandedRows.has(rowIndex)) {
            newExpandedRows.delete(rowIndex);
        } else {
            newExpandedRows.add(rowIndex);
        }
        setExpandedRows(newExpandedRows);
    };

    if (validationResult.issues.length === 0) {
        return (
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                No validation issues found in {validationResult.totalRows} rows.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                Found {validationResult.issues.length} rows with missing data out of {validationResult.totalRows} total rows.
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Row
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Missing Fields
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {validationResult.issues.map((issue) => (
                            <React.Fragment key={issue.rowIndex}>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {issue.rowIndex}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {issue.missingColumns.join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => toggleRow(issue.rowIndex)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            {expandedRows.has(issue.rowIndex) ? 'Hide Details' : 'Show Details'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedRows.has(issue.rowIndex) && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                <h4 className="font-semibold mb-2">Row Data:</h4>
                                                <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
                                                    {JSON.stringify(issue.rowData, null, 2)}
                                                </pre>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ValidationIssues; 