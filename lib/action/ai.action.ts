"use server";

import OpenAI from "openai";
import { File } from "../file";

const openai = setupOpenAI();
function setupOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    return new Error("OpenAI API key is not set");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const generateGptResponse = async ({
  userInput,
}: {
  userInput: string;
}) => {
  if (openai instanceof Error) {
    throw openai;
  }
  let context;
  if (File) {
    context = File.map((page: any) => {
      return `
      Website Page URL: ${page.url}
      Title: ${page.metadata?.title}
      Description: ${page.metadata?.description || "No description"}
      text: ${page.text}
    `;
    }).join("\n\n");
  } else {
    context = "You are an AI assistant that helps users";
  }
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that helps users by providing information based context provided.Only respond based on the provided content.repsponse must be in 2-3 lines.if you dont kow about anything asked by user then fing the email from context and add it to this line-'i dont know about this you can email'.",
      },
      { role: "user", content: context },
      {
        role: "user",
        content: userInput,
      },
    ],
    max_tokens: 500,

    temperature: 1,
  });

  const gptArgs = completion?.choices[0]?.message?.content;

  if (!gptArgs) {
    throw new Error("Bad response from OpenAI");
  }

  return JSON.parse(JSON.stringify(gptArgs));
};
