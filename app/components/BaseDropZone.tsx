'use client'

import { useDropzone } from 'react-dropzone'

interface BaseDropZoneProps {
    onDrop: (files: File[]) => void
    accept?: Record<string, string[]>
    multiple?: boolean
    className?: string
}

export default function BaseDropZone({
    onDrop,
    accept,
    multiple = false,
    className = ''
}: BaseDropZoneProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple
    })

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
                    } ${className}`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the file here...</p>
                ) : (
                    <p>Drag and drop a file here, or click to select one</p>
                )}
            </div>
        </div>
    )
} 