import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, name, email, page } = await req.json();

  if (!message) {
    return NextResponse.json({ reply: "Please share your issue so I can help." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { reply: "AI support is not configured. Please try again later." },
      { status: 401 }
    );
  }

  const systemPrompt =
    "You are Z-MART AI Support. Be concise, helpful, and ask for order ID if needed. If the user asks for refunds, shipping, returns, cancellation, or payment issues, request the order ID and relevant details. Never ask for passwords or full card details.";

  const userPrompt = [
    `Customer: ${name || "User"} (${email || "unknown"})`,
    page ? `Page: ${page}` : "",
    `Message: ${message}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", response.status, errText);
      return NextResponse.json(
        { reply: "Thanks! Our support team will follow up shortly." },
        { status: 200 }
      );
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Thanks! Our support team will follow up shortly.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch {
    return NextResponse.json(
      { reply: "Thanks! Our support team will follow up shortly." },
      { status: 200 }
    );
  }
}
