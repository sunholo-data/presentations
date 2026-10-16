# Death by PowerPoint: Building Presentations with AI Agents

**Speaker:** Mark Edmondson (Sunholo / Holosun ApS)
**Event:** [IDA webinar](https://ida.dk/en/arrangementer-og-kurser/arrangementer/death-by-powerpoint-building-presentations-with-ai-agents-368365) — Thursday 22 October 2026, 15:00–16:00 CEST, online (Zoom)
**Duration:** 45 min content + ~15 min for the host intro, join lag and Q&A
**Registration deadline:** Wed 21 October 2026, 23:55

**Thesis:** Don't ask an AI to make you a PowerPoint. Ask it to make what your audience actually sees: a web page. Then give it written design rules and a linter to check its work. One file then serves the room, the later reader and the person who wants a PDF.

## Agenda mapping

The published IDA page lists four key topics. Every deck in the playlist below traces
back to one of them. If a slide doesn't, it gets cut.

| IDA key topic | Deck |
|---|---|
| Generating the final medium versus file formats | `01-generate-the-medium` |
| Structured design guidance through written systems and automated linting | `02-teaching-taste` + the live build |
| Presentations with capabilities beyond traditional slide software | `04-beyond-slide-software` (incl. Exhibit A, the engine) + the reused Exhibit B, the development loop |
| Serving live attendees, asynchronous viewers, and PDF requesters | `05-three-audiences` |

The old "What's next" ending deck is no longer in the playlist.
It promised nothing on the listing. One line from it survives as a spoken aside in the
close (§7.1): the talk log that is running during the webinar.

Stated learning outcomes, verbatim from the listing: *medium generation benefits,
structuring AI for design consistency, HTML capabilities beyond slide software, and
creating multi-audience presentations.*

Audience: "anyone who presents and is comfortable reading a little code" — developers,
data scientists, technical leads, developer advocates, consultants and trainers. **No
front-end expertise assumed.** Every code sample on screen must be readable by someone
who has never written CSS. Say so early. Otherwise people who can't read CSS will spend
the hour feeling they are missing something.

## Reuse — the spine of the talk

Three of the ten playlist entries are **not in this folder**. One is the development loop
from the May 2026 IDA Driving AI talk, loaded from `../ai-slaves-human-masters-ida/` by
relative path. The other two are the `about-mark` and `contact-mark` decks that every
talk already reuses. (The 04 deck's playlist slide shows the same split: 7 written for
today, 3 borrowed.)

This is the demonstration, not a shortcut. Saying "you can reuse your slides" proves
nothing. Showing a slide from a different talk, running live and unchanged, proves it.
Say this while Exhibit B, the development loop, is up: *"I did not build this for today."*

Nothing was copied. To reorder this talk, I edit one list.

---

## 0 · Who's talking (1 min) — `../about-mark/about-mark.html`

Reused deck. Keep it to 45 seconds: Cornwall → Copenhagen, Sunholo, AILANG, IDA Driving
AI in May. The bio is on the IDA listing; don't re-read it.

**Transition:** "…and I built every deck from those events the way I'm about to show
you. This one too."

---

## 1 · Opening (4 min) — `00-death-by-powerpoint.html`

### 1.1 The complaint is 25 years old

**On screen:** The phrase, with its origin. Angela R. Garber, *Small Business Computing*,
1 April 2001.

**Narrative:**
- We've had 25 years of advice: fewer bullets, bigger type, no clip art, tell a story.
- All good advice, all for the presenter. None of it was for the tool.
- The tool still won. It decided what a slide is: a fixed box you fill by dragging
  smaller boxes.

### 1.2 The reveal

**On screen:** "This is not a slide. It's a web page." The URL and a 3D scene you can turn.

**Narrative:**
- What you see is one HTML file. Layout, style and code are all in it. No licence.
- I didn't write this page. An AI agent did, following rules I wrote in English.
- Ask to see the code in the Q&A.

**Speaker note:** Don't try to prove it yet. The proof is the live build in §4. This
slide only makes the claim.

### 1.3 What made PowerPoint sensible is gone

**On screen:** Two eras. *1987 – 2024: A person places every box by hand* → *Now: An AI
can write the code*.

**Narrative:**
- I'm not saying PowerPoint is bad. For thirty‑seven years it was a sensible answer to a
  real limit. A person had to place every box by hand, so you gave them a blank page and
  some boxes.
- That limit is gone. The thing making your deck can now write code well.
- So why ask it for a locked PowerPoint file? The limit changed. The tool didn't.

### 1.4 Thesis

**On screen:** Generate the medium, not the file format.

**Transition:** "So what do I mean by 'the medium'? Let's look."

---

## 2 · Generate the medium, not the file (6 min) — `01-generate-the-medium.html`

*IDA key topic 1.*

### 2.1 Count the conversions (1.5 min)

**On screen:** Idea → .pptx → their projector → export to PDF → screenshot → someone's
phone. Something is lost at each arrow: boxed into a rectangle, wrong fonts, animation is
lost, links die, unreadable.

**Narrative:**
- Five conversions sit between your idea and the person. Each one loses something. You
  chose none of them. And the embedded video never arrives. It never has.

### 2.2 Same slide title, two formats (1.5 min)

**On screen:** Side by side: a .pptx fragment (a zip of XML) vs the same title in HTML.

**Narrative:**
- A `.pptx` is a zip of XML. You *can* make one, and the tools exist. But the model
  can't open the file and check its own work.
- HTML and CSS are the code behind web pages. The model has seen far more of them than
  almost anything else. And HTML shows up at once, so you can see what it made.
- **Key point for the non-front-end audience:** you don't have to write this. You only
  need to read enough of it to say "that's wrong, fix it."

### 2.3 The real output (1.5 min)

**On screen:** One arrow. Idea → the screen. No conversion.

**Narrative:**
- Your audience ends up looking at a page on a screen. Make that page directly. Then
  nothing sits in between to lose anything.
- Live data stays live. Links stay links. The whole deck arrives as one file.

### 2.4 What you gain, what you give up (1.5 min)

**On screen:** Two honest columns.

**Gained:** no licence, no "created in a newer version", no swapped fonts (the page
brings its own), opens on anything with a browser, shared as a link, tracked in git, and
the slide can *run things*.

**Given up:** your company template (your brand, yes, in section 3; the .pptx master
file, no), a file a colleague can edit in PowerPoint, animation by menu, and you need a
browser and, for the live parts, internet. A PDF covers rooms with no wifi.

**Narrative:**
- Most of the "given up" column has an answer. The PDF export in §6 covers handing the
  deck to someone. The design system in the next section carries your brand.
- But don't oversell it. Nothing fixes a company that insists on the .pptx master file.
  You may lose that fight, and that's fine. Take the design system anyway.

**Transition:** "Fine. The agent writes HTML. But left alone, it writes messy HTML. You
get a different look every time you ask. That's the real problem."

---

## 3 · Teaching the agent taste (8 min) — `02-teaching-taste.html`

*IDA key topic 2. The most useful section to take home. It works even if you never
write a slide in HTML.*

The main point: a **skill** packs three things into one folder. Rules in words, a
template, and automatic checks. That is how the slides stay the same. Seven slides,
about a minute each, plus a minute of slack.

### 3.1 Ask three times, get three decks (1 min)

**On screen:** Same prompt, three times. Top label: "Same prompt, no design system".
Bottom label: "Same prompt, using the slides skill".

**Narrative:**
- A deck is not eleven separate pictures. It is one thing, seen eleven times. If every
  slide looks a bit different, an AI‑built deck feels cheap.
- With no guidance, the model makes the average slide: a colour gradient, three boxes, a
  stock icon. It looks fine. Fine is the problem.
- The bottom row used a skill. So what is a skill?

### 3.2 A skill is a folder of know-how (1 min)

**On screen:** You ask ("Make me a slide about our Q3 results.") → Claude Code ("That's a
slides job. I'll open the slides skill.") → the folder `presentation-slides/`:
`SKILL.md` (when to use it, and the steps), `design-system.md` (our look, in plain words),
`boilerplate.md` (a deck that already works), `lint-slides.mjs` (automatic checks).
Bottom line: *Write it once. Every request after that uses it.*

**Narrative:**
- A skill is a folder of instructions for Claude Code.
- The first lines say what it is for. When your request matches, Claude opens the folder
  and follows it.
- You don't pick it. You just ask for a slide.
- The instructions are plain English. You don't need to code to write one.

### 3.3 Three things keep every slide the same (1 min)

**On screen:** Three cards. *Rules in words*, for taste. *Templates*, for structure.
*Automatic checks*, for hard rules.

**Narrative:**
- Each part does a different job.
- Words guide the AI where taste matters.
- A template means it never starts from scratch.
- Checks catch the mistakes that must never reach the screen.
- You need all three. The next three slides take them one at a time.

### 3.4 Write your taste down in plain words (1 min)

**On screen:** A real excerpt from `.claude/skills/presentation-slides/SKILL.md`.

> Orange accent (`#e73c17` dark / `#bd3012` light) for emphasis, never overused.
> **Montserrat** for all text, **JetBrains Mono** for code and data.
> Subtle grid background at 60px intervals. Always support dark and light.

**Narrative:**
- This is not a settings file. It is plain English with a few colour codes.
- "Never overused" is not a number. It needs judgement, and the AI is good at that.
- This is the brand guide you already have. The difference is that this reader actually
  follows it.
- You can write one for your own brand this afternoon. It works for any AI task, not
  only slides.

### 3.5 Never start from a blank page (1 min)

**On screen:** The template deck: the 16:9 slide shape, dark and light themes, keyboard
and clicker keys, the presenter view and timer. The AI copies it, then writes only the
new content, for every new talk.

**Narrative:**
- The hard parts are solved once, in the template.
- The AI copies a deck that already works. It changes only the content.
- That is faster. And it can't forget the theme switch or the keyboard keys.

### 3.6 A check gives the same answer every time (1 min)

**On screen:** A loop. The AI edits a slide → the check runs by itself → it fails:
*"Text is sized to the window, not the slide"* → the AI fixes it → pass. Beside it: *A
check is a tiny program. Same file in, same answer out. You can't talk it round.*

**Narrative:**
- Written rules get followed most of the time. That is not enough when you only see the
  mistake on stage.
- So code checks the simple rules. It runs by itself after every edit. No human in the
  loop.
- My example: text sized to the browser window. On a projector it falls off the bottom.
  You have all seen that happen. The check catches it every time.
- If the check fails, the AI reads the message and fixes its own mistake.

### 3.7 Which one do I use? (1 min)

**On screen:** A short decision list. Can a computer check it with a yes or no? →
*Automatic check*. Is it the same structure every time? → *Template*. Everything else →
*Rules in words*.

**Narrative:**
- This works for any job you give an AI. Reports, emails and contracts all have taste,
  structure and hard rules.
- Two mistakes to avoid. Don't turn taste into a strict rule. And don't trust words alone
  for a hard rule.

**Transition:** "That's the theory. Now let's watch the skill do
its job."

---

## 4 · The live build (12 min) — `03-live-build.html`

*Three slides wrapped around a screen share. Budget: 1 min setup, ~9 min in the repo,
2 min recap.*

### 4.1 Four things to watch for (1 min)

**On screen:** Four things to watch for, numbered. Leave this up while you switch windows.

1. The prompt is **plain English**. I don't type any CSS.
2. The agent reads the design system first. Then it writes.
3. The linter flags a mistake. The agent fixes it by itself.
4. I reload the browser. That's the deploy.

**Speaker note (webinar-specific):** Say out loud "I'm switching to my editor now" before
you do it. On Zoom, a silent window switch looks like a crash.

### 4.2 Over to the live demo (~9 min)

**Leave the HOLD slide on screen** if you keep the deck window visible. It shows the
prompt word for word, so people can copy it from the recording.

**Run order in the repo:**
1. `presentations/.claude/skills/presentation-slides/SKILL.md` (the skill folder from §3.2) — scroll the design system
   and the sizing rules. Don't read it aloud; point at the shape of it.
2. `.claude/settings.json` — six lines. Show the `PostToolUse` hook.
3. Type the prompt — the one on the HOLD slide, verbatim:
   *"Add one slide to the steal-this deck. List the three files to copy to start: the
   design system, the linter, one working deck. Match the deck's design system."*
   It's new content (not a rebuild of a slide they've already seen), and it pays off: the
   slide shows up again in §7. If it comes out badly, `git checkout 07-steal-this.html`
   before §7 rather than presenting it.
4. Let it run. **Say what it's reading.** Silence while an agent thinks is the worst part
   of any live demo. Talk over it.
5. When the lint hook fires (or if it doesn't, run `node .claude/skills/presentation-slides/scripts/lint-slides.mjs`
   manually so the audience sees the output shape).
6. Reload the deck in the browser. Done.
7. After the talk: commit the slide if it's good, otherwise `git checkout` it — and
   re-export the PDF either way, so the handout matches what was presented.

**Failure plan:** if the model stalls or the network dies, stop at 4 minutes, switch back,
and talk to the recap slide instead. It stands on its own. Do not fix bugs live. Nobody
enjoys watching someone fix bugs live.

### 4.3 What just happened (2 min)

**On screen:** The loop, as five boxes: ask → read the rules → write → lint → reload.
If the lint fails, the agent reads the error, fixes it and retries.

**Narrative:**
- Nothing in that loop is only for slides. It is an agent, written rules, and a check
  that fails loudly. Use it for anything your team makes again and again.
- The slide is now a file in git. You can see what changed, and someone can review it.

**Transition:** "Now, what can a web page do that a normal slide can't?"

---

## 5 · Beyond slide software (5 min frame incl. Exhibit A + 1 min Exhibit B) — `04-beyond-slide-software.html` + reuse

*IDA key topic 3. **This is also where the reuse claim gets proved.***

Show order: the overview card slide → the playlist slide → Exhibit A (the engine, the third
slide of this deck) → Exhibit B (the development loop). The exhibit letters follow that order.

### 5.1 Two things a slide couldn't do (~2 min, slides 1–2)

**On screen:** Two cards, each about to be shown. *Exhibit A · It can run a real model*
(the engine). *Exhibit B · It can animate an idea* (the development loop).
Then "A talk is a list of files": 7 written for today, 3 borrowed.

**Narrative — say this explicitly:**
- "Look at the file paths. Neither of these is in this talk's folder. The engine comes
  from AIPLA. The animation comes from my IDA Driving AI talk in May. This deck loads
  them live, from where they already are."
- "A talk is a list of files. To reorder a talk, I edit this list. So I no longer dread
  the email asking for 'the same thing but twenty minutes.' It takes about a minute."

### 5.2 Exhibit A — a working engine, inside the slide (~3 min, slide 3 of the frame deck)

This one isn't borrowed from another talk. It's the third slide of
`04-beyond-slide-software.html`, so it comes up **straight after the playlist slide, before
Exhibit B**. It gets the extra minute, so let people watch it run.

It is the AIPLA four-stroke engine (in `../assets/otto-engine/`, loaded with
`?lang=en&wide`): a half-section engine on a bench beside its live p‑V diagram. On stage:
**click "Start the engine"**, then **drag the compression ratio** from 8 towards 12 and
watch the loop's peak climb. If there's time, "Measure one cycle" fills in heat in and
work out. Clicking into the engine takes keyboard focus, but → / ← / ↑ / ↓ and the
clicker are handed back to the deck (arrows only stay with the slider while it has focus).

The point to make: an AI agent built this from two documents. One was a physics brief. The
other was written drawing rules. It's the same idea as §3: write your taste down in plain
words. Here it shapes something that isn't a slide. The model loads only when its slide
appears; the PDF gets `../assets/otto-engine/poster.webp`.

Say the line: *"This is not a video. The engine is running in the slide."*

### 5.3 Exhibit B — an animated idea (1 min) — `../ai-slaves-human-masters-ida/03-development-loop.html`

The development loop, animated. Point it out: this slide shows the AI development loop.
It is the same loop that built the slide you watched ten minutes ago. **This is the high
point of the reuse claim:** a slide from another talk, running live and unchanged.

Say the line: *"I did not build this for today."*

**Transition:** "One more thing. This is the one that changed how I write talks."

---

## 6 · One deck, three audiences (6 min) — `05-three-audiences.html`

*IDA key topic 4.*

### 6.1 You are writing for three people (1.5 min)

**On screen:** Three columns.

| Audience | Wants | Usually gets |
|---|---|---|
| The room, right now | A simple slide while you talk | ✅ You get this one right |
| Someone opening the link in six weeks | Text that explains itself, with nobody to talk them through it | Bullet points that only made sense with you talking |
| "Can you send me the slides?" | One file to keep, forward and search | A 40MB attachment that bounces, or a link to a login page |

**Narrative:**
- Usually you pick one of two bad options. One file serves all three badly. Or you keep
  three files, and two of them go out of date.

### 6.2 Detail: the same slide, twice (2 min)

**On screen:** The same slide, twice: "stage", then "guide" with its `.detail` text shown.

**Narrative:**
- The extra text sits in `class="detail"`. One line of CSS hides it on stage.
- In my talk the deck starts in stage. Open the link yourself and it starts in guide.
- **Do it live: press `D`, here, on this slide.** Two seconds beats any slide about it.

### 6.3 The PDF comes from the live deck (1.5 min)

**On screen:** Three steps. *The live deck* (the same slide list as this talk) → *A script
photographs it* (every slide, fully built) → *The PDF* (plus the notes I said out loud).
Bottom line: *One command. The PDF always matches the talk.* The detail text gives the
command: `node export-pdf.mjs death-by-powerpoint --density=guide`.

**Narrative:**
- A normal print can't do this, because the slides animate in.
- So a script opens the real deck in Chrome. It takes a picture of each finished slide.
- It uses the same slide list as the live talk. So the PDF always matches what you saw.
- Whoever asked for the slides gets them, plus what I said out loud.

### 6.4 Don't attach the deck. Put it online. (1 min)

**On screen:** sunholo.com/presentations.

**Narrative:**
- It's plain web files, so hosting costs nothing. It will still open in ten years.
- This deck will be online before the Q&A ends.

**Transition:** "So where do you start?"

---

## 7 · Steal this (2 min) — `07-steal-this.html`

*One slide: the close. Before it, the slide the agent built live, if there is one.*

**Where to start:** this is the slide the agent added in the live build (§4.2). It lists
the three files to copy: the design system, the linter, one working deck. If it was built
live and looks right, show it here (~0.5 min) and say "that's where you start." If it
wasn't built, or you rolled it back, skip it. Don't explain what's missing.

### 7.1 Close (1.5 min)

**On screen:** *The tool is no longer the limit. Ask for more from a slide.* Then
*Questions?*

**Say, just before "Questions?"** (two sentences, no more):
*"When you ask a question, I press Q and the deck saves it with the slide on screen. I
export that log afterwards and answer everything in the write-up."*

Then hand to `../contact-mark/contact-mark.html` and take questions. Press **L** to show
the live log only if it already has something in it. An empty log undersells it.

---

## Playlist & budget

| # | Deck | Label | Min | Group |
|---|---|---|---|---|
| 1 | `../about-mark/about-mark.html` | Who | 1 | Open |
| 2 | `00-death-by-powerpoint.html` | 1 · Death by PPT | 4 | Open |
| 3 | `01-generate-the-medium.html` | 2 · The Medium | 6 | Argument |
| 4 | `02-teaching-taste.html` | 3 · Taste + Lint | 8 | Argument |
| 5 | `03-live-build.html` | 4 · Live Build | 12 | Demo |
| 6 | `04-beyond-slide-software.html` | 5 · Beyond Slides | 5 | Exhibits |
| 7 | `../ai-slaves-human-masters-ida/03-development-loop.html` | B · Animated | 1 | Exhibits |
| 8 | `05-three-audiences.html` | 6 · 3 Audiences | 6 | Payoff |
| 9 | `07-steal-this.html` | 7 · Steal This | 2 | Payoff |
| 10 | `../contact-mark/contact-mark.html` | Contact | 0 | Close |

**Total: 45 min**, leaving ~15 in the 15:00–16:00 slot for the host intro, people joining late, and Q&A.

Three of ten entries live in another folder. That shows the talk's reuse point.

This table and the PLAYLIST in `presenter.html` agree and sum to 45. No entry uses a
`slides:` cap any more. The benchmarks exhibit and the "What's next" deck were
dropped. That freed the time for the rebuilt skills section (now 8
minutes), a full 12 minutes for the live build, and an extra minute for the engine
(§5 is now 5 minutes, including Exhibit A).

The build already has its 12 minutes, so don't take time from it. If you are running
over, **cut Exhibit B · Animated first** (skip it from the jump menu and go straight to
§6). Its point, "the same loop built the slide you just watched", was already made in the
§4.3 recap. If you are still behind, **then shorten the engine demo** to "Start the
engine" and one drag of the slider.

## Pre-flight

- [ ] `talklog` is on for this talk — press **Q** during Q&A to capture questions against
      the slide that prompted them; the export feeds the write-up.
- [ ] Clear `localStorage` key `talklog:death-by-powerpoint` before going live, or you'll
      append to the rehearsal run.
- [ ] Re-run the timings after a rehearsal and paste the measured `minutes:` back into the
      PLAYLIST. The numbers above are estimates, not evidence.
- [x] PDF exported 15 Oct (`node export-pdf.mjs death-by-powerpoint --density=guide`, 29 pages) and
      `const PDF` wired in `presenter.html`. **Re-export after any deck edit** — the PDF is a
      snapshot, and a stale one is worse than none.
- [ ] Zoom: share the *browser window*, not the tab, so switching decks doesn't drop the
      share. Test the screen-share swap to the editor once, cold, before the webinar.
- [ ] Leave the co-presenter flag **off** for a webinar. It needs a mic, and the room
      audio is already going through Zoom. The talk no longer mentions it.
