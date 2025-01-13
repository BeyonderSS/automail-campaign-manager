'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { startEmailQueue, checkQueueStatus } from '@/app/actions/emailAction'
import { populateEmailTemplate } from '@/utils/emailTemplate'

export function StartLoop({ totalRecords, emailTemplate, fileData }) {
  const [isLooping, setIsLooping] = useState(false)
  const [progress, setProgress] = useState(0)
  const [queueId, setQueueId] = useState(null)

  useEffect(() => {
    const storedQueueId = localStorage.getItem('emailQueueId');
    if (storedQueueId) {
      setQueueId(storedQueueId);
      setIsLooping(true);
    }
  }, []);

  useEffect(() => {
    let intervalId;
    if (isLooping && queueId) {
      intervalId = setInterval(async () => {
        try {
          const result = await checkQueueStatus(queueId);
          if (result.success) {
            if (result.status === 'completed') {
              setIsLooping(false);
              setProgress(100);
              localStorage.removeItem('emailQueueId');
            } else if (result.status === 'processing') {
              setProgress((result.sentCount / result.totalCount) * 100);
            }
          } else {
            console.error('Failed to get queue status:', result.error);
          }
        } catch (error) {
          console.error('Failed to get queue status:', error);
        }
      }, 5000); // Check status every 5 seconds
    }
    return () => clearInterval(intervalId);
  }, [isLooping, queueId]);

  const handleStartLoop = async () => {
    setIsLooping(true);
    setProgress(0);

    const emails = fileData.map(row => ({
      to: row.email,
      subject: populateEmailTemplate(emailTemplate.subject, row),
      body: populateEmailTemplate(emailTemplate.body, row),
      attachments: emailTemplate.attachments.map(file => ({
        filename: file.name,
        path: file.path,
      })),
    }));

    try {
      const result = await startEmailQueue(emails);
      if (result.success) {
        setQueueId(result.queueId);
        localStorage.setItem('emailQueueId', result.queueId);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to start email loop:', error);
      setIsLooping(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <Button onClick={handleStartLoop} className="bg-purple hover:bg-purple-dark text-white" disabled={isLooping}>
        {isLooping ? 'Sending Emails...' : 'Start Loop'}
      </Button>
      {isLooping && (
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="text-sm text-gray-500">
            Sent {Math.floor((progress / 100) * totalRecords)} of {totalRecords} emails
          </div>
        </div>
      )}
    </div>
  )
}

