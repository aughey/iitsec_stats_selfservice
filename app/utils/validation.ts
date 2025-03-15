export interface ValidationIssue {
    rowIndex: number;
    missingColumns: string[];
    rowData: Record<string, string | number | null>;
}

export interface ValidationResult {
    issues: ValidationIssue[];
    totalRows: number;
}

// Required columns for the analytics path (when Assigned_Subcommittee exists)
const ANALYTICS_REQUIRED_COLUMNS = [
    'ID',
    'Org_Type',
    'International(Y/N)',
    'Country',
    'Assigned_Subcommittee'
];

// Required columns for the abstract submission path
const ABSTRACT_REQUIRED_COLUMNS = [
    'ID',
    'Country',
    'International(Y/N)'
];

export function validateData(
    headers: string[],
    records: Record<string, string | number | null>[],
    hasAssignedSubcommittee: boolean
): ValidationResult {
    const requiredColumns = hasAssignedSubcommittee
        ? ANALYTICS_REQUIRED_COLUMNS
        : ABSTRACT_REQUIRED_COLUMNS;

    const issues: ValidationIssue[] = [];

    records.forEach((record, index) => {
        const missingColumns = requiredColumns.filter(column => {
            const value = record[column];
            return value === null || value === undefined || value === '';
        });

        if (missingColumns.length > 0) {
            issues.push({
                rowIndex: index + 1, // +1 for human-readable row numbers
                missingColumns,
                rowData: record
            });
        }
    });

    return {
        issues,
        totalRows: records.length
    };
} 