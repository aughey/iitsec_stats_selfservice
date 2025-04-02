import { processData, mapHeaders, groupByKey, calculateCrossTab, calculatePercentages } from './analytics'
import { validateData } from './validation'
import type { ValidationResult } from './validation'
import type { ExcelData } from '../components/ExcelDropZone'
import type { GroupedStats, CrossTabResult, ProcessedData } from './analytics'

/**
 * Interface for non-abstract submission analysis results
 */
export interface NonAbstractSubmissionResults {
    countryStats: GroupedStats
}

/**
 * Interface for pre-abstract review summary data
 */
export interface PreAbstractReviewSummary {
    ID: string | number;
    Title: string;
    Birddog_Volunteer: string;
    Assigned_Subcommittee: string;
    Mean_Substance_Rating: number;
    Mean_Originality_Rating: number;
    Mean_Sales_Pitch: number;
    Num_Accept: number;
    Num_Reject: number;
    Num_Discuss: number;
    Comments_for_Birddog: string[];
    Comments_for_Subcommittee: string[];
}

/**
 * Interface for comprehensive analytics results
 */
export interface AnalyticsResults {
    orgTypeCrossTab: CrossTabResult;
    intlCrossTab: CrossTabResult;
    countryCrossTab: CrossTabResult;
    orgTypePercentages: { [key: string]: number };
    orgTypeBySubcommitteeCrossTab: CrossTabResult;
}

/**
 * Mapping of original column names to standardized names
 */
export const columnMappings: { [key: string]: string } = {
    '_Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_US?_': 'International(Y/N)',
    'Primary_Contact_-_Country': 'Origin_Country',
    'Education': 'ED',
    'Training': 'TR',
    'Simulation': 'SIM',
    'Initial Acceptance at Abstract Stage': 'Abstract_Accepted',
    'Initial Rejection at Abstract Stage': 'Abstract_Rejected',
    'Human Performance Analysis and Engineering': 'HPAE',
    'Emerging Concepts and Innovative Technologies': 'ECIT',
    'Policy, Standards, Management, and Acquisition': 'PSMA',
    'Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_USA?': 'International(Y/N)',
    'Rejection of Tutorial Proposal': 'Proposal_Rejected',
    'Provisional Acceptance of Tutorial Proposal': 'Proposal_Accepted',
    'Final Acceptance at Paper Review ': 'Paper_Accepted',
    'Final_Acceptance_at_Paper_Review': 'Paper_Accepted',
    'Final_Acceptance_at_Paper_Review_': 'Paper_Accepted',
    'Final Rejection at Paper Review ': 'Paper_Rejected',
    'Final Rejection at Paper Review': 'Paper_Rejected',
    'Final_Rejection_at_Paper_Review_': 'Paper_Rejected',
    'Final_Rejection_at_Paper_Review': 'Paper_Rejected',
    '2023_Best_Paper_Nominee': 'Paper_Accepted',
    '2023 Best Paper Nominee': 'Paper_Accepted',
    'Final Rejection of Tutorial': 'TUT_Rejected',
    'Final_Acceptance_of_Tutorial': 'TUT_Accepted',
    'Final Acceptance of Tutorial': 'TUT_Accepted',
    'Final Accept': 'PDW_Accepted',
    'Final_Accept': 'PDW_Accepted',
    'Final Reject': 'PDW_Rejected',
    'Final_Reject': 'PDW_Rejected',
    'Would_you_want_to_Birddog_this_Abstract_to_Paper?': 'Birddog_Volunteer',
    "Would_you_want_to_Birddog_this_submission?": "Birddog_Volunteer",
    'Comments_for_Birddog_(for_author_feedback)': 'Comments_for_Birddog',
    'Comments_for_the_Subcommittee_(reviewers)': 'Comments_for_Subcommittee',
    'Are_you_interested_in_being_the_Birddog?': 'Birddog_Volunteer',
    'Please_provide_your_2023_tutorial_number_for_reference_(if_presented_in_2023)._If_you_presented_this_topic_at_other_conference_please_list_conference_date_location_and_if_published.': 'Past_Year_Tutorial_Number',
    'Alignment:_How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?': 'Mean_Alignment',
    'Alignment:__How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?': 'Mean_Alignment',
    'Learning_Objectives:_How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?': 'Mean_Learning_Objectives',
    'Learning_Objectives:__How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?': 'Mean_Learning_Objectives',
    'Outline_&_Content_Description:_Is_the_tutorial_content_appropriate_and_is_it_clearly_described?': 'Mean_Outline_Content',
    'Outline_&_Content_Description:__Is_the_tutorial_content_appropriate_and_is_it_clearly_described?': 'Mean_Outline_Content',
    'Does_this_tutorial_proposal_appear_to_include_a_sales_pitch?': 'Num_Sales_Pitch',
    'Comments': 'Comments',
    'Comments/Remarks': 'Comments',
    'Desired_Room_Setup': 'Room_Type',
    'AbTitle': 'Title',
    'Reviewer_Comments': 'Comments',
    'Originality': 'Originality_Rating',
    'Style_/_Writing_Quality': 'Quality_Rating',
    'Birddog': 'Birddog',
    'Is_this_paper_a_Best_Paper_Candidate?': 'Best_Paper_Vote',
    'Comments_for_the_Subcommittee': 'Comments_for_Subcommittee',
    'Content_Description:_How_clear_is_the_tutorial_content_in_the_slides_and_any_author-provided_notes?': 'Content_Description',
    'Is_the_amount_of_content_appropriate_for_90_minutes?': 'Content_Quantity_Appropriate',
    'Are_the_slides_visually_clear_(readability_organization)?': 'Slide_Quality',
    'Sales_Pitch?': 'Sales_Pitch',
    'Best_Tutorial_nomination?': 'Best_Tutorial',
    'Comments_for_Birddog': 'Comments_for_Birddog',
    'Comments_for_discussion': 'Comments_for_Discussion',
    'Subcommittee_Category': 'Subcommittee',
    'Final Acceptance at Paper Stage': 'Paper_Accepted',
    'Final Rejection at Paper Stage': 'Paper_Rejected',
    'IITSEC Paper Approved': 'Paper_Accepted',
    'Best Paper Winner': 'Paper_Accepted',
    'I/ITSEC 2021 BP Paper Approved': 'Paper_Accepted',
    'Review_Status': 'Accept_Reject',
    'Paper Review Status': 'Accept_Reject',
    'Paper_Review_Status': 'Accept_Reject',
    'How_would_you_label_your_submission?': 'Org_Type',
    'Initial Acceptance of Professional Development Workshop': 'Proposal_Accepted',
    'Initial Rejection of Professional Development Workshop': 'Proposal_Rejected',
    'Initial Rejection of Professional Dev Workshop': 'Proposal_Rejected',
    'Main_Subcommittee_Category': 'Assigned_Subcommittee'
}

/**
 * Groups records by country and counts occurrences
 * @param records - Array of records containing country information
 * @returns Object with country names as keys and counts as values
 */
export function groupByCountry(records: Record<string, string | number | null>[]): { [key: string]: number } {
    return groupByKey(records, 'Country')
}

/**
 * Performs analytics on abstract submission data
 * @param processedData - Processed data containing records
 * @returns Object containing country statistics
 */
export function performAbstractSubmissionAnalytics(processedData: ProcessedData): NonAbstractSubmissionResults {
    const { records } = processedData
    const countryStats = groupByKey(records, 'Country')

    return {
        countryStats
    }
}

/**
 * Performs analytics on pre-abstract review data
 * @param data - Processed data containing review records
 * @returns Array of PreAbstractReviewSummary objects
 */
export function performPreAbstractReviewAnalytics(data: ProcessedData): PreAbstractReviewSummary[] {
    const summaries: PreAbstractReviewSummary[] = [];
    const uniqueIds = [...new Set(data.records.map(record => record.ID))];

    for (const id of uniqueIds) {
        // Get all records for this paper
        const paperRecords = data.records.filter(record => record.ID === id);
        if (paperRecords.length === 0) continue;

        // Get the first record for basic info
        const firstRecord = paperRecords[0];

        // Get birddog volunteers
        const birddogVolunteers = paperRecords
            .filter(record => record.Birddog_Volunteer === 'Yes')
            .map(record => `${record.ReviewerLastname || ''},${record.ReviewerFirstname || ''}`)
            .join('; ');

        // Calculate means - using the correct field names from Python
        const meanSubstance = calculateMean(paperRecords.map(r => Number(r['Substance Rating'] || 0)));
        const meanOriginality = calculateMean(paperRecords.map(r => Number(r['Originality Rating'] || 0)));
        const meanSalesPitch = calculateMean(paperRecords.map(r => Number(r['Sales Pitch'] || 0)));

        // Count decisions
        const numAccepts = paperRecords.filter(r => r.Acceptance === 'Accept').length;
        const numRejects = paperRecords.filter(r => r.Acceptance === 'Reject').length;
        const numDiscuss = paperRecords.filter(r => r.Acceptance === 'Discuss').length;

        // Get comments
        const birddogComments = paperRecords
            .map(r => r.Comments_for_Birddog)
            .filter((comment): comment is string =>
                typeof comment === 'string' && comment !== 'nan' && comment.trim() !== ''
            );

        const subcommitteeComments = paperRecords
            .map(r => r.Comments_for_Subcommittee)
            .filter((comment): comment is string =>
                typeof comment === 'string' && comment !== 'nan' && comment.trim() !== ''
            );

        summaries.push({
            ID: id || '',
            Title: String(firstRecord.Title || ''),
            Birddog_Volunteer: birddogVolunteers,
            Assigned_Subcommittee: String(firstRecord.Assigned_Subcommittee || ''),
            Mean_Substance_Rating: Number(meanSubstance.toFixed(2)),
            Mean_Originality_Rating: Number(meanOriginality.toFixed(2)),
            Mean_Sales_Pitch: Number(meanSalesPitch.toFixed(2)),
            Num_Accept: numAccepts,
            Num_Reject: numRejects,
            Num_Discuss: numDiscuss,
            Comments_for_Birddog: birddogComments,
            Comments_for_Subcommittee: subcommitteeComments
        });
    }

    return summaries;
}

/**
 * Calculates the mean of an array of numbers, ignoring NaN values
 * @param numbers - Array of numbers to calculate mean from
 * @returns The mean of the valid numbers, or 0 if no valid numbers exist
 */
function calculateMean(numbers: number[]): number {
    const validNumbers = numbers.filter(n => !isNaN(n));
    if (validNumbers.length === 0) return 0;
    return validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
}

/**
 * Performs comprehensive analytics on the processed data
 * @param processedData - Processed data containing records
 * @returns Object containing various cross-tabulations and percentage calculations
 */
export const performAnalytics = (processedData: ProcessedData) => {
    const { records } = processedData

    const orgTypeCrossTab = calculateCrossTab(records, 'Assigned_Subcommittee', 'Org_Type')
    const intlCrossTab = calculateCrossTab(records, 'International(Y/N)', 'Assigned_Subcommittee')
    const countryCrossTab = calculateCrossTab(records, 'Country', 'Assigned_Subcommittee')
    const orgTypePercentages = calculatePercentages(records, 'Org_Type')
    const orgTypeBySubcommitteeCrossTab = calculateCrossTab(records, 'Org_Type', 'Assigned_Subcommittee')

    return {
        orgTypeCrossTab,
        intlCrossTab,
        countryCrossTab,
        orgTypePercentages,
        orgTypeBySubcommitteeCrossTab
    }
}

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