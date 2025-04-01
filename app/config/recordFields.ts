/**
 * Configuration file for the Birddog Review System's record fields.
 * This file defines the structure and display properties for fields used in the review interface.
 * It is used to:
 * 1. Define the available fields that can be displayed in the review table
 * 2. Specify how each field should be formatted and displayed
 * 3. Provide consistent field names and types across the application
 * 
 * The fields are used in the review interface where birddog volunteers can:
 * - View and rate submissions
 * - Provide comments for both birddog and committee review
 * - Track acceptance/rejection/discussion counts
 * - View mean ratings for substance, originality, and sales pitch
 */

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