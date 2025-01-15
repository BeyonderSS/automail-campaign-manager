import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HFS_TOKEN);
export async function* generateEmailContent(purpose, dynamicFields) {
  // Construct the prompt with dynamic fields
  const dynamicFieldPlaceholders = dynamicFields.map(field => `{{${field}}}`).join(", ");
  const prompt = `Generate a professional email for the following purpose: ${purpose}. 
  The email should include the following dynamic fields: ${dynamicFieldPlaceholders}.
  Format the email in Markdown with the following structure:
  
  Subject: [Email Subject]
  
  [Email Body]
  
  Please replace the dynamic fields with appropriate placeholders like {{name}}, {{company}}, etc.
  Do not include any additional text or explanations outside of the email content.`;

  // Send the prompt to the HuggingFace API for chat completion
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

  // Yield chunks of response from the model
  let fullContent = "";
  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      if (newContent) {
        fullContent += newContent;

        // Check if we've received both the subject and body
        if (fullContent.includes("Subject:")) {
          const subjectMatch = fullContent.match(/Subject:\s*(.*)/);
          if (subjectMatch) {
            const subject = subjectMatch[1].trim();
            yield { subject, body: fullContent.replace(subjectMatch[0], "").trim() };
          }
        }
      }
    }
  }
}

