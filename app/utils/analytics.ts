export interface CrossTabResult {
    [key: string]: { [key: string]: number }
}

export interface ProcessedData {
    headers: string[]
    data: (string | number | null)[][]
    records: Record<string, string | number | null>[]
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
            const strVal1 = String(val1)
            const strVal2 = String(val2)

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
            const strValue = String(value)
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
    const countryCrossTab = calculateCrossTab(records, 'Origin_Country', 'Assigned_Subcommittee')
    const orgTypePercentages = calculatePercentages(records, 'Org_Type')

    return {
        orgTypeCrossTab,
        intlCrossTab,
        countryCrossTab,
        orgTypePercentages
    }
} 