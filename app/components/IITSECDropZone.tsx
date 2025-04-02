'use client'

import { useCallback } from 'react'
import type { ValidationResult } from '../utils/validation'
import type { NonAbstractSubmissionResults, PreAbstractReviewSummary, PaperReviewStatusResults } from '../utils/iitsec_analytics'
import ExcelDropZone, { ExcelData } from './ExcelDropZone'
import { processIITSECData } from '../utils/iitsec_analytics'
import type { AnalyticsResultData } from '../utils/iitsec_analytics'

interface IITSECDropZoneProps {
    onAnalyticsResults: (results: AnalyticsResultData | null) => void
    onAbstractResults: (results: NonAbstractSubmissionResults | null) => void
    onExcelData: (data: ExcelData | null) => void
    onValidationResult: (result: ValidationResult | null) => void
    onPreAbstractReviewResults: (results: PreAbstractReviewSummary[] | null) => void
    onPaperReviewStatusResults: (results: PaperReviewStatusResults | null) => void
}

export default function IITSECDropZone({
    onAnalyticsResults,
    onAbstractResults,
    onExcelData,
    onValidationResult,
    onPreAbstractReviewResults,
    onPaperReviewStatusResults
}: IITSECDropZoneProps) {
    const handleExcelData = useCallback((data: ExcelData | null) => {
        const {
            validationResult,
            analyticsResults,
            abstractResults,
            preAbstractReviewResults,
            paperReviewStatusResults,
            excelData
        } = processIITSECData(data)

        onValidationResult(validationResult)
        onAnalyticsResults(analyticsResults)
        onAbstractResults(abstractResults)
        onPreAbstractReviewResults(preAbstractReviewResults)
        onPaperReviewStatusResults(paperReviewStatusResults)
        onExcelData(excelData)
    }, [onAnalyticsResults, onAbstractResults, onExcelData, onValidationResult, onPreAbstractReviewResults, onPaperReviewStatusResults])

    return <ExcelDropZone onExcelData={handleExcelData} />
} 