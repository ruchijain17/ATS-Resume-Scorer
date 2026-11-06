import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function POST(req) {
  try {
    const { resumeText, jobDescription } = await req.json();

    const prompt = `You are ATS scorer. Return ONLY valid JSON with no extra text:
{
  "score": 85,
  "missing_keywords": ["React", "Next.js"],
  "suggestions": ["Add metrics", "Quantify impact"],
  "fixed_bullets": ["Improved UX by 20% using React"]
}
Resume: ${resumeText}
JD: ${jobDescription}`;

    const res = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }]
    });
    
    const jsonResult = JSON.parse(res.choices[0].message.content);
    return Response.json(jsonResult);

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}