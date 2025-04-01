# DropZone Component Hierarchy

> **Note**: This documentation was AI-generated from the source files on March 19, 2024. The interfaces and functionality described herein are subject to change as the codebase evolves. Please refer to the actual source files for the most up-to-date implementation details.

## Overview
The DropZone component system is designed with a layered architecture that separates concerns and responsibilities for handling file uploads in the application. The system consists of four main components that work together to provide a flexible and maintainable file handling solution.

## Component Hierarchy

### 1. BaseDropZone
The foundation component that handles the basic UI and file drop functionality.

**Responsibilities:**
- Provides the visual UI for file dropping
- Handles drag and drop events
- Manages file input element
- Provides visual feedback during drag operations

**Props:**
```typescript
interface BaseDropZoneProps {
    onDrop: (files: File[]) => void
    accept?: Record<string, string[]>
    multiple?: boolean
    className?: string
}
```

### 2. FileDropZone
A specialized component that handles file reading operations.

**Responsibilities:**
- Reads file contents using FileReader API
- Converts file data to Uint8Array format
- Handles file reading errors
- Provides file data to parent components

**Props:**
```typescript
interface FileDropZoneProps {
    onFileData: (data: Uint8Array | null) => void
    accept?: Record<string, string[]>
    multiple?: boolean
}
```

### 3. ExcelDropZone
A specialized component for handling Excel file parsing.

**Responsibilities:**
- Parses Excel files using XLSX library
- Extracts headers and data from Excel sheets
- Handles Excel parsing errors
- Provides structured Excel data to parent components

**Props:**
```typescript
interface ExcelDropZoneProps {
    onExcelData: (data: ExcelData | null) => void
}

interface ExcelData {
    headers: string[]
    data: (string | number | null)[][]
}
```

### 4. IITSECDropZone
The top-level component that handles IITSEC-specific business logic.

**Responsibilities:**
- Processes Excel data for IITSEC requirements
- Performs data validation
- Generates analytics results
- Handles different types of IITSEC reports

**Props:**
```typescript
interface IITSECDropZoneProps {
    onAnalyticsResults: (results: AnalyticsResults) => void
    onAbstractResults: (results: NonAbstractSubmissionResults) => void
    onExcelData: (data: ExcelData | null) => void
    onValidationResult: (result: ValidationResult | null) => void
    onPreAbstractReviewResults: (results: PreAbstractReviewSummary[]) => void
}
```

## Component Relationships

```
IITSECDropZone
    └── ExcelDropZone
        └── FileDropZone
            └── BaseDropZone
```

## Data Flow

1. User drops a file into the UI
2. `BaseDropZone` captures the file drop event
3. `FileDropZone` reads the file and converts it to a `Uint8Array`
4. `ExcelDropZone` parses the `Uint8Array` into structured Excel data
5. `IITSECDropZone` processes the Excel data according to IITSEC requirements

## Error Handling

Each component in the hierarchy handles errors at its appropriate level:

- `BaseDropZone`: Handles UI-related errors
- `FileDropZone`: Handles file reading errors
- `ExcelDropZone`: Handles Excel parsing errors
- `IITSECDropZone`: Handles business logic errors

## Benefits of This Design

1. **Separation of Concerns**: Each component has a single, well-defined responsibility
2. **Reusability**: Components can be used independently or in different combinations
3. **Maintainability**: Issues can be isolated to specific components
4. **Flexibility**: Easy to add new file type handlers or modify existing ones
5. **Testability**: Each component can be tested in isolation

## Usage Example

```typescript
// Basic file drop
<BaseDropZone onDrop={handleDrop} />

// File reading
<FileDropZone onFileData={handleFileData} />

// Excel parsing
<ExcelDropZone onExcelData={handleExcelData} />

// IITSEC processing
<IITSECDropZone
    onAnalyticsResults={handleAnalytics}
    onAbstractResults={handleAbstracts}
    onExcelData={handleExcelData}
    onValidationResult={handleValidation}
    onPreAbstractReviewResults={handlePreAbstract}
/>
``` 