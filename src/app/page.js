'use client'

import { useReducer } from 'react'
import { ProgressBar } from '@/components/ProgressBar'
import { FileUploader } from '@/components/FileUploader'
import { EmailEditor } from '@/components/EmailEditor'
import { EmailPreview } from '@/components/EmailPreview'
import { StartLoop } from '@/components/StartLoop'
import { ThemeToggle } from '@/components/theme-toggle'
import { SidebarTrigger } from '@/components/ui/sidebar'

const initialState = {
  step: 1,
  fileData: [],
  fields: [],
  emailTemplate: {
    subject: '',
    body: '',
    attachments: [],
  },
  currentPreviewIndex: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILE_DATA':
      return { ...state, fileData: action.payload.data, fields: action.payload.fields }
    case 'SET_EMAIL_TEMPLATE':
      return { ...state, emailTemplate: action.payload }
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 3) }
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) }
    case 'SET_PREVIEW_INDEX':
      return { ...state, currentPreviewIndex: action.payload }
    default:
      return state
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <main className="container mx-auto p-4">
  
      <div className='flex justify-center items-center py-4'>
        <ProgressBar currentStep={state.step} totalSteps={3} />

      </div>
      <div className="mt-8">
        {state.step === 1 && (
          <FileUploader
            onUpload={(data, fields) => {
              dispatch({ type: 'SET_FILE_DATA', payload: { data, fields } })
              dispatch({ type: 'NEXT_STEP' })
            }}
          />
        )}
        {state.step === 2 && (
          <EmailEditor
            onSave={(template) => {
              dispatch({ type: 'SET_EMAIL_TEMPLATE', payload: template })
              dispatch({ type: 'NEXT_STEP' })
            }}
            fields={state.fields}
          />
        )}
        {state.step === 3 && (
          <div className='flex flex-col w-full  justify-center items-center'>
            <EmailPreview
              emailTemplate={state.emailTemplate}
              previewData={state.fileData[state.currentPreviewIndex]}
              totalRecords={state.fileData.length}
              currentIndex={state.currentPreviewIndex}
              onNavigate={(index) => dispatch({ type: 'SET_PREVIEW_INDEX', payload: index })}
            />
            <StartLoop
              totalRecords={state.fileData.length}
              emailTemplate={state.emailTemplate}
              fileData={state.fileData}
            />
          </div>
        )}
      </div>
    </main>
  )
}

