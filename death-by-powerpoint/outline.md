# Death by PowerPoint: Building Presentations with AI Agents

**Speaker:** Mark Edmondson (Sunholo / Holosun ApS)
**Event:** [IDA webinar](https://ida.dk/en/arrangementer-og-kurser/arrangementer/death-by-powerpoint-building-presentations-with-ai-agents-368365) — Thursday 22 October 2026, 15:00–16:00 CEST, online (Zoom)
**Duration:** 50 min content + ~10 min Q&A
**Registration deadline:** Wed 21 October 2026, 23:55

**Thesis:** Don't ask an AI to make you a PowerPoint. Ask it to generate the medium your audience actually receives — a web page. Then give it a written design system and a linter so it stays honest, and one file will serve the room, the reader and the PDF-requester at once.

## Agenda mapping

The published IDA page lists four key topics. Every deck in the playlist below traces
back to one of them — if a slide doesn't, it gets cut.

| IDA key topic | Deck |
|---|---|
| Generating the final medium versus file formats | `01-generate-the-medium` |
| Structured design guidance through written systems and automated linting | `02-teaching-taste` + the live build |
| Presentations with capabilities beyond traditional slide software | `04-beyond-slide-software` + the three reused exhibits |
| Serving live attendees, asynchronous viewers, and PDF requesters | `05-three-audiences` |

`06-whats-next` sits outside that table on purpose. It is the "where this is going"
coda the listing doesn't promise — so it is the first thing to cut if the clock is
against you, and it must never eat into the live build.

Stated learning outcomes, verbatim from the listing: *medium generation benefits,
structuring AI for design consistency, HTML capabilities beyond slide software, and
creating multi-audience presentations.*

Audience: "anyone who presents and is comfortable reading a little code" — developers,
data scientists, technical leads, developer advocates, consultants and trainers. **No
front-end expertise assumed.** Every code sample on screen must be readable by someone
who has never written CSS. Say so early; people who can't read CSS will otherwise spend
the hour feeling like they're missing something.

## Composability — the spine of the talk

Five of the thirteen playlist entries are **not in this folder**. They are the May 2026
IDA Driving AI decks, loaded from `../ai-slaves-human-masters-ida/` by relative path,
plus the `about-mark` and `contact-mark` decks that every talk already reuses.

This is the demonstration, not a shortcut. The claim "your slides become composable
parts" is worth nothing said out loud and everything when the thing on screen is
visibly a slide from a different talk, running live, unmodified. Say the words while
Exhibit A is up: *"I did not build this for today."*

Nothing was copied. Reordering this talk is editing a JavaScript array.

---

## 0 · Who's talking (1 min) — `../about-mark/about-mark.html`

Reused deck. Keep it to 45 seconds: Cornwall → Copenhagen, Sunholo, AILANG, IDA Driving
AI in May. The bio is on the IDA listing; don't re-read it.

**Transition:** "…and every deck I've shown at those events was built the way I'm about
to show you. Including this one."

---

## 1 · Opening (4 min) — `00-death-by-powerpoint.html`

### 1.1 The complaint is 25 years old

**On screen:** The phrase, with its origin. Angela R. Garber, *Small Business Computing*,
1 April 2001.

**Narrative:**
- A quarter century of advice: fewer bullets, bigger type, no clip art, tell a story.
- All of it aimed at the presenter. None of it at the tool.
- The tool won every time, because the tool decided what a slide *could be*: a static
  rectangle you assemble by dragging boxes.

### 1.2 The reveal

**On screen:** "This is not a slide. It's a web page." — with the URL visible.

**Narrative:**
- What you're looking at right now is HTML, CSS and JavaScript in one file. View source
  during the Q&A if you like.
- I didn't write it. An agent did, against rules I wrote in English.
- Nothing here is running on my machine that can't run on yours.

**Speaker note:** Resist the urge to prove it immediately. The proof is the live build in
§4 — this slide just plants the flag.

### 1.3 What actually changed

**On screen:** Two eras. *Human drags boxes* → *Agent writes the medium*.

**Narrative:**
- PowerPoint's design is a rational answer to a real constraint: a human being has to
  place every element by hand, so give them a canvas and some boxes.
- That constraint is gone. The thing assembling the deck can now write code.
- Once your author can write code, asking it to produce a proprietary binary is a
  strange thing to insist on.

### 1.4 Thesis

**On screen:** Generate the medium, not the file.

**Transition:** "So let's take that apart — what does 'the medium' even mean?"

---

## 2 · Generate the medium, not the file (7 min) — `01-generate-the-medium.html`

*IDA key topic 1.*

### 2.1 The round trip (2 min)

**On screen:** Idea → .pptx → export → PDF → screenshot → someone's phone. Loss at each arrow.

**Narrative:**
- Count the conversions in a normal talk. Each one drops something: fonts substitute,
  animations flatten, links die, the embedded video doesn't travel.
- The audience never receives the .pptx. They receive a screen. Then later, a PDF they
  can't search well and a link that goes nowhere.

### 2.2 What an agent is actually good at (2 min)

**On screen:** Side by side — a fragment of OOXML vs the equivalent HTML.

**Narrative:**
- A `.pptx` is a zip of XML. You *can* generate it, and libraries exist. But the model
  is writing a file format it cannot open, look at, and judge.
- Models write HTML and CSS extremely well — it's the best-represented thing in the
  training data by a wide margin, and it renders instantly for the feedback loop.
- **Key point for the non-front-end audience:** you do not need to write this. You need
  to be able to *read* enough of it to say "that's wrong, fix it."

### 2.3 The final medium (1.5 min)

**On screen:** One arrow. Idea → the screen.

**Narrative:**
- The medium the audience receives is a rendered page. Generate that, and there is no
  conversion step left to lose anything in.
- Live data stays live. Links stay links. The deck stays one HTTP request.

### 2.4 What you get, and what you give up (1.5 min)

**On screen:** Two honest columns.

**Gained:** no licence, no version incompatibility, no font substitution, any device with
a browser, deployable to a URL, diffable in git, and the deck can *run things*.

**Given up:** corporate template compliance, handing a colleague a file they can edit in
PowerPoint, animation-by-menu, and — be honest — you need a browser and, for the fancy
parts, a network.

**Narrative:**
- Most of the "given up" column has an answer: the PDF export in §6 covers the handover
  and the compliance conversation. But don't oversell. If your organisation mandates the
  corporate template, this is a fight you may not win, and that's fine — take the design
  system idea and leave the HTML.

**Transition:** "Fine. The agent writes HTML. Left alone, it writes *ugly, inconsistent*
HTML — a different look every time you ask. That's the real problem."

---

## 3 · Teaching the agent taste (8 min) — `02-teaching-taste.html`

*IDA key topic 2. The most transferable section of the talk — this idea works even if
you never write a slide in HTML.*

### 3.1 Consistency is the whole game (1 min)

**On screen:** Three slides generated from the same prompt on three different days. Three
different looks.

**Narrative:**
- A deck isn't eleven images. It's one thing seen eleven times. Drift is what makes an
  AI-built deck feel cheap.
- An agent with no guidance regresses to the mean of its training data: gradient hero,
  three cards, a stock icon. It's fine. Fine is the problem.

### 3.2 A design system written in prose (2.5 min)

**On screen:** A real excerpt from `SKILL.md`.

> Orange accent (`#e73c17` dark / `#d4300f` light) for emphasis, never overused.
> **Montserrat** for all text, **JetBrains Mono** for code and data.
> Subtle grid background at 60px intervals.

**Narrative:**
- This is not a config file. It's English, with a few hex codes. That is deliberate —
  "never overused" is a judgement, and judgement is the thing the model is good at.
- Anyone in this webinar can write this document about their own brand today. It's the
  brand guidelines you already have, addressed to a reader who will actually follow them.
- **This is the takeaway even for people who never touch HTML.** A written design system
  is how you get *any* consistent output from an agent.

### 3.3 The rule that earns its keep (2 min)

**On screen:** The before/after from the skill's sizing rules.

```css
/* WRONG — measured against the window, overflowed the stage */
max-height: calc(100vh - 320px);
/* RIGHT — measured against the 16:9 stage */
max-height: 70cqb;
```

**Narrative:**
- Every deck is a fixed 16:9 stage, letterboxed. Design once, looks the same everywhere.
- The rule: never size against the browser window, always against the stage.
- This one rule fixes the single most common failure — content sliding off the bottom on
  a projector with the wrong aspect ratio. Everyone here has watched that happen.
- Explain `cqb` in one sentence: *"1% of the slide's height."* That's all anyone needs.

### 3.4 Prose isn't enough — the linter (2 min)

**On screen:** The hook config, then a failing lint run.

**Narrative:**
- Written rules get followed most of the time. Most of the time is not good enough when
  the failure is invisible until you're on stage.
- So the mechanical half gets enforced in code: a script scans every `<style>` block for
  forbidden units, and a `PostToolUse` hook runs it after every edit the agent makes.
- Non-zero exit, the agent sees the error, the agent fixes it. No human in the loop.
- The hook only inspects the *new* text, so old files with legacy violations don't block
  today's work — that detail is what makes it survivable in a real repo.

### 3.5 The general principle (0.5 min)

**On screen:** Prose for taste. Linter for physics.

**Narrative:**
- Write the rule in prose when it needs judgement. Enforce it in code when it's
  mechanical. Every agent workflow you build should be split along that line.

**Transition:** "That's the theory. Let's watch it actually happen."

---

## 4 · The live build (12 min) — `03-live-build.html`

*Three slides wrapped around a screen share. Budget: 1 min setup, ~9 min in the repo,
2 min recap.*

### 4.1 What you're about to see (1 min)

**On screen:** Four things to watch for, numbered. Leave this up while you switch windows.

1. I write the prompt in **plain English** — no CSS.
2. The agent reads `SKILL.md` before it writes anything.
3. The linter fires on the edit and the agent fixes its own mistake.
4. Reload the browser. That's the deploy.

**Speaker note (webinar-specific):** Say out loud "I'm switching to my editor now" before
you do it. On Zoom, a silent window switch reads as a crash.

### 4.2 The screen share (~9 min)

**Leave the HOLD slide on screen** if you keep the deck window visible — it carries the
prompt verbatim so people can copy it out of the recording.

**Run order in the repo:**
1. `presentations/.claude/skills/presentation-slides/SKILL.md` — scroll the design system
   and the sizing rules. Don't read it aloud; point at the shape of it.
2. `.claude/settings.json` — six lines. Show the `PostToolUse` hook.
3. Type the prompt. Something small and honest, e.g.
   *"Add a slide to the death-by-powerpoint deck: a two-column comparison of what we gain
   and what we give up. Match the deck's design system."*
4. Let it run. **Narrate what it's reading** — the silence while an agent thinks is the
   worst part of any live demo. Talk over it.
5. When the lint hook fires (or if it doesn't, run `node .claude/skills/presentation-slides/scripts/lint-slides.mjs`
   manually so the audience sees the output shape).
6. Reload the deck in the browser. Done.

**Failure plan:** if the model stalls or the network dies, stop at 4 minutes, switch back,
and talk to the recap slide instead — it stands on its own. Do not debug live. Nobody has
ever enjoyed watching someone debug live.

### 4.3 What just happened (2 min)

**On screen:** The loop, as four boxes: prompt → read the rules → write → lint → fix.

**Narrative:**
- Nothing in that was specific to slides. That's an agent, a written standard, and a
  check that fails loudly.
- The slide is now a file in a git repo. It has a diff. It can be reviewed.

**Transition:** "Now — what can this thing do that a rectangle can't?"

---

## 5 · Beyond slide software (4 min frame + 5 min exhibits) — `04-beyond-slide-software.html` + reuse

*IDA key topic 3. **This is also where the composability claim gets proved.***

### 5.1 The frame (4 min)

**On screen:** Three claims, each about to be demonstrated: *it can be interactive*, *it
can animate an argument*, *it can render real data*.

**Narrative — say this explicitly:**
- "The next three things I'm going to show you are not in this presentation's folder.
  They're from the talk I gave at IDA Driving AI in May. Different talk, different
  audience, same repo."
- "The playlist for today is a JavaScript array. Three of its entries point at another
  folder. That's all 'composable' means, and it's why I stopped dreading the request to
  give a shortened version of a talk."

### 5.2 Exhibit A — interactive (2 min) — `../ai-slaves-human-masters-ida/01-entropy-explorer.html`

A live D3 decision-space explorer. Drive it from the stage. **This is the money shot:**
a slide you can *use*, not a screenshot of one.

Say the line: *"I did not build this for today."*

### 5.3 Exhibit B — animation as argument (1 min) — `../ai-slaves-human-masters-ida/03-development-loop.html`

The iterative feedback cycle, animated. Note the joke that isn't a joke: this slide
describes the AI development loop, and it is also exactly the loop that produced the slide
you watched being built ten minutes ago.

### 5.4 Exhibit C — real data (2 min) — `../ai-slaves-human-masters-ida/05-benchmarks-motoko.html`

Benchmarks and the motoko harness. The numbers are rendered by the deck, not pasted in as
a picture of a chart. Change the data, reload, the slide is correct.

### 5.5 Exhibit D — a Blender scene as the medium (2 min)

Return to the frame deck and advance to the production-core scene. Drag the model from the
stage. Explain that the live presentation receives an animated GLB, while the PDF exporter
receives a fixed poster from the same component. The model loads only when its slide appears.

Say the line: *"This is not a video of a model. The model is in the slide."*

**Transition:** "One more thing, and it's the one that changed how I write talks."

---

## 6 · One deck, three audiences (6 min) — `05-three-audiences.html`

*IDA key topic 4.*

### 6.1 The three readers (1.5 min)

**On screen:** Three columns.

| Audience | Wants | Gets today |
|---|---|---|
| The room, right now | A sparse slide behind a talking human | ✅ |
| Someone opening the link cold in six weeks | Prose that explains itself, with no narrator | usually a deck of orphaned bullet points |
| The person who emails "can you send the slides?" | A PDF | a 40MB attachment |

**Narrative:**
- Normally you serve these badly, or you maintain three artefacts and two of them rot.

### 6.2 Density: stage vs guide (2 min)

**On screen:** The same slide, twice — sparse, then with its `.detail` prose revealed.

**Narrative:**
- Take-home prose is wrapped in `class="detail"`. One line of CSS hides it on stage.
- Default is chosen by context: embedded in the presenter → stage. Opened directly by a
  stranger → guide. Same file, same URL.
- **Do it live: press `D`.** This is a two-second demo that lands better than any slide
  about it. Press it here, on this slide.

### 6.3 The PDF (1.5 min)

**On screen:** The export command.

**Narrative:**
- It can't be `@media print` — slides are stacked absolutely, revealed by animation from
  `opacity:0`, and some build up over several presses. A static print captures none of it.
- So the script drives the real deck in headless Chrome, walks every slide to its final
  revealed state, screenshots at 1920×1080, and assembles the pages.
- Deck order comes from the same `PLAYLIST` the live talk uses, so the PDF cannot drift
  from what you actually presented.
- And `--density=guide` gives the emailer a handout with the prose included — better than
  what they asked for.

### 6.4 The URL is the artefact (1 min)

**On screen:** sunholo.com/presentations.

**Narrative:**
- The deck doesn't get attached anywhere. It gets deployed. It's a static site, so it
  costs nothing to host and it will still open in ten years.
- This one will be up before the Q&A ends.

---

## 6b · What's next — the speech annotator (3 min) — `06-whats-next.html`

*Not one of IDA's four topics — a coda. Cut this first if you're behind.*

The honesty rule for this section: **three columns, three different truth values**, and
say which is which out loud. An audience forgives a roadmap; it does not forgive a
roadmap presented as a product.

### 6b.1 The deck is already listening (1 min)

**On screen:** Three columns — *on right now* / *experimental* / *not built*.

| Column | Status | What it is |
|---|---|---|
| The talk log | **Running for this webinar** | `assets/talklog.js`. Q captures an audience question, N a note, both stamped with the deck and slide on screen. Per-slide dwell time. Markdown export. No API key, no mic. |
| The co-presenter | **Built, flag-gated, off today** | `ailang-demos/co-presenter/`. A second window listening through Gemini Live, silent unless addressed. Live transcript panel, tool-call trace, and the tools `getSlideContext`, `audienceQuestion`, `saveNote`. Reaches the presenter over `postMessage`. |
| The speech annotator | **Not built** | Close the loop: transcript × slide context → the `.detail` prose for that slide, written from what you actually said. |

**Narrative:**
- "The log is on right now. Every question you ask is being filed against whichever slide
  prompted it — that's how the write-up gets written on the train home."
- The co-presenter already has the two halves that matter: it knows what's on screen, and
  it can log what it hears. Nobody has joined them up.

**Speaker note:** this is the natural place to press **L** and show the live log, if the
Q&A has already produced anything. If it hasn't, don't — an empty log undersells it.

### 6b.2 Four experiments, looking for a job (1 min)

**On screen:** The four voice demos in `ailang-demos`.

| Demo | What it proves |
|---|---|
| `streaming/ambient_assistant` | Always-listening with proactive audio — silent until addressed by name, no wake-word detection |
| `streaming/gemini_live` (`speak`) | Voice agent with **contract-verified** tool calling |
| `streaming/voice_docparse` | Voice in, document tools invoked live (DOCX, PPTX, XLSX, PDF) |
| `co-presenter/co_presenter.ail` | The Live session driven by AILANG compiled to WASM |

**Narrative:**
- All four were built for other reasons. That's usually how this goes — you don't plan the
  feature, you notice you already have four fifths of it lying around.
- Worth saying why the presenter *bridges* to the co-presenter instead of shipping it:
  `ailang.wasm` alone is ~39MB. Copying it would double the repo and fork the AILANG stack.
  `postMessage` costs nothing and fixes both at once.

### 6b.3 What it would take (1 min)

**On screen:** Two columns — what you'd get, what's in the way.

**Gained:** speaker notes from the talk you *gave*; questions auto-filed to the slide that
caused them; `minutes:` measured from a real run; a deck that improves every time you
give it.

**In the way:**
- Tracing stops at the tool call. The design doc's "Option B" — `--emit-trace` inside WASM —
  is a filed request against AILANG core, not a thing that exists.
- A live mic in a webinar is a second thing that can fail, and it's the one you can't hide.
- A full transcript of a talk is personal data. Whose? Kept where? Not answered.
- A model writing your speaker notes will sometimes write them confidently wrong.

**Land it on the last one.** It closes the loop with §3.5: this talk argues for a linter
because prose alone can't be trusted — and **there is no linter for "that's not what I
said."** Don't resolve the tension; leave it with them.

**Transition:** "So — if you want to start, and you sensibly want to start with the part
that isn't speculative:"

---

## 7 · Steal this (3 min) — `07-steal-this.html`

### 7.1 Four steps (1.5 min)

**On screen:** Numbered, deliberately small.

1. Write your design system as a page of English. Your brand colours, two fonts, one rule
   about what never happens.
2. Steal a working deck as the boilerplate. One that already renders correctly beats a
   perfect spec.
3. Add one linter rule — the one mistake you're tired of seeing.
4. Ask the agent for a slide. Read it. Tell it what's wrong.

### 7.2 The honest caveat (0.5 min)

**Narrative:**
- This is not less work than PowerPoint for a three-slide status update. It's dramatically
  less work from about talk number three onwards, because that's when reuse starts paying.
- And you should expect the first deck to take a whole afternoon.

### 7.3 Close (1 min)

**On screen:** *The tool stopped being the constraint. Ask for more from a slide.*

Then hand to `../contact-mark/contact-mark.html` and take questions.

---

## Playlist & budget

| # | Deck | Label | Min | Group |
|---|---|---|---|---|
| 1 | `../about-mark/about-mark.html` | Who | 1 | Open |
| 2 | `00-death-by-powerpoint.html` | 1 · Death by PowerPoint | 4 | Open |
| 3 | `01-generate-the-medium.html` | 2 · The Medium | 7 | Argument |
| 4 | `02-teaching-taste.html` | 3 · Taste + Linter | 8 | Argument |
| 5 | `03-live-build.html` | 4 · Live Build | 12 | Demo |
| 6 | `04-beyond-slide-software.html` | 5 · Beyond Slides | 2 | Exhibits |
| 7 | `../ai-slaves-human-masters-ida/01-entropy-explorer.html` | A · Interactive | 2 | Exhibits |
| 8 | `../ai-slaves-human-masters-ida/03-development-loop.html` | B · Animated | 1 | Exhibits |
| 9 | `../ai-slaves-human-masters-ida/05-benchmarks-motoko.html` | C · Real Data | 2 | Exhibits |
| 10 | `05-three-audiences.html` | 6 · Three Audiences | 6 | Payoff |
| 11 | `06-whats-next.html` | 7 · What's Next | 3 | Payoff |
| 12 | `07-steal-this.html` | 8 · Steal This | 3 | Payoff |
| 13 | `../contact-mark/contact-mark.html` | Contact | 0 | Close |

**Total: 50 min**, leaving ~10 for Q&A in the 15:00–16:00 slot.

Five of thirteen entries live in another folder. That ratio is the argument.

The coda cost 3 minutes; the live build gave back 1 (12 → 11) and Q&A gave back 2. If a
rehearsal says the build needs its twelfth minute, **take it back from `06-whats-next`,
not from the demo** — the roadmap survives being cut to two slides, the demo doesn't.

## Pre-flight

- [ ] `talklog` is on for this talk — press **Q** during Q&A to capture questions against
      the slide that prompted them; the export feeds the write-up.
- [ ] Clear `localStorage` key `talklog:death-by-powerpoint` before going live, or you'll
      append to the rehearsal run.
- [ ] Re-run the timings after a rehearsal and paste the measured `minutes:` back into the
      PLAYLIST. The numbers above are estimates, not evidence.
- [x] PDF exported (`node export-pdf.mjs death-by-powerpoint --density=guide`, 34 pages) and
      `const PDF` wired in `presenter.html`. **Re-export after any deck edit** — the PDF is a
      snapshot, and a stale one is worse than none.
- [ ] Zoom: share the *browser window*, not the tab, so switching decks doesn't drop the
      share. Test the screen-share swap to the editor once, cold, before the webinar.
- [ ] Decide whether the co-presenter flag is on. Recommendation: **off** for a webinar —
      it needs a mic, and the room audio is already going through Zoom. Note that §6b.1
      describes it as built-but-off, which is only honest if you leave it off.
- [ ] If you *do* switch it on, rehearse it once. §6b argues that a live mic is a second
      thing that can fail; failing it live while saying so is a bad look, not an ironic one.
