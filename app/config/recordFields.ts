import React from 'react';

export interface RecordField {
    key: string;
    displayName: string;
    type: 'string' | 'number' | 'array' | 'comment';
}

export const recordFields: RecordField[] = [
    { key: 'ID', displayName: 'ID', type: 'string' },
    { key: 'Title', displayName: 'Title', type: 'string' },
    { key: 'Birddog_Volunteer', displayName: 'Birddog Volunteer', type: 'string' },
    { key: 'Mean_Substance_Rating', displayName: 'Mean Substance Rating', type: 'number' },
    { key: 'Mean_Originality_Rating', displayName: 'Mean Originality Rating', type: 'number' },
    { key: 'Mean_Sales_Pitch', displayName: 'Mean Sales Pitch', type: 'number' },
    { key: 'Num_Accept', displayName: 'Accept', type: 'number' },
    { key: 'Num_Reject', displayName: 'Reject', type: 'number' },
    { key: 'Num_Discuss', displayName: 'Discuss', type: 'number' },
    { key: 'Comments_for_Birddog', displayName: 'Birddog Comments', type: 'comment' },
    { key: 'Comments_for_Subcommittee', displayName: 'Committee Comments', type: 'comment' }
];

export function getFieldDisplayName(key: string): string {
    const field = recordFields.find(f => f.key === key);
    return field ? field.displayName : key;
}

export function formatFieldValue(field: RecordField, value: any): string {
    if (value === null || value === undefined) return '';

    if (field.type === 'comment' || field.type === 'array') {
        if (!Array.isArray(value)) return '-';
        if (value.length === 0) return '-';
        return value.map(v => String(v)).join('; ');
    }

    if (field.type === 'number') {
        return Number(value).toFixed(2);
    }

    return String(value);
} 