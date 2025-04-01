'use client'

import { useCallback } from 'react'
import BaseDropZone from './BaseDropZone'

interface FileDropZoneProps {
    onFileData: (data: Uint8Array | null) => void
    accept?: Record<string, string[]>
    multiple?: boolean
}

export default function FileDropZone({
    onFileData,
    accept,
    multiple = false
}: FileDropZoneProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                const buffer = event.target?.result as ArrayBuffer
                const uint8Array = new Uint8Array(buffer)
                onFileData(uint8Array)
            } catch (error) {
                console.error('Error reading file:', error)
                onFileData(null)
            }
        }

        reader.readAsArrayBuffer(file)
    }, [onFileData])

    return (
        <BaseDropZone
            onDrop={onDrop}
            accept={accept}
            multiple={multiple}
        />
    )
} 