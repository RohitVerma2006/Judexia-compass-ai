import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = mode === "case-studio"
      ? `You are an expert Indian legal case analyst and law professor. When given a legal topic, generate a detailed case study with this exact structure:

**Case Title:** [Create a realistic case title]

**Background Facts:** [Detailed background of the case scenario - 3-4 sentences]

**Evidence:** [Key evidence presented - 2-3 points]

**Legal Issues:** [Specific legal questions raised - 2-3 issues]

**Arguments - Prosecution/Plaintiff:** [2-3 strong arguments]

**Arguments - Defence:** [2-3 strong counter-arguments]

**Court Reasoning:** [How the court analyzed the issues - 3-4 sentences]

**Final Judgment:** [The court's decision and reasoning]

**Relevant Articles/Sections:** [List applicable IPC sections, Constitutional articles]

**Landmark Precedents:** [2-3 relevant landmark Indian cases]

When evaluating a user's legal analysis of a case, provide:
**Evaluation:** [Assessment of their analysis - what they got right]
**Missing Arguments:** [Key points they missed]
**Suggested Improvements:** [How to strengthen their reasoning]
**Precedent References:** [Cases they should have cited]
**Score:** [Give a score out of 10]

Be thorough, professional, and reference real Indian law. Use IPC, CrPC, Indian Constitution, and landmark Supreme Court cases.`
      : `You are an expert Indian legal mentor and professor. Provide detailed, structured legal answers following this format:

**Definition:** [Clear legal definition]

**Relevant Section:** [Applicable IPC sections, Constitutional articles, or statutes]

**Explanation:** [Detailed explanation of the legal concept - 3-4 sentences minimum]

**Real-life Example:** [A practical scenario illustrating the concept]

**Landmark Case:** [A real Indian Supreme Court/High Court case reference with year and brief holding]

**Summary:** [2-3 sentence concise recap]

Cover Indian law comprehensively: IPC, CrPC, Indian Constitution, Evidence Act, CPC, specific Acts. Reference real cases (Maneka Gandhi, Kesavananda Bharati, Vishaka, etc.). Be professional and educational.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-mentor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
