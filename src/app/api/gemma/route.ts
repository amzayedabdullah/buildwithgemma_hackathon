import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { transcript, apiKey: clientKey, mode } = await req.json();

    const apiKey =
      clientKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing Google AI Studio API Key' },
        { status: 400 }
      );
    }

    const model = process.env.NEXT_PUBLIC_GEMMA_MODEL || 'gemma-4-31b-it';

    const systemPrompt = `
You are Hisab.AI, a specialized financial assistant trained on Bangladeshi retail speech and regional dialects.
Parse the spoken transaction transcript into a strict JSON payload.

JSON Format required:
{
  "customerName": "Customer Name in Bangla",
  "phone": "017XXXXXXXX",
  "type": "BAKI" or "JAMA" or "BAKI_JAMA_SPLIT",
  "items": [{"name": "Item name", "amount": 100}],
  "totalAmount": 250,
  "cashPaid": 50,
  "netBaki": 200,
  "riskLevel": "LOW" or "MEDIUM" or "HIGH",
  "confidenceScore": 0.98,
  "reasoningBangla": "Explanation in Bangla"
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemPrompt },
                { text: `Spoken Bangla input: "${transcript}"` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: errText }, { status: response.status });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (rawText) {
      const parsed = JSON.parse(rawText);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: 'Empty model output' }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
