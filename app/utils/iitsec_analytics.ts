import { processData, performAnalytics, performAbstractSubmissionAnalytics, performPreAbstractReviewAnalytics, mapHeaders, columnMappings } from './analytics'
import { validateData } from './validation'
import type { ValidationResult } from './validation'
import type { NonAbstractSubmissionResults, PreAbstractReviewSummary, AnalyticsResults } from './analytics'
import type { ExcelData } from '../components/ExcelDropZone'

interface IITSECAnalyticsResults {
    validationResult: ValidationResult | null;
    analyticsResults: AnalyticsResults | null;
    abstractResults: NonAbstractSubmissionResults | null;
    preAbstractReviewResults: PreAbstractReviewSummary[] | null;
    excelData: ExcelData | null;
}

/**
 * This processes whatever excel data is passed in and will provide content for
 * the different reports if the excel data contains the appropriate columns.
 * @param data - Excel data to process
 * @returns Analytics results containing validation, analytics, abstract, pre-abstract review, and Excel data
 */
export function processIITSECData(data: ExcelData | null): IITSECAnalyticsResults {
    if (!data) {
        return {
            validationResult: null,
            analyticsResults: null,
            abstractResults: null,
            preAbstractReviewResults: null,
            excelData: null
        }
    }

    const { headers, data: rows } = data

    // Map the headers using columnMappings
    const mappedHeaders = mapHeaders(headers, columnMappings)
    const processedData = processData(mappedHeaders, rows)

    // Check which type of report we need to generate
    const hasAssignedSubcommittee = mappedHeaders.includes('Assigned_Subcommittee')
    const hasReviewerFirstname = mappedHeaders.includes('ReviewerFirstname')

    if (hasReviewerFirstname) {
        return {
            validationResult: null,
            analyticsResults: null,
            abstractResults: null,
            preAbstractReviewResults: performPreAbstractReviewAnalytics(processedData),
            excelData: { headers: mappedHeaders, data: rows.slice(0, 5) }
        }
    } else {
        // Only validate for non-pre-abstract reviewer data
        const validation = validateData(mappedHeaders, processedData.records, hasAssignedSubcommittee)

        if (hasAssignedSubcommittee) {
            return {
                validationResult: validation,
                analyticsResults: performAnalytics(processedData),
                abstractResults: null,
                preAbstractReviewResults: null,
                excelData: { headers: mappedHeaders, data: rows.slice(0, 5) }
            }
        } else {
            return {
                validationResult: validation,
                analyticsResults: null,
                abstractResults: performAbstractSubmissionAnalytics(processedData),
                preAbstractReviewResults: null,
                excelData: { headers: mappedHeaders, data: rows.slice(0, 5) }
            }
        }
    }
} 