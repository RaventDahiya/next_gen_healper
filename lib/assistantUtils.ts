import { ASSISTANT } from "@/app/(main)/ai-assistants/page";

/**
 * Formats the assistant's instruction for use as a system message
 * Combines base instruction with user custom instruction
 */
export function formatAssistantInstruction(assistant: any): string {
  let instruction = assistant.instruction || "";

  // Add user custom instruction if it exists and is different from base instruction
  if (
    assistant.userInstruction &&
    assistant.userInstruction !== assistant.instruction
  ) {
    instruction += `\n\nAdditional Custom Instructions: ${assistant.userInstruction}`;
  }

  // Add sample questions as examples if available
  if (assistant.sampleQuestions && assistant.sampleQuestions.length > 0) {
    const examples = assistant.sampleQuestions
      .filter((q: string) => q && q.trim())
      .map((q: string) => `- ${q}`)
      .join("\n");

    if (examples) {
      instruction += `\n\nExample questions you might receive:\n${examples}`;
    }
  }

  // Add general guidelines
  if (instruction) {
    instruction += `\n\nImportant: Always respond according to your role and instructions above. Be helpful, accurate, and stay within your designated expertise area.`;
  }

  return instruction;
}

/**
 * Creates a system message object for the AI model
 */
export function createSystemMessage(assistant: any) {
  const instruction = formatAssistantInstruction(assistant);

  return {
    role: "system",
    content: instruction,
  };
}
