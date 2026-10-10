# Daneel: Sunholo presentations

These are HTML decks published at https://www.sunholo.com/presentations/.
Read `.claude/skills/presentation-slides/SKILL.md` and its design references.
Use repository-relative paths; the laptop paths in that skill are historical.

Change only the requested deck and its necessary assets. Update the root index
only when adding or renaming a deck or when explicitly asked. Keep existing
published deck URLs stable. Use the established slide structure, themes, canvas
and navigation; a new deck may reuse an existing repository deck template and
its existing navigation without introducing new executable behaviour. Do not
add dependencies, new standalone scripts, trackers, external embeds, form actions,
deployment workflow changes, credentials or domain settings.

Use the supplied talk brief and accessible evidence. Do not invent product facts
or attributed quotes. Prefer shared logos and existing assets; preserve relative
paths. If an input asset is missing, say BLOCKED rather than retrieving another
repository through a credential workaround.

There is no compilation step. Check changed HTML and asset paths, then inspect
the deck in a browser: keyboard navigation, theme switching, slide positioning
and overflow at the established 16:9 layout. Verify the root index links where
changed. Report exactly which checks ran and disclose missing browser checks.

Commit on the task branch. The coordinator opens one PR against `main`.
For revisions use the existing PR branch as the task's site skill requires.
Never push directly to `main`, approve or merge. Mark reviews and merges;
the existing Pages workflow publishes after merge, subject to a successful run.
