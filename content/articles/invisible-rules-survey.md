---
title: "We looked for hidden instructions in 28,796 AI rule files. We found none."
date: "2026-09-26"
description: "Coding agents follow rule files that humans review but cannot fully see: some Unicode characters are invisible on screen and readable by the model. We scanned 28,796 public rule files from GitHub for instructions hidden that way. None were live attacks. This is our first field survey: measuring whether a known risk is actually happening."
hook: "0 / 28,796"
hookLabel: "public AI agent rule files hiding instructions from the humans who review them"
topics:
  - Safety
  - Agents
  - Field survey
keywords:
  - AI agents
  - prompt injection
  - Rules File Backdoor
  - ASCII smuggling
  - Unicode tag characters
  - Trojan Source
  - coding agents
  - supply chain security
  - AGENTS.md
  - cursorrules
---

Here is the number.

We collected 28,796 different rule files that coding agents read, from 28,651
public GitHub repositories, and checked every one for instructions hidden from
the people who review them.

We found none in use. The one true detection was a planted example inside a
security tool's own test suite.

That is a good result, and it is also the point of this note. Most AI safety
work shows that something bad *can* happen. This is the other half: checking
whether it *is* happening, and how often.

## The risk

Coding agents such as Cursor, GitHub Copilot, Claude Code, Windsurf, Cline and
Gemini CLI read project rule files like `.cursorrules`, `AGENTS.md`, `CLAUDE.md`
and `.github/copilot-instructions.md` and follow them, often with permission to
edit code and run commands.

People review those same files in an editor or on GitHub. But some Unicode
characters draw nothing on screen while the model still reads them. The Unicode
"tag" block, for example, mirrors ordinary ASCII letters invisibly. A line that
looks like "Use TypeScript strict mode" can carry a second instruction no
reviewer ever sees.

This is not our discovery. [Trojan Source](https://arxiv.org/abs/2111.00169)
(Boucher and Anderson, 2021) showed invisible Unicode can make code mean
something other than what it displays. Riley Goodside and Johann Rehberger
showed in 2024 that [tag characters can smuggle hidden text into language
models](https://embracethered.com/blog/posts/2024/hiding-and-finding-text-with-unicode-tags/).
In March 2025 Pillar Security demonstrated the [Rules File
Backdoor](https://www.pillar.security/blog/new-vulnerability-in-github-copilot-and-cursor-how-hackers-can-weaponize-code-agents):
exactly this attack, against Cursor and Copilot rule files. GitHub now warns
when a file contains hidden Unicode.

So the attack is real and known. What we did not find anywhere was a
measurement of how common it is in the files people actually use.

## What we did

We used GitHub's official code search to collect public rule files of eight
kinds, fetched their contents, and scanned each with a small open scanner that
looks for five techniques:

| Technique | What it does | Rated |
|---|---|---|
| Tag-character smuggling | invisible characters that spell out ASCII text; the scanner decodes it | critical |
| Variation-selector smuggling | bytes hidden in a chain of selectors after an emoji or letter | critical |
| Zero-width binary | two invisible characters used as 0 and 1 | critical |
| Bidirectional overrides | the displayed order differs from what the model reads | high |
| Hidden comments, off-screen text | instructions in comments, or pushed past the edge of the screen | medium |

Legitimate uses are excluded: byte order marks, emoji joiners, flag tags, and
the joiners that Arabic, Persian and Indic scripts genuinely need. Every flag
above medium severity was reviewed by hand, and every false positive we hit in
review became a test.

## What we found

| Finding | Files | Verdict |
|---|---:|---|
| Hidden instruction, zero-width run | 1 | a planted test case in a prompt-injection detector's evaluation set |
| Stray zero-width spaces | 49 | copy-paste leftovers, nothing encoded |
| Soft hyphens | 13 | typesetting leftovers |
| Repeated byte order marks | 6 | editor encoding artefact |
| Directional marks without right-to-left text | 3 | formatting leftovers |

No smuggled tag characters, no variation-selector payloads, no zero-width
binary, no bidirectional overrides and no hidden malicious comments appeared
outside test fixtures.

A zero is not proof of absence, so we state what it rules out. If hidden
instructions appeared at a rate of one in 9,600 files or more in the population
we sampled, we would very likely have seen at least one (95% confidence).

Our result agrees with the closest study we found, [a prevalence survey of
hidden text aimed at agents on
websites](https://github.com/asish-singh/agent-safety-scanner), which also
found none. Two independent searches, two surfaces, the same answer.

## How much of GitHub this covers

Not all of it, and for some formats very little.

| File | Collected | Share of what GitHub indexes |
|---|---:|---:|
| `.clinerules` | 3,628 | 85% |
| `.windsurfrules` | 3,212 | 74% |
| `.cursorrules` | 4,597 | 14% |
| `GEMINI.md` | 4,519 | 7% |
| `copilot-instructions.md` | 4,576 | 3% |
| `.cursor/rules/*.mdc` | 3,949 | 2% |
| `CLAUDE.md` | 4,472 | 0.5% |
| `AGENTS.md` | 4,748 | 0.5% |

GitHub search returns at most 1,000 results per query, ranked by relevance, and
indexes only default branches. So the honest reading is: **hidden-instruction
attacks are not common in the popular, search-ranked rule files that most
developers copy from.** For the newer formats we covered most of what exists.
For `AGENTS.md` and `CLAUDE.md`, now in close to a million repositories each,
we saw a thin slice.

## What this is, and what it is not

It is a snapshot, taken 26 September 2026. Rule files change daily.

It does not cover pull requests, forks, rule-sharing websites, packages, or the
tool descriptions of MCP servers, where the same trick works and where others
have reported smuggled content. It does not cover malicious instructions written
in plain, visible text, which are a real risk but one a careful reader can see.

The scanner is not new either; several open tools do similar checks. What is
new is the count.

## Why a safety lab does this

Demonstrations tell you an attack is possible. They do not tell you where to
spend attention. A measured zero, with its limits written down, is useful: it
says this channel is not yet being used at scale, and gives a baseline to
compare against when it is. We will rerun the survey, and extend it to agent
tool descriptions next.

We call this kind of work a field survey: pick a known risk, measure it in the
wild, publish the number and its limits, repeat. It is the first of several.

## Ground rules we kept

Collection was passive: official API only, under ten requests a minute, and
nothing downloaded was ever run. Findings are reported by technique, never by
person. Had we found a live payload, the repository's maintainer would have been
told privately first, and the payload kept out of this report.
