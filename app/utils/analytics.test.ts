import { calculateCrossTab, processData, calculatePercentages } from './analytics'

describe('calculateCrossTab', () => {
    it('should create a cross-tabulation of two fields', () => {
        const testData = [
            { Assigned_Subcommittee: 'ECIT', Org_Type: 'Academic' },
            { Assigned_Subcommittee: 'ECIT', Org_Type: 'Industry' },
            { Assigned_Subcommittee: 'ECIT', Org_Type: 'Academic' },
            { Assigned_Subcommittee: 'HPAE', Org_Type: 'Industry' },
            { Assigned_Subcommittee: 'HPAE', Org_Type: 'Government' }
        ]

        const result = calculateCrossTab(testData, 'Assigned_Subcommittee', 'Org_Type')

        expect(result).toEqual({
            'ECIT': {
                'Academic': 2,
                'Industry': 1
            },
            'HPAE': {
                'Industry': 1,
                'Government': 1
            }
        })
    })

    it('should handle empty records array', () => {
        const result = calculateCrossTab([], 'key1', 'key2')
        expect(result).toEqual({})
    })

    it('should handle missing values', () => {
        const testData = [
            { Assigned_Subcommittee: 'ECIT', Org_Type: null },
            { Assigned_Subcommittee: null, Org_Type: 'Academic' },
            { Assigned_Subcommittee: 'ECIT', Org_Type: 'Academic' }
        ]

        const result = calculateCrossTab(testData, 'Assigned_Subcommittee', 'Org_Type')

        expect(result).toEqual({
            'ECIT': {
                'Academic': 1
            }
        })
    })

    it('should handle non-existent keys', () => {
        const testData = [
            { Assigned_Subcommittee: 'ECIT', Org_Type: 'Academic' }
        ]

        const result = calculateCrossTab(testData, 'NonExistentKey1', 'NonExistentKey2')
        expect(result).toEqual({})
    })
})

describe('processData', () => {
    it('should convert 2D array data to records', () => {
        const headers = ['Assigned_Subcommittee', 'Org_Type']
        const data = [
            ['ECIT', 'Academic'],
            ['HPAE', 'Industry']
        ]

        const result = processData(headers, data)

        expect(result.records).toEqual([
            { Assigned_Subcommittee: 'ECIT', Org_Type: 'Academic' },
            { Assigned_Subcommittee: 'HPAE', Org_Type: 'Industry' }
        ])
    })
})

describe('calculatePercentages', () => {
    it('should calculate percentages correctly', () => {
        const testData = [
            { Org_Type: 'Academic' },
            { Org_Type: 'Industry' },
            { Org_Type: 'Academic' },
            { Org_Type: 'Government' }
        ]

        const result = calculatePercentages(testData, 'Org_Type')

        expect(result).toEqual({
            'Academic': 0.5,    // 2/4
            'Industry': 0.25,   // 1/4
            'Government': 0.25  // 1/4
        })
    })
}) 