/**
 * Interface representing a cross-tabulation result with nested key-value pairs
 */
export interface CrossTabResult {
    [key: string]: { [key: string]: number }
}

/**
 * Interface representing processed data with headers, raw data, and records
 */
export interface ProcessedData {
    headers: string[]
    data: (string | number | null)[][]
    records: Record<string, string | number | null>[]
}

/**
 * Interface representing statistics grouped by any key
 */
export interface GroupedStats {
    [key: string]: number
}

/**
 * Groups records by a specified key and counts occurrences
 * @param records - Array of records containing the key information
 * @param key - The key to group by
 * @returns Object with key values as keys and counts as values
 */
export function groupByKey(records: Record<string, string | number | null>[], key: string): GroupedStats {
    const result: GroupedStats = {}

    records.forEach(record => {
        const value = record[key]
        if (value != null) {
            const strValue = String(value)
            result[strValue] = (result[strValue] || 0) + 1
        }
    })

    return result
}

/**
 * Processes raw data into a structured format
 * @param headers - Array of column headers
 * @param data - 2D array of raw data
 * @returns ProcessedData object containing headers, raw data, and records
 */
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

/**
 * Calculates cross-tabulation between two fields in the records
 * @param records - Array of records to analyze
 * @param key1 - First field to cross-tabulate
 * @param key2 - Second field to cross-tabulate
 * @returns CrossTabResult object containing the cross-tabulation counts
 */
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

/**
 * Calculates percentage distribution of values for a given field
 * @param records - Array of records to analyze
 * @param key - Field to calculate percentages for
 * @returns Object with values as keys and their percentages as values
 */
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

/**
 * Maps original headers to standardized names using provided mappings
 * @param headers - Array of original headers to map
 * @param mappings - Object containing header name mappings
 * @returns Array of mapped headers
 */
export function mapHeaders(headers: string[], mappings: { [key: string]: string }): string[] {
    return headers.map(header => {
        // First replace spaces with underscores to match Python format
        const normalizedHeader = header.replace(/ /g, '_')
        return mappings[normalizedHeader] || mappings[header] || header
    })
} 