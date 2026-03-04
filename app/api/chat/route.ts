import { streamText,UIMessage,convertToModelMessages } from "ai"
import { google } from "@ai-sdk/google"


export async function POST(req:Request){
    try{
        const {messages}:{messages:UIMessage[]} = await req.json();

        const result = streamText({
            model:google('gemini-2.0-flash'),
            messages:await convertToModelMessages(messages)
        })

        return result.toUIMessageStreamResponse();
    }catch(error){
        console.error("Error streaming chat completion",error);
        return new Response("Failed to stream chat completion",{status:500})
    }
}
