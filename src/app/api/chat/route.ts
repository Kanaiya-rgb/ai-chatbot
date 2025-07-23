import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").trim(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = chatRequestSchema.parse(body);
    const { message, conversationHistory } = validatedData;

    // Prepare messages for OpenRouter
    const messages = [
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const openrouterBody = {
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify(openrouterBody),
    });
    const data = await response.json();

    console.log("OpenRouter API raw response:", data); // Debug log

    const assistantResponse = data?.choices?.[0]?.message?.content ||
      "I apologize, but I cannot generate a response at the moment.";

    return NextResponse.json({
      message: assistantResponse,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });
    const data = await response.json();
    return NextResponse.json({
      usage: data?.data?.usage,
      limit: data?.data?.limit,
      is_free_tier: data?.data?.is_free_tier,
      label: data?.data?.label,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch API key usage info.' }, { status: 500 });
  }
}
