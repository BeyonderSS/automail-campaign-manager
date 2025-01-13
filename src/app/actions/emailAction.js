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

export async function streamAIEmailTemplate(purpose) {
  const stream = generateEmailContent(purpose); // Assuming this generates strings
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const encodedChunk = new TextEncoder().encode(chunk); // Convert string to Uint8Array
          controller.enqueue(encodedChunk);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}


