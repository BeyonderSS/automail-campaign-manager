'use server'

import { createQueue, getQueueStatus } from '@/utils/emailUtils';
import { generateEmailContent } from '@/utils/huggingfaceUtils';

export async function startEmailQueue(emails) {
  try {
    const queueId = await createQueue(emails);
    return { success: true, queueId };
  } catch (error) {
    console.error('Failed to start email queue:', error);
    return { success: false, error: error.message };
  }
}

export async function checkQueueStatus(queueId) {
  try {
    const status = await getQueueStatus(queueId);
    return { success: true, ...status };
  } catch (error) {
    console.error('Failed to check queue status:', error);
    return { success: false, error: error.message };
  }
}

export async function streamAIEmailTemplate(purpose, dynamicFields) {
  const stream = generateEmailContent(purpose, dynamicFields); // Pass dynamic fields to AI content generator
  return new ReadableStream({
    async start(controller) {
      try {
        // Fetch the email content in chunks
        for await (const chunk of stream) {
          const encodedChunk = new TextEncoder().encode(JSON.stringify(chunk)); // Convert chunk to string (object with subject and body)
          controller.enqueue(encodedChunk);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}


