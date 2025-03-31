export interface CrossTabResult {
    [key: string]: { [key: string]: number }
}

export interface ProcessedData {
    headers: string[]
    data: (string | number | null)[][]
    records: Record<string, string | number | null>[]
}

export interface CountryStats {
    [country: string]: number
}

export interface NonAbstractSubmissionResults {
    countryStats: CountryStats
}

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

export function groupByCountry(records: Record<string, string | number | null>[]): CountryStats {
    const result: CountryStats = {}

    records.forEach(record => {
        const country = record['Country']
        if (country != null) {
            const strCountry = String(country)
            result[strCountry] = (result[strCountry] || 0) + 1
        }
    })

    return result
}

export function performAbstractSubmissionAnalytics(processedData: ProcessedData): NonAbstractSubmissionResults {
    const { records } = processedData
    const countryStats = groupByCountry(records)

    return {
        countryStats
    }
}

export const processData = (headers: string[], data: (string | number | null)[][]): ProcessedData => {
    // Convert 2D array to array of objects
    const records = data.map(row => {
        const record: Record<string, string | number | null> = {}
        headers.forEach((header, index) => {
            record[header] = row[index]
        })
        return record
    })

    return { headers, data, records }
}

export const calculateCrossTab = (records: Record<string, string | number | null>[], key1: string, key2: string): CrossTabResult => {
    const result: CrossTabResult = {}

    records.forEach(record => {
        const val1 = record[key1]
        const val2 = record[key2]

        if (val1 != null && val2 != null) {
            let strVal1 = String(val1)
            let strVal2 = String(val2)
            if (strVal1.length === 0) {
                strVal1 = 'unknown'
            }
            if (strVal2.length === 0) {
                strVal2 = 'unknown'
            }

            if (!result[strVal1]) {
                result[strVal1] = {}
            }
            if (!result[strVal1][strVal2]) {
                result[strVal1][strVal2] = 0
            }
            result[strVal1][strVal2]++
        }
    })

    return result
}

export const calculatePercentages = (records: Record<string, string | number | null>[], key: string): { [key: string]: number } => {
    const counts: { [key: string]: number } = {}
    let total = 0

    records.forEach(record => {
        const value = record[key]
        if (value != null) {
            let strValue = String(value)
            if (strValue.length === 0) {
                strValue = 'unknown'
            }
            counts[strValue] = (counts[strValue] || 0) + 1
            total++
        }
    })

    const percentages: { [key: string]: number } = {}
    Object.entries(counts).forEach(([key, count]) => {
        percentages[key] = count / total
    })

    return percentages
}

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

function calculateMean(numbers: number[]): number {
    const validNumbers = numbers.filter(n => !isNaN(n));
    if (validNumbers.length === 0) return 0;
    return validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
} 