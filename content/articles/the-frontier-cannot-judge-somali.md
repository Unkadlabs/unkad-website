---
title: "The frontier can read Somali. It cannot judge it."
date: "2026-08-12"
description: "We showed 593 community-validated Somali submissions to the newest models from OpenAI, Google, and Anthropic and asked the question our volunteers answer every day: is this good Somali, or not? The models placed the texts in the right domain two-thirds of the time. They caught almost none of the bad ones."
hook: "0 / 23"
hookLabel: "Bad Somali submissions two frontier models caught. Our volunteers caught all 23."
topics:
  - Evaluation
  - Frontier models
  - Data quality
keywords:
  - frontier models
  - GPT-5.6
  - Gemini 3.1 Pro
  - Claude Sonnet 5
  - Somali NLP
  - low-resource languages
  - data validation
  - LLM-as-judge
  - corpus quality
  - human validation
---

Since July, the volunteers on [Qor](https://qor.unkad.com) have peer-reviewed
every Somali submission that comes into our corpus. Out of 593 verdicts so far,
they accepted 570 and rejected 23. The rejected ones are real Somali, but with
broken passages, mangled spelling, or quality below the bar the community
holds.

Yesterday we put the same 593 texts, one at a time, to the newest generation of
models from the three leading AI labs and asked the question our validators
answer every day: is this good Somali, or not?

GPT-5.6 caught none of the 23. Gemini 3.1 Pro caught none of the 23, and in
593 verdicts it never said no once. Claude Sonnet 5 caught three.

![Four rows of 23 cells, one cell per rejected submission, filled when the judge caught it. Qor validators: all 23 filled. Claude Sonnet 5: 3 filled. GPT-5.6: none. Gemini 3.1 Pro: none.](/images/fig-qiimeyn-catch.png)

## The jury that had already ruled

What makes this test possible is that the answer key was written by hand, twice
over.

Every sentence in the Qor corpus is judged by Somali speakers under a fixed
policy. Two peer approvals accept it, two rejections reject it, and a split
escalates to a reviewer. Since July 19, 115 contributors have written the
texts and cast more than a thousand validation votes on each other's work.
Nobody validates their own submission, and one person gets one vote per item.
The database enforces it.

So for each of the 593 texts, we know what a community of Somali speakers
decided, and we know the models could not have seen those decisions. None of
the rejected texts are published anywhere, and most of the corpus postdates
every model's training data.

That is the ground truth. The question is whether the most capable AI systems
in the world can reproduce it.

## The test

Three models, one from each lab, the current generation at the standard tier:
**GPT-5.6** from OpenAI, **Gemini 3.1 Pro** from Google, and **Claude Sonnet
5** from Anthropic. Each saw each text twice, through one API, with two
questions.

First: accept or reject? The instruction mirrored the community's own lenient
standard. Accept anything that is real, understandable Somali. Reject only
what is clearly bad. The community itself rejects only one submission in
twenty-six, so the bar we described is the bar they actually apply.

Second: what is it about? Pick one of the nine sectors the corpus tracks:
health, education, agriculture, law, media, religion, culture, technology,
general. This question is the control. A model that fails the first question
because it simply cannot read Somali should fail this one too.

Every raw answer was saved before any scoring, which matters later in this
story. The entire trial, 3,443 model verdicts, cost $5.02.

## What we found

The accept/reject results, against the community's verdicts:

| model | agreement | of the 570 good, accepted | of the 23 bad, caught |
|---|---|---|---|
| GPT-5.6 | 95.8% | 99.6% | 0% |
| Gemini 3.1 Pro | 96.1% | 100% | 0% |
| Claude Sonnet 5 | 93.6% | 96.8% | 13% |

Read the first column the way a procurement office would: 96 percent
agreement with human validators. That is a number that ends meetings. Buy the
model, retire the volunteers.

Now read the last column, which is the only one that measures the job.
Validation exists to catch the bad submissions. On that job, the two
highest-agreement models scored zero.

The agreement number is an illusion made of base rates. Since 96 percent of
the corpus is good, a judge that approves everything scores 96 percent while
exercising no judgment at all. Gemini demonstrated this in its purest form. It
answered accept 593 times out of 593. The model with the highest agreement
was the one that judged the least.

We have seen this exact shape before, one layer down the stack. In July we
tested safety guard models on Somali and found them
[waving harmful prompts through](/articles/the-guard-that-waves-somali-through)
while scoring beautifully on aggregate accuracy. Same illusion, same
mechanism. When the target class is rare, the headline metric is drowned out
by the easy cases, and a system that has quietly stopped doing its one job
still posts a number you would sign off on. It is apparently not a quirk of
small open-source filters. It survives all the way up to the frontier.

## What a no looks like, when a model attempts one

Claude Sonnet 5 deserves a closer look, because it was the only model that
actually used the red pen, and what it did with it is its own finding.

Sonnet said no 21 times. Three of those were community-rejected texts. Genuine
catches, the only three in the whole experiment. The other 18 were
submissions the community had accepted. Its noes were wrong six times out of
seven. The one model willing to reject could not aim.

So the frontier gives you a choice of failure. Two models that never fire,
and one that fires mostly at the wrong target. None of the three can be
trusted to hold the gate. Not as the judge, and not even as a pre-screen,
because a filter that misses 87 to 100 percent of what it exists to catch is
not a filter.

## They can read it. That is what makes this interesting.

The lazy explanation would be that these models simply cannot process Somali.
The second experiment rules that out.

![Horizontal bar chart of sector classification accuracy averaged across the three models. Health 98%, technology 96%, agriculture 93%, religion 91%, education 86%, then law 61%, culture 55%, general 49%, media 43%.](/images/fig-qiimeyn-sectors.png)

Asked to place each text in one of nine sectors, the models scored 65.8
percent for GPT-5.6, 69.7 percent for Gemini, and 64.5 percent for Sonnet,
six times better than chance. And the pattern in the errors is the pattern of
a reader, not a guesser. Where a sector has concrete vocabulary, in health,
technology, agriculture, and religion, the models place Somali texts
correctly 86 to 98 percent of the time. They read a passage about vaccination
in Somali and know it is about health. They read farming advice about
planting after the first rains and know it is about agriculture.

Where they fall apart, on media, general, and culture, the boundaries are
editorial. Is a radio broadcast schedule media or general? Is a wedding
custom culture or religion? Our own contributors debate these lines, and in
fairness, some of that 43 percent on media is a comment on our taxonomy as
much as on the models.

Put the two experiments side by side and the finding sharpens into something
more specific than "AI is bad at Somali." The models comprehend the content.
What they cannot do is evaluate it. They cannot tell fluent from broken,
complete from abandoned, careful from careless, in a language where they have
seen too little text to know what careful looks like. Comprehension survived
the low-resource gap. Judgment did not.

## The bug was ours

We owe you one correction, and it is embarrassing enough to be useful.

The first time we scored the sector experiment, agriculture came out at zero
percent. Not low. Zero, for all three models, on 41 texts. And all three
"misclassified" it the same way: as culture.

Three independent models agreeing that perfectly ordinary farming advice is
culture, unanimously, forty-one times, is not a model failure. It is a data
pipeline waving a flag. The texts were clearly agricultural. The models'
saved answers, when we read them, said "agriculture" plainly.

![The word agriculture set in large type, with its last seven letters, culture, highlighted in saffron. Below, two bars: agriculture accuracy as first scored, 0%; after the one-line fix, 93%.](/images/fig-qiimeyn-bug.png)

The word "agriculture" contains the word "culture." Our answer parser scanned
each reply for the last sector name it mentioned, and inside every correct
"agriculture" it found "culture" seven letters later. Every right answer was
recorded as wrong. We fixed one line so the parser matches whole words only,
and agriculture jumped from 0 to 93 percent. No model was re-queried. We only
re-read the answers we had saved.

We could have quietly fixed this and published the clean table. We are
telling you instead, for two reasons. First, because we publish these
experiments so that people can trust the numbers, and trust survives
corrected errors better than it survives discovered silences. Second, because
it is the experiment's own lesson in miniature: the evaluation pipeline is
part of the experiment. A scoring bug produced a result that looked exactly
like a dramatic model failure. Unanimous, quantified, publishable. The only
reason it did not become a false headline is that a unanimous zero looked too
strange to accept, and the raw answers were still there to re-read. Save your
raw outputs. Distrust your cleanest disasters.

## What five dollars buys

A note on cost, because it is part of the point.

The entire trial, three frontier models answering two questions about 593
texts, cost five dollars and two cents, and about two-thirds of that went to
a single model. Gemini refuses to answer even a one-word question without
running its reasoning process first, and its mandatory thinking cost more
than both other models' entire runs combined. Its sector score rests on a
random sample of 478 texts rather than the full set, because the budget ran
out before the last hundred. At 478, the margin is under five points either
way.

Five dollars. The barrier to auditing how frontier AI treats your language is
not money and it is not infrastructure. It is the answer key: a body of text
in your language whose quality was judged by people who speak it, item by
item, before the models ever saw the question. That is the expensive thing.
That is the thing no lab can buy off a shelf, because for Somali it did not
exist until people sat down and made it.

We have one. It is three weeks old and it is already doing science.

## What this is, and what it is not

This is a small, direct measurement, and there are things it cannot say.

Twenty-three rejected texts is a thin slice. With a sample that size,
catching zero is statistically compatible with a true catch rate as high as
about 15 percent. The direction is not in doubt, since the community caught
23 of 23 while the frontier's best was 3, but the models' exact floor is not
pinned down. Our instruction to the models described the community's lenient
standard in one paragraph, and a longer rubric with worked examples might do
better. That is worth testing. And the comparison is not perfectly level.
Validators judge inside the platform, where they can notice a near-duplicate
or an off-task answer, while the models saw each text alone.

What it is not is ambiguous about the practical question we opened with. We
built Qor on the premise that for a language like Somali, quality judgment
has to come from people who speak it, and that there is no model you can rent
to do it instead. That premise is now a measured result. The most advanced
systems from the three leading labs, models that can place a Somali text in
the right domain two times out of three, could not find 23 bad submissions
that a volunteer community found unanimously. The 570 good sentences in our
corpus are good because 115 people said so, one sentence at a time. As of
this week, that is not just the honest way to build a Somali corpus. It is
the only way anyone has demonstrated.

---

*Both experiments, the runner with its budget kill-switch, the scoring code,
and the full aggregate results are in our
[qiimeyn repository](https://github.com/Unkadlabs/qiimeyn). Qiimeyn is Somali
for evaluation. The 593 texts and per-item verdicts stay private, because
rejected submissions are not covered by the release consent contributors gave
for accepted work. Correspondence to research@unkad.com.*
