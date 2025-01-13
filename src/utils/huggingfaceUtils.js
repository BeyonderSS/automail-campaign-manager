import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HFS_TOKEN);

export async function* generateEmailContent(purpose) {
  const prompt = `Generate a professional email for the following purpose: ${purpose}. 
  Format the email in Markdown with the following structure:
  
  Subject: [Email Subject]
  
  [Email Body]
  
  Do not include any additional text or explanations outside of the email content.`;

  const stream = await client.chatCompletionStream({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 500
  });

  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      if (newContent) {
        yield newContent;
      }
    }
  }
}

