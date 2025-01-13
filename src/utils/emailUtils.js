"use server"
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const queues = new Map();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function createQueue(emails) {
  const queueId = uuidv4();
  queues.set(queueId, {
    emails,
    sentCount: 0,
    status: 'pending',
  });
  processQueue(queueId);
  return queueId;
}

export async function getQueueStatus(queueId) {
  const queue = queues.get(queueId);
  if (!queue) {
    return { status: 'not_found' };
  }
  return {
    status: queue.status,
    sentCount: queue.sentCount,
    totalCount: queue.emails.length,
  };
}

async function processQueue(queueId) {
  const queue = queues.get(queueId);
  if (!queue || queue.status === 'completed') return;

  queue.status = 'processing';

  while (queue.sentCount < queue.emails.length) {
    const email = queue.emails[queue.sentCount];
    try {
      await sendEmail(email);
      queue.sentCount++;
      await new Promise(resolve => setTimeout(resolve, 120000)); // 2-minute delay
    } catch (error) {
      console.error('Failed to send email:', error);
      // Log the error and continue with the next email
    }
  }

  queue.status = 'completed';
}

async function sendEmail(email) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email.to,
    subject: email.subject,
    html: email.body,
    attachments: email.attachments,
  });
}

