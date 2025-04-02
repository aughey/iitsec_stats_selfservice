'use client'

import { useState } from 'react'
import IITSECDropZone from './components/IITSECDropZone'
import type { ExcelData } from './components/ExcelDropZone'
import AnalyticsResults from './components/AnalyticsResults'
import ExcelTable from './components/ExcelTable'
import CountryStats from './components/CountryStats'
import ValidationIssues from './components/ValidationIssues'
import PreAbstractReview from './components/PreAbstractReview'
import type { AnalyticsResultData } from './utils/iitsec_analytics'
import Section from './components/Section'
import type { ValidationResult } from './utils/validation'
import type { NonAbstractSubmissionResults, PreAbstractReviewSummary } from './utils/iitsec_analytics'

export default function Home() {
  const [excelData, setExcelData] = useState<ExcelData | null>(null)
  const [analyticsResults, setAnalyticsResults] = useState<AnalyticsResultData | null>(null)
  const [abstractResults, setAbstractResults] = useState<NonAbstractSubmissionResults | null>(null)
  const [showRawData, setShowRawData] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [preAbstractReviewResults, setPreAbstractReviewResults] = useState<PreAbstractReviewSummary[] | null>(null)

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

          {excelData && (
            <Section title="Raw Data Preview">
              <label className="flex items-center space-x-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRawData}
                  onChange={(e) => setShowRawData(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Raw Data Preview</span>
              </label>

              {showRawData && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Raw Data Preview (First 5 Rows)</h2>
                  <ExcelTable headers={excelData.headers} data={excelData.data} />
                </>
              )}
            </Section>
          )}
        </div>
      </div>
    </main>
  )
}
