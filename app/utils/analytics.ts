export interface CrossTabResult {
    [key: string]: { [key: string]: number }
}

export interface ProcessedData {
    headers: string[]
    data: (string | number)[][]
    records: Record<string, string | number>[]
}

export const processData = (headers: string[], data: (string | number)[][]): ProcessedData => {
    // Convert 2D array to array of objects
    const records = data.map(row => {
        const record: Record<string, string | number> = {}
        headers.forEach((header, index) => {
            record[header] = row[index]
        })
        return record
    })

    return { headers, data, records }
}

export const calculateCrossTab = (records: Record<string, string | number>[], key1: string, key2: string): CrossTabResult => {
    const result: CrossTabResult = {}

    records.forEach(record => {
        const val1 = String(record[key1])
        const val2 = String(record[key2])

        if (val1 && val2) {
            if (!result[val1]) {
                result[val1] = {}
            }
            if (!result[val1][val2]) {
                result[val1][val2] = 0
            }
            result[val1][val2]++
        }
    })

    return result
}

export const calculatePercentages = (records: Record<string, string | number>[], key: string): { [key: string]: number } => {
    const counts: { [key: string]: number } = {}
    let total = 0

    records.forEach(record => {
        const value = String(record[key])
        if (value) {
            counts[value] = (counts[value] || 0) + 1
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