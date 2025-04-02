'use client'

import { useCallback } from 'react'
import type { ValidationResult } from '../utils/validation'
import type { NonAbstractSubmissionResults, PreAbstractReviewSummary } from '../utils/iitsec_analytics'
import { performAnalytics } from '../utils/iitsec_analytics'
import ExcelDropZone, { ExcelData } from './ExcelDropZone'
import { processIITSECData } from '../utils/iitsec_analytics'

interface IITSECDropZoneProps {
    onAnalyticsResults: (results: ReturnType<typeof performAnalytics> | null) => void
    onAbstractResults: (results: NonAbstractSubmissionResults | null) => void
    onExcelData: (data: ExcelData | null) => void
    onValidationResult: (result: ValidationResult | null) => void
    onPreAbstractReviewResults: (results: PreAbstractReviewSummary[] | null) => void
}

export default function IITSECDropZone({
    onAnalyticsResults,
    onAbstractResults,
    onExcelData,
    onValidationResult,
    onPreAbstractReviewResults
}: IITSECDropZoneProps) {
    const handleExcelData = useCallback((data: ExcelData | null) => {
        const {
            validationResult,
            analyticsResults,
            abstractResults,
            preAbstractReviewResults,
            excelData
        } = processIITSECData(data)

        onValidationResult(validationResult)
        onAnalyticsResults(analyticsResults)
        onAbstractResults(abstractResults)
        onPreAbstractReviewResults(preAbstractReviewResults)
        onExcelData(excelData)
    }, [onAnalyticsResults, onAbstractResults, onExcelData, onValidationResult, onPreAbstractReviewResults])

    return <ExcelDropZone onExcelData={handleExcelData} />
} 