'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import AnalyticsResults from './components/AnalyticsResults'
import { processData, performAnalytics } from './utils/analytics'

// interface ExcelData {
//   headers: string[]
//   data: (string | number)[][]
// }

// Column mappings from Python code
const columnMappings: { [key: string]: string } = {
  '_Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_US?_': 'International(Y/N)',
  'Primary_Contact_-_Country': 'Origin_Country',
  'Education': 'ED',
  'Training': 'TR',
  'Simulation': 'SIM',
  'Initial Acceptance at Abstract Stage': 'Abstract_Accepted',
  'Initial Rejection at Abstract Stage': 'Abstract_Rejected',
  'Human Performance Analysis and Engineering': 'HPAE',
  'Emerging Concepts and Innovative Technologies': 'ECIT',
  'Policy, Standards, Management, and Acquisition': 'PSMA',
  'Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_USA?': 'International(Y/N)',
  'Rejection of Tutorial Proposal': 'Proposal_Rejected',
  'Provisional Acceptance of Tutorial Proposal': 'Proposal_Accepted',
  'Final Acceptance at Paper Review ': 'Paper_Accepted',
  'Final_Acceptance_at_Paper_Review': 'Paper_Accepted',
  'Final_Acceptance_at_Paper_Review_': 'Paper_Accepted',
  'Final Rejection at Paper Review ': 'Paper_Rejected',
  'Final Rejection at Paper Review': 'Paper_Rejected',
  'Final_Rejection_at_Paper_Review_': 'Paper_Rejected',
  'Final_Rejection_at_Paper_Review': 'Paper_Rejected',
  '2023_Best_Paper_Nominee': 'Paper_Accepted',
  '2023 Best Paper Nominee': 'Paper_Accepted',
  'Final Rejection of Tutorial': 'TUT_Rejected',
  'Final_Acceptance_of_Tutorial': 'TUT_Accepted',
  'Final Acceptance of Tutorial': 'TUT_Accepted',
  'Final Accept': 'PDW_Accepted',
  'Final_Accept': 'PDW_Accepted',
  'Final Reject': 'PDW_Rejected',
  'Final_Reject': 'PDW_Rejected',
  'Would_you_want_to_Birddog_this_Abstract_to_Paper?': 'Birddog_Volunteer',
  'Comments_for_Birddog_(for_author_feedback)': 'Comments_for_Birddog',
  'Comments_for_the_Subcommittee_(reviewers)': 'Comments_for_Subcommittee',
  'Are_you_interested_in_being_the_Birddog?': 'Birddog_Volunteer',
  'Please_provide_your_2023_tutorial_number_for_reference_(if_presented_in_2023)._If_you_presented_this_topic_at_other_conference_please_list_conference_date_location_and_if_published.': 'Past_Year_Tutorial_Number',
  'Alignment:_How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?': 'Mean_Alignment',
  'Alignment:__How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?': 'Mean_Alignment',
  'Learning_Objectives:_How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?': 'Mean_Learning_Objectives',
  'Learning_Objectives:__How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?': 'Mean_Learning_Objectives',
  'Outline_&_Content_Description:_Is_the_tutorial_content_appropriate_and_is_it_clearly_described?': 'Mean_Outline_Content',
  'Outline_&_Content_Description:__Is_the_tutorial_content_appropriate_and_is_it_clearly_described?': 'Mean_Outline_Content',
  'Does_this_tutorial_proposal_appear_to_include_a_sales_pitch?': 'Num_Sales_Pitch',
  'Comments': 'Comments',
  'Comments/Remarks': 'Comments',
  'Desired_Room_Setup': 'Room_Type',
  'AbTitle': 'Title',
  'Reviewer_Comments': 'Comments',
  'Originality': 'Originality_Rating',
  'Style_/_Writing_Quality': 'Quality_Rating',
  'Birddog': 'Birddog',
  'Is_this_paper_a_Best_Paper_Candidate?': 'Best_Paper_Vote',
  'Comments_for_the_Subcommittee': 'Comments_for_Subcommittee',
  'Content_Description:_How_clear_is_the_tutorial_content_in_the_slides_and_any_author-provided_notes?': 'Content_Description',
  'Is_the_amount_of_content_appropriate_for_90_minutes?': 'Content_Quantity_Appropriate',
  'Are_the_slides_visually_clear_(readability_organization)?': 'Slide_Quality',
  'Sales_Pitch?': 'Sales_Pitch',
  'Best_Tutorial_nomination?': 'Best_Tutorial',
  'Comments_for_Birddog': 'Comments_for_Birddog',
  'Comments_for_discussion': 'Comments_for_Discussion',
  'Subcommittee_Category': 'Subcommittee',
  'Final Acceptance at Paper Stage': 'Paper_Accepted',
  'Final Rejection at Paper Stage': 'Paper_Rejected',
  'IITSEC Paper Approved': 'Paper_Accepted',
  'Best Paper Winner': 'Paper_Accepted',
  'I/ITSEC 2021 BP Paper Approved': 'Paper_Accepted',
  'Review_Status': 'Accept_Reject',
  'Paper Review Status': 'Accept_Reject',
  'Paper_Review_Status': 'Accept_Reject',
  'How_would_you_label_your_submission?': 'Org_Type',
  'Initial Acceptance of Professional Development Workshop': 'Proposal_Accepted',
  'Initial Rejection of Professional Development Workshop': 'Proposal_Rejected',
  'Initial Rejection of Professional Dev Workshop': 'Proposal_Rejected',
  'Main_Subcommittee_Category': 'Assigned_Subcommittee'
}

export default function Home() {
  ///  const [excelData, setExcelData] = useState<ExcelData | null>(null)
  const [analyticsResults, setAnalyticsResults] = useState<ReturnType<typeof performAnalytics> | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer
        const uint8Array = new Uint8Array(buffer)
        const workbook = XLSX.read(uint8Array, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | null)[][]

        if (jsonData.length > 0) {
          // Get the original headers
          const originalHeaders = jsonData[0] as string[]

          // Map the headers using columnMappings
          const mappedHeaders = originalHeaders.map(header => {
            // First replace spaces with underscores to match Python format
            const normalizedHeader = header.replace(/ /g, '_')
            return columnMappings[normalizedHeader] || columnMappings[header] || header
          })

          const rows = jsonData.slice(1) as (string | number | null)[][]
          const processedData = processData(mappedHeaders, rows)
          const results = performAnalytics(processedData)

          //setExcelData({ headers: mappedHeaders, data: rows })
          setAnalyticsResults(results)
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error)
        alert('Error parsing Excel file. Please make sure it\'s a valid .xlsx file.')
      }
    }

    reader.readAsArrayBuffer(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          IITSEC Data Analyzer
        </h1>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
            }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the Excel file here...</p>
          ) : (
            <p>Drag and drop an Excel file here, or click to select one</p>
          )}
        </div>

        {analyticsResults && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Analytics Results</h2>
            <AnalyticsResults
              orgTypeCrossTab={analyticsResults.orgTypeCrossTab}
              intlCrossTab={analyticsResults.intlCrossTab}
              countryCrossTab={analyticsResults.countryCrossTab}
              orgTypePercentages={analyticsResults.orgTypePercentages}
            />
          </div>
        )}
      </div>
    </main>
  )
}
