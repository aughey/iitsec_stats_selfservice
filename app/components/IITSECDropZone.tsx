'use client'

import { useCallback } from 'react'
import { processData, performAnalytics, performAbstractSubmissionAnalytics, performPreAbstractReviewAnalytics, mapHeaders, columnMappings } from '../utils/analytics'
import { validateData } from '../utils/validation'
import type { ValidationResult } from '../utils/validation'
import type { NonAbstractSubmissionResults, PreAbstractReviewSummary } from '../utils/analytics'
import ExcelDropZone, { ExcelData } from './ExcelDropZone'

interface IITSECDropZoneProps {
    onAnalyticsResults: (results: ReturnType<typeof performAnalytics>) => void
    onAbstractResults: (results: NonAbstractSubmissionResults) => void
    onExcelData: (data: ExcelData | null) => void
    onValidationResult: (result: ValidationResult | null) => void
    onPreAbstractReviewResults: (results: PreAbstractReviewSummary[]) => void
}

export default function IITSECDropZone({
    onAnalyticsResults,
    onAbstractResults,
    onExcelData,
    onValidationResult,
    onPreAbstractReviewResults
}: IITSECDropZoneProps) {
    const handleExcelData = useCallback((data: ExcelData | null) => {
        if (!data) {
            // Reset all report states by passing null values to parent
            onValidationResult(null)
            onAnalyticsResults(null as any)
            onAbstractResults(null as any)
            onPreAbstractReviewResults(null as any)
            onExcelData(null)
            return
        }

        const { headers, data: rows } = data

        // Map the headers using columnMappings
        const mappedHeaders = mapHeaders(headers, columnMappings)
        const processedData = processData(mappedHeaders, rows)

        // Check which type of report we need to generate
        const hasAssignedSubcommittee = mappedHeaders.includes('Assigned_Subcommittee')
        const hasReviewerFirstname = mappedHeaders.includes('ReviewerFirstname')

        if (hasReviewerFirstname) {
            const results = performPreAbstractReviewAnalytics(processedData)
            onPreAbstractReviewResults(results)
        } else {
            // Only validate for non-pre-abstract reviewer data
            const validation = validateData(mappedHeaders, processedData.records, hasAssignedSubcommittee)
            onValidationResult(validation)

            if (hasAssignedSubcommittee) {
                const results = performAnalytics(processedData)
                onAnalyticsResults(results)
            } else {
                const results = performAbstractSubmissionAnalytics(processedData)
                onAbstractResults(results)
            }
        }

        onExcelData({ headers: mappedHeaders, data: rows.slice(0, 5) })
    }, [onAnalyticsResults, onAbstractResults, onExcelData, onValidationResult, onPreAbstractReviewResults])

    return <ExcelDropZone onExcelData={handleExcelData} />
} 