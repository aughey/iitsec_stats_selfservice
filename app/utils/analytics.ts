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
                console.log('empty strVal1')
                console.log(record)
                strVal1 = 'unknown'
            }
            if (strVal2.length === 0) {
                console.log('empty strVal2')
                console.log(record)
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
                console.log(`empty value for key ${key}`)
                console.log(record)
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

    return {
        orgTypeCrossTab,
        intlCrossTab,
        countryCrossTab,
        orgTypePercentages
    }
} 