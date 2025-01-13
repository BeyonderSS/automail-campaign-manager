'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { populateEmailTemplate } from '@/utils/emailTemplate'
import { Badge } from './ui/badge'

export function EmailPreview({
  emailTemplate,
  previewData,
  totalRecords,
  currentIndex,
  onNavigate,
}) {
  const populatedSubject = populateEmailTemplate(emailTemplate.subject, previewData)
  const populatedBody = populateEmailTemplate(emailTemplate.body, previewData)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Email Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Subject:</h3>
          <p>{populatedSubject}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Body:</h3>
          <div 
            className="border rounded-md p-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: populatedBody }}
          />
        </div>
        {emailTemplate.attachments && emailTemplate.attachments.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Attachments:</h3>
            <ul className="list-disc pl-5">
              {emailTemplate.attachments.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span>
            Previewing <span className='text-xs p-1 bg-purple-600 text-white dark:bg-purple/20 rounded-md mx-1'>{currentIndex + 1} </span>of <span className='text-xs p-1 bg-purple-600 text-white dark:bg-purple/20 rounded-md mx-1'>{totalRecords}</span>
          </span>
          <div className="space-x-2">
            <Button
              onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => onNavigate(Math.min(totalRecords - 1, currentIndex + 1))}
              disabled={currentIndex === totalRecords - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

