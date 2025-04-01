'use client'

import { useCallback } from 'react'
import * as XLSX from 'xlsx'
import FileDropZone from './FileDropZone'

export interface ExcelData {
    headers: string[]
    data: (string | number | null)[][]
}

interface ExcelDropZoneProps {
    onExcelData: (data: ExcelData | null) => void
}

export default function ExcelDropZone({ onExcelData }: ExcelDropZoneProps) {
    const onFileData = useCallback((uint8Array: Uint8Array | null) => {
        if (!uint8Array) {
            onExcelData(null)
            return
        }

        try {
            const workbook = XLSX.read(uint8Array, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | null)[][]

            if (jsonData.length > 0) {
                const headers = jsonData[0] as string[]
                const data = jsonData.slice(1)
                onExcelData({ headers, data })
            }
        } catch (error) {
            console.error('Error parsing Excel file:', error)
            alert('Error parsing Excel file. Please make sure it\'s a valid .xlsx file.')
            onExcelData(null)
        }
    }, [onExcelData])

    return (
        <FileDropZone
            onFileData={onFileData}
            accept={{
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
            }}
            multiple={false}
        />
    )
} 