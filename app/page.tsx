'use client'

import { useState } from 'react'
import IITSECDropZone from './components/IITSECDropZone'
import type { ExcelData } from './components/ExcelDropZone'
import AnalyticsResults from './components/AnalyticsResults'
import ExcelTable from './components/ExcelTable'
import CountryStats from './components/CountryStats'
import ValidationIssues from './components/ValidationIssues'
import PreAbstractReview from './components/PreAbstractReview'
import PaperReviewStatusResults from './components/PaperReviewStatusResults'
import type { AnalyticsResultData } from './utils/iitsec_analytics'
import Section from './components/Section'
import type { ValidationResult } from './utils/validation'
import type { NonAbstractSubmissionResults, PreAbstractReviewSummary, PaperReviewStatusResults as PaperReviewStatusResultsType } from './utils/iitsec_analytics'

export default function Home() {
  const [excelData, setExcelData] = useState<ExcelData | null>(null)
  const [analyticsResults, setAnalyticsResults] = useState<AnalyticsResultData | null>(null)
  const [abstractResults, setAbstractResults] = useState<NonAbstractSubmissionResults | null>(null)
  const [showRawData, setShowRawData] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [preAbstractReviewResults, setPreAbstractReviewResults] = useState<PreAbstractReviewSummary[] | null>(null)
  const [paperReviewStatusResults, setPaperReviewStatusResults] = useState<PaperReviewStatusResultsType | null>(null)

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          IITSEC Data Analyzer
        </h1>

        {/* Top part - DropZone component */}
        <div className="mb-8">
          <IITSECDropZone
            onAnalyticsResults={setAnalyticsResults}
            onAbstractResults={setAbstractResults}
            onExcelData={setExcelData}
            onValidationResult={setValidationResult}
            onPreAbstractReviewResults={setPreAbstractReviewResults}
            onPaperReviewStatusResults={setPaperReviewStatusResults}
          />
        </div>

        {/* Bottom part - Results */}
        <div>
          {validationResult && (
            <Section title="Data Validation">
              <ValidationIssues validationResult={validationResult} />
            </Section>
          )}

          {preAbstractReviewResults && (
            <Section title="Pre-Abstract Review Summary">
              <PreAbstractReview summaries={preAbstractReviewResults} />
            </Section>
          )}

          {paperReviewStatusResults && (
            <Section title="Paper Review Status">
              <PaperReviewStatusResults results={paperReviewStatusResults} />
            </Section>
          )}

          {analyticsResults && (
            <Section title="Analytics Results">
              <AnalyticsResults
                orgTypeCrossTab={analyticsResults.orgTypeCrossTab}
                intlCrossTab={analyticsResults.intlCrossTab}
                countryCrossTab={analyticsResults.countryCrossTab}
                orgTypePercentages={analyticsResults.orgTypePercentages}
                orgTypeBySubcommitteeCrossTab={analyticsResults.orgTypeBySubcommitteeCrossTab}
              />
            </Section>
          )}

          {abstractResults && (
            <Section title="Submissions by Country">
              <CountryStats countryStats={abstractResults.countryStats} />
            </Section>
          )}

          {showRawData && excelData && (
            <Section title="Raw Data">
              <ExcelTable headers={excelData.headers} data={excelData.data} />
            </Section>
          )}
        </div>
      </div>
    </main>
  )
}
