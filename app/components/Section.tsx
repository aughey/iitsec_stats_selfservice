import { ReactNode } from 'react'

interface SectionProps {
    title: string
    children: ReactNode
}

export default function Section({ title, children }: SectionProps) {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            {children}
        </div>
    )
} 