# Analytics for AI Agents: From Pageviews to Prompts

**Speaker:** Mark Edmondson
**Event:** [Analytics.dev — Copenhagen, 29 April 2026](https://brandleadership.community/Insights/analytics-dev-29-april-2026/)
**Duration:** 30 min (revised down from 42 — cuts noted per section below)
**Thesis:** The most valuable digital analytics data in your organisation isn't in your website tags — it's now in AI chatbot logs. And you're probably giving it away.

## Co-presenters to reference

The other Analytics.dev talks all touch our argument from a different angle — weave hooks into the talk so the audience hears continuity across the evening.

| Speaker | Talk | Where to reference |
|---|---|---|
| **Julius Fedorovicius** (Analytics Mania) | *The Two Pillars of Modern Tagging: Security and Enrichment* | Act 1 §1.3 — when comparing GA4 event capture to Langfuse traces. *"Julius will show you how to harden your tagging tonight; I'm here to ask whether you're capturing the right surface in the first place."* |
| **Peter Meyer** (Aller Media) | *Using end-to-end testing to verify tracking implementation* | Act 2 §2.5 — Langfuse demo. *"Peter will show you how to verify your GA4 tags fire. The same discipline applies to agent traces — except now you're verifying reasoning, not just events."* |
| **Caroline Vidal** (DFDS) | *Agentic Lead Enrichment & Attribution* | Act 3 §3.1 — AI Referrals. *"Caroline goes deeper on agentic enrichment after me — she'll show you what to do with these leads once they arrive. I'm here to ask whether you're even seeing them."* |
| **Serge Shkvarnytskyi** (Stape) | *Server-side tracking: From audit to reporting* | Act 3 §3.3 — MCP & the bypass. *"Serge talks server-side later — same trust/control problem from a different angle. We're both moving collection off the page."* |

---

## Opening (2 min)

**On screen:** Black. Text fades in:
> "The most valuable digital analytics data in your organisation is no longer in your website analytics platform."
>
> "It's in your AI chatbot logs. And you're probably giving it away."

Then brief credibility flash: book cover, logos, blog post URL (2–3s each, no narration).

**Narrative:**
- Built an early RAG chatbot for an internal knowledge base. Wrote a blog post about doing it on Google Cloud. It went viral.
- Realised the demand was immense. Years in data architecture, analytics strategy, wrote the O'Reilly GA4 book — but went independent to focus on GenAI full-time.
- Bet on the data layer. Google had the stack (TPUs, pipelines, distribution, science) — they just needed the model. I knew the data side.
- Built **Multivac** as a platform to experiment with every new capability as it emerged.
- Noticed: the analytics strategy I'd used my whole career still applied. Capture, storage, modelling, activation. Same principles. Different — richer — data.
- "The skills in this room transfer. The opportunity is massive."

**Speaker notes:**
- Blog post URL on screen briefly.
- Keep "went independent" clean — no details.
- Land on "the opportunity is massive" with conviction.

---

## Act 1: What I Saw Changing (6 min)

*Theme: The paradigm shift, told as personal observation.*

### 1.1 The Overwhelm (2 min)

**On screen:** Timeline of AI releases — GPT-3, ChatGPT, GPT-4, Claude, Gemini, agents, MCP. Rapid fire, overwhelming.

**Narrative:**
- The pace is relentless. Couldn't keep up part-time.
- Decision: go all-in or fall behind. Went all-in.
- Built Multivac as a laboratory. Tested every new feature — agents, tool use, retrieval, traces. Wanted to understand the engineering, not the hype.

**Transition:** "And the first thing I noticed..."

### 1.2 The Rosetta Stone (4 min)

**On screen:** Animated two-column mapping. GA4 → Langfuse:
| GA4 | Langfuse |
|---|---|
| Session | Trace |
| Pageview | Generation |
| Event | Tool Call / Span |
| User ID | Thread ID |
| Custom dimensions | Metadata |

**Narrative:**
- I already knew this. Different names, same concepts.
- The mental model from years of web analytics transferred.
- But the *shape* is different. Web analytics events are flat and sequential. Agent traces are nested and hierarchical.
- "You're not tracking a journey. You're tracking reasoning."

### 1.3 The Technical Comparison (4 min)

**On screen:** Split screen. Left: GA4 event code. Right: Langfuse trace code. Code builds line by line. Then screenshots: GA4 DebugView vs Langfuse trace waterfall.

**Narrative:**
- Same pattern: capture the moment, add context, send it somewhere.
- But look what's new: model version, token count, cost per generation, latency, the actual prompt and response.
- Same discipline — **order of magnitude richer** data.
- Structural difference: flat event stream vs nested trace. Drill into each tool call, see what it did, what it cost, how long it took.

---

## Act 2: What I Found (11 min)

*Theme: The gold mine, told through actual work.*

### 2.1 Prompts Are Intent (3 min)

**On screen:** Two columns:
- Clicks tell you: *"User visited /pricing"*
- Prompts tell you: *"Is this worth it for a small team or should we use the free tier?"*

The prompt "explodes" into visible insights — price sensitivity, team size, comparison shopping.

**Narrative:**
- Clicks tell you what someone *did*. Prompts tell you what they were *thinking*.
- Not just behaviour — intent, objections, context, decision criteria, in the user's own words.
- "I'd spent years inferring intent from click patterns. Now I was just... reading it."

### 2.2 The Anthropic / OpenAI Studies (3 min)

**On screen:** Visualisation of usage breakdowns from the studies (coding, writing, research, etc.). Then: *"They know what their users want. Do you?"*

**Narrative:**
- Anthropic and OpenAI publish how people use their models. They're using this data to shape entire roadmaps.
- Quick aside: I'm using Claude right now — running on Google TPUs, Anthropic part-owned by Google, Gemini hitting benchmarks. The ecosystem I bet on is maturing.
- But: they have this insight because they capture the data. Your internal AI, your customer-facing chatbot — do you have this visibility? Or is it sitting in a third-party system you don't control?

### 2.3 The Hero Story (4 min)

**On screen:** Black screen. Single quote fades in:
> "We thought everyone was doing X. They were actually doing Y."

Then: visual of expected process (clean) morphing into actual process (messier, different paths).

**Narrative:**
- Worked with an organisation in green-energy legal. Clear picture of how their internal processes worked. Workflow assumed to go one way.
- Looked at what people were *actually* asking the AI assistant.
- Completely different. People worked around the official process, invented their own paths. **The documented workflow existed on paper. The real workflow was in the prompts.**
- Updated the AI to match reality instead of expectation. Adoption up. Satisfaction up.
- "I'd never have found this in click data. There's no pageview for 'I'm confused about the process so I'm asking the chatbot instead.'"

### 2.4 Analysing Text at Scale (2 min)

**On screen:** Three approaches animating in:
1. Clustering (embeddings)
2. LLM-as-judge (categorisation)
3. Feedback loops (user ratings → evals)

**Narrative:**
- How do I actually analyse thousands of prompts? Text, not numbers.
- Embedding-based clustering — let similar questions find each other.
- LLM-as-judge — use a model to categorise and evaluate other outputs.
- Feedback loops — capture user ratings, feed them back into evals.
- "Sound familiar? It's funnels and segments. Just different raw material."

### 2.5 Langfuse Demo (4 min)

**On screen:** Langfuse trace view (screenshare or embedded). Walk through a real trace from Multivac.

**Narrative:**
- This is what I use instead of GA4 now.
- Real trace from Multivac. Session = trace. Generations = pageviews. Tool call = event.
- And what you've never had: token cost, latency, the actual conversation.
- Debug, optimise, spot patterns. Same analytics discipline — radically better data.

**Speaker notes:** Pre-select a compelling trace. Point out familiar → new.

---

## Act 3: What I Think Is Coming (7 min)

*Theme: The future, told as speculation grounded in experience.*

### 3.1 AI Referrals (3 min)

**On screen:** Familiar GA4 acquisition report. A new channel fades in: **"AI Referrals."** Stats: low volume, high intent, high conversion.

**Narrative:**
- New referral source: users who came from an AI recommendation. Claude suggested a tool. ChatGPT mentioned a service.
- They behave differently. Rarely browse. Know what they want. When they click, they convert.
- Small numbers now. But: "How do you optimise for a referral source that never visits your website?"

### 3.2 Agents Browsing (3 min)

**On screen:** Stat on bot traffic percentage. Visual: a browser with an AI agent as the "user." Tool calls instead of clicks.

**Narrative:**
- Past peak human browsing. Most web traffic is already automated.
- Browser-automation agents navigate websites, fill forms, extract data. Your website isn't just for humans — it's an interface for machines that never agreed to your terms of service.
- "I don't know exactly where this goes. But the assumption that a human loads a page, JavaScript fires, we capture intent — that assumption is already breaking."

### 3.3 MCP and the Bypass (2 min)

**On screen:** Traditional flow: User → Browser → Website → Data. MCP flow: User → AI → Tool Call → Data directly. The website fades out.

**Narrative:**
- MCP — Model Context Protocol — lets AI agents call tools directly. No browser. No website.
- Using it now. Instead of browsing a docs site, my agent just calls the API. The webpage never loads.
- "If your analytics strategy depends on someone rendering your JavaScript — what happens when they never load the page at all? I don't have answers. I just know this is happening."

### 3.4 Why I Think Our Skills Transfer (2 min)

**On screen:** Skills mapping:
- Event taxonomy → Tool call schemas
- User journeys → Agent traces
- Funnels → Task completion rates
- Segmentation → Intent clustering
- BigQuery → Still BigQuery

> "The tools changed. The thinking didn't."

**Narrative:**
- Optimistic — for me, and maybe for you.
- Not starting over. Building on fifteen years of foundations.

---

## Close (4 min)

### 4.1 Live Agent Demo (3 min)

**On screen:** Conference Assistant interface. Langfuse trace appearing in real-time.

**Narrative:**
- Built an agent for this conference — knows the programme, speakers, sessions.
- Ask it something. *(type a question about another talk)*
- Watch the trace appear. Tool call to retrieve the programme. Generation to synthesise. Token cost. Latency.

**Speaker notes:**
- Pre-test thoroughly. Backup video ready.
- 30–60s of agent response.
- The trace is the star.
- Fallback: "Live demos. Here's a recording of what should have happened."

### 4.2 The Takeaways (1 min)

**On screen (one at a time):**
1. *Prompts reveal intent. I started capturing them.*
2. *The data showed reality, not assumptions. I started analysing it.*
3. *The web is changing. I'm evolving with it.*

**Narrative:** Personal framing — *I learned*, not *you should*. Let each one land.

### 4.3 The Invitation (1 min)

**On screen:**
> Mark Edmondson
> sunholo.com
> Multivac

**Narrative:**
- Multivac is my platform — how I experiment, build, help organisations figure this out.
- "If any of this resonates — find me afterwards, or at sunholo.com."
- Closing line: *"The richest analytics data in your organisation might not be in your website tags anymore. It might be in the conversations your users are having with AI. Don't give that gold away."*

---

## Structure Summary — 30 min cut

| Act | Section | Time | Notes / cuts |
|---|---|---|---|
| Opening | Hook + bio flash | 2 min | Tighten to two slides; no bio narration, just visual flash |
| Act 1 | The Overwhelm | 1 min | Single timeline visual, no laboratory anecdote |
| | The Rosetta Stone | 2 min | Animated mapping table only — drop the "tracking reasoning" extended riff |
| | The Technical Comparison | 3 min | Code split + screenshot; **reference Julius's tagging talk here** |
| Act 2 | Prompts Are Intent | 2 min | Two-column comparison, no extra examples |
| | Anthropic/OpenAI Studies | 2 min | One chart + one rhetorical question |
| | The Hero Story | 3 min | Keep this — it's the heart of the talk. Don't rush. |
| | Analysing Text at Scale | 1 min | Three-bullet flash, no walkthrough |
| | Langfuse Demo | 3 min | Pre-loaded trace; **reference Peter's e2e testing talk here** |
| Act 3 | AI Referrals | 2 min | **Reference Caroline's agentic enrichment talk here** |
| | Agents Browsing | 2 min | Single bot-traffic stat + one visual |
| | MCP and the Bypass | 2 min | **Reference Serge's server-side talk here** |
| | Why Our Skills Transfer | 1 min | Skills mapping flash, drop the optimism riff |
| Close | Live Agent Demo | 2 min | 30s of agent response, the trace is the star |
| | Takeaways | 1 min | Three lines, one at a time |
| | Invitation | 1 min | Name + sunholo.com + closing line |
| **Total** | | **30 min** | |

## What got cut from the 42-min version

- **Bio narrative** — went from a 1-minute spoken backstory to a 5-second visual flash
- **"Laboratory" framing** for Multivac — implied by the demo, no longer explained
- **"Tracking reasoning" riff** in §1.2 — cut for time, the audience is technical enough to infer it
- **The Anthropic/Google ecosystem aside** in §2.2 — cut, was a tangent
- **"Why our skills transfer" extended monologue** in §3.4 — now just the mapping table, no commentary
- **Closing demo extended interactions** — one question, one trace, that's it
