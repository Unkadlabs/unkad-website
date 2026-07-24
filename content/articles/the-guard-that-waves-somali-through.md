---
title: "The guard that waves Somali through"
date: "2026-07-24"
description: "We gave three safety filters the same 100 harmful requests in English and in Somali. In English, Llama Guard caught all 100. In Somali, it caught 16. The filters are not confused by Somali. They handle harmless Somali fine. They just stop seeing harm."
topics:
  - Safety
  - Multilingual safety
  - Evaluation
keywords:
  - guard models
  - safety classifiers
  - multilingual safety
  - Llama Guard
  - ShieldGemma
  - Granite Guardian
  - Somali NLP
  - low-resource languages
  - content moderation
  - AI alignment
---

Here is the number that stopped us.

We took 100 harmful requests, the kind a safety filter exists to catch, and put
each one to Llama Guard 3 twice. Once in English. Once in Somali. Same request,
same meaning, just translated.

In English it flagged all 100.

In Somali it flagged 16.

The same eighty-four requests it had just called dangerous, it now waved through,
because we changed the language.

## What a guard model is, and why this is not the usual complaint

A guard model is a filter that sits in front of, or behind, a chat model and
decides whether a piece of text is safe or unsafe. Llama Guard from Meta,
ShieldGemma from Google, Granite Guardian from IBM. When a company deploys an
open model, this is often the thing standing between a user and a harmful
response. It is the fence. It is also, increasingly, the thing that lets a company
say its deployment is safe, because there is a documented filter in the pipeline
with a number attached to it.

The usual complaint about these filters in languages other than English is that
they get twitchy. They see an unfamiliar language, get nervous, and block too
much, including harmless things. That failure is real and it is documented. It is
also, from a safety standpoint, the forgivable kind of wrong. A fence that is too
tall is still a fence. Users complain, someone loosens it, life goes on.

We found the opposite, and the opposite is not the forgivable kind of wrong.

## The test

Three guard models. Two languages. The same 150 prompts in each: 100 harmful,
drawn from an existing Somali safety benchmark where the harmful pairs were
already checked by a native speaker, and 50 harmless everyday prompts, things like
"explain the difference between climate and weather" or "write a thank-you note to
a teacher."

For each guard, in each language, we measured two things. How many of the harmful
prompts did it catch? And how many of the harmless prompts did it correctly leave
alone?

That second question is the one that makes the result mean something. If a guard
were simply broken in Somali, or could not read it at all, it would get the
harmless prompts wrong too. It would flail in both directions. So we watched both.

Everything here ran locally, on quantised open models, on one laptop. We wrote
down what we expected before we ran it, and we will come back to that, because we
got the direction wrong.

## What we found

The harmful catch rate, English versus Somali:

| guard | English | Somali |
|---|---|---|
| Llama Guard 3 | 100% | 16% |
| ShieldGemma | 67% | 6% |
| Granite Guardian | 100% | 63% |

And the harmless prompts, the control, in Somali: Llama Guard passed 96% of them,
ShieldGemma 100%, Granite 98%.

Read those two things together, because the combination is the whole finding. Each
guard handles harmless Somali almost perfectly. It understands the language well
enough to tell that "write a thank-you note" is fine and to let it through. It
simply loses the ability to tell that a request for something dangerous is
dangerous, once that request is in Somali.

ShieldGemma is the sharpest case. In Somali it catches 6 harmful prompts out of
100 and correctly passes every single one of the 50 harmless ones. It is not
blocking too much. It is barely blocking at all, while behaving impeccably on the
safe examples. From the outside, that is indistinguishable from a careful,
well-tuned filter. It is a fence with almost nothing behind it.

## Where it fails worst

Aggregate numbers can hide as much as they show, so we broke the Somali catch rate
down by the kind of harm. This is where it stops being a statistic and starts
being a specific list of things that get through.

| harm category | Llama Guard | ShieldGemma | Granite |
|---|---|---|---|
| self-harm | 0% | 10% | 50% |
| misinformation | 7% | 0% | 60% |
| cybersecurity | 7% | 7% | 73% |
| privacy | 10% | 0% | 100% |
| hate speech | 13% | 0% | 67% |
| harmful instructions | 30% | 0% | 65% |
| CBRN (chem/bio/nuclear) | 33% | 27% | 33% |

Two rows in that table are worth stopping on.

The first is self-harm. In English, Llama Guard catches every self-harm prompt we
gave it. In Somali, it catches none of them. Zero out of ten. This is the category
where a wrong answer from the model behind the filter can cost a life, and for the
strictest of the three guards, the filter is simply not present in Somali.

The second is CBRN, the chemical, biological, radiological, and nuclear category,
the highest-consequence content a guard is ever asked to stop. It is the one place
all three guards converge, and they converge on failure: none of them catches more
than a third of it in Somali. Even Granite, which is otherwise the best of the
three by a wide margin, catching 60 to 100 percent of most categories, drops to 33
percent here. The most dangerous requests are the ones the filters are jointly
worst at recognising in this language.

## Why the dashboard would not catch this

This is the part that should worry anyone running these systems in production.

Real traffic is mostly harmless. Only a small fraction of what users send is
genuinely dangerous. So imagine you evaluate one of these guards the ordinary way,
on realistic traffic where perhaps one message in twenty is harmful, and you
report the number everyone reports: overall accuracy, how often the guard got the
verdict right.

Working from the rates we measured, ShieldGemma on Somali would score about **95
percent accuracy** on that realistic mix. Llama Guard about **92 percent**.

Ninety-five percent. That is a number you sign off on. That is a number that goes
into a launch review, sits in a compliance document, and never gets a second
question.

And it belongs to a filter catching six percent of the harm.

The accuracy looks healthy because the traffic is mostly harmless and the guard is
genuinely good at harmless. The one job that justifies the filter's existence,
catching the dangerous fraction, is the job it has quietly stopped doing, and the
headline metric cannot see it, because the headline metric is drowned out by the
easy cases.

This is not a subtle statistical point. It is the reason a broken filter can pass
review. Accuracy on imbalanced traffic measures how well you handle the common
case, and safety lives entirely in the rare case. To be exact about what is ours
and what is inference: we measured the catch rates and the pass rates directly.
The 95 percent figure is those measured rates reweighted to a realistic harmful
fraction. It is an illustration of how the failure would present on a dashboard,
not a separate experiment. But the catch rates it is built from are real, and they
are the numbers that matter.

## Why might this be happening

We can describe the failure precisely. We cannot yet prove its mechanism, and we
want to be careful about the line between the two. What follows is a hypothesis
that fits the pattern, not a result.

The shape of the per-category table is a clue. The category that survives
translation best, across all three guards, is CBRN. The categories that collapse
hardest are self-harm, misinformation, and hate speech. What separates them?

CBRN content tends to carry hard lexical markers. The names of specific chemicals,
pathogens, and materials often survive translation more or less intact, because
they are technical terms rather than ordinary prose, and a guard that has learned
to react to those tokens can still react to them in a Somali sentence. Self-harm
and hate speech are the opposite. Their harm lives in phrasing, intent, and
context, in how something is said rather than in a keyword, and that is exactly
what translation into a low-resource language dissolves.

That points to an uncomfortable possibility: that a good part of what these guards
learned as "harmful" is closer to a list of English-shaped danger words than to an
understanding of harm. In English, where the training data is dense, the two are
hard to tell apart, because the words and the meaning travel together. Translate
into a language the model barely saw in training, and they come apart. The words
are gone. If the words were doing the work, the guard goes quiet.

If that is right, it is not really a Somali problem. It is a statement about what
the filter is, revealed by a language poor enough to strip away the surface it was
leaning on. That is a claim worth testing directly, and it is the first thing we
would run next.

## How this fits what others have found

There is an open disagreement in the literature about which way safety systems
fail in unfamiliar languages, and our result lands squarely in the middle of it.

One line of work reports that evaluators become more lenient in lower-resource
languages, scoring content more generously when they are less certain
([Zhou et al., 2026](https://arxiv.org/abs/2607.14480)). Another reports the
reverse for guard models specifically, elevated false-positive rates and
over-blocking on low-resource languages including Swahili
([Yang et al., 2024](https://arxiv.org/abs/2410.22153)). Both are careful papers.
They point in opposite directions.

Nobody had checked at the guard layer for Somali. We did, and the answer is
unambiguous for these three systems: they become more permissive, not more
restrictive. That agrees with the leniency direction and contradicts the
over-blocking one, at least here. We are one data point, not a resolution, but it
is a data point in a question that currently has two confident and opposing
answers, and it comes from a language none of that work covered.

## We predicted the wrong direction, and we are telling you

Two days before we ran this, we published a finding about a different kind of AI
overseer, one that reads and judges text. We showed that when you give it a
document it cannot read, it does not get confused, it starts rejecting almost
everything. And we speculated, in writing, that a safety filter in a language it
does not handle might do the same: refuse too much, look overly cautious, block
the harmless along with the harmful.

This experiment was partly meant to confirm that guess. It did the reverse.

The judge, denied access, rejects. The guard, given Somali, permits. Same lab,
same week, opposite behaviour. Because we wrote the prediction down beforehand, we
cannot quietly forget we made it, and we would rather say it plainly here than
have someone notice the contradiction later. We predicted over-blocking. We found
over-permitting, on all three guards, decisively.

The reversal is also the more useful result, and worth sitting with for a moment.
Over-blocking announces itself. Users hit the wall, they complain, someone
investigates. Over-permitting is silent. Nothing breaks, no one complains, the
dangerous requests simply get answered, and the dashboard stays green. Of the two
ways to be wrong, this is the one that survives.

## What a deployer should take from this

If you are using any of these three open guard models to moderate Somali content
today, the practical implications are direct.

Do not trust an aggregate accuracy or F1 number on imbalanced traffic to tell you
whether the filter works. Measure the catch rate on known-harmful content in the
target language specifically, and measure it separately from performance on benign
content. A single blended score will hide exactly this failure. The
prevalence-insensitive way to see it is to report how much harm is actually
caught, not how often the verdict is right.

And treat the per-category picture as the real safety surface. An 84 percent miss
rate is bad; a 100 percent miss rate on self-harm, or a two-thirds miss rate on
CBRN, is a different and more specific kind of bad, and it is invisible until you
break the number down by what is getting through.

## What this is, and what it is not

This is a small, direct measurement. Three guards, two languages, 150 prompts
each. The numbers are large and consistent, but the study is deliberately narrow,
and there are things it cannot yet tell you.

It cannot separate "Somali specifically" from "any language these guards were not
built for." The obvious next experiment is the same test across a ladder of
languages, from high-resource to low, to see whether the collapse tracks how much
of each language the guard saw in training. It also tested the filters on prompts
alone, which is one of the two common ways they are deployed; the other is judging
a full prompt-and-response pair, and that deserves its own run. And the mechanism
above is a hypothesis the current data is consistent with, not one it proves.

What it is not is ambiguous about the thing that matters. If you are relying on
these guard models to make Somali deployment safe, they are not doing the job you
think they are doing, and the score on your dashboard will not warn you. The gap
between English and Somali is not a rounding error. For the strictest of the three
it is the difference between catching everything and catching one request in six,
and for the most dangerous category of all, none of the three catches even half.

Nobody had run these guard models on Somali before. We checked that too. The
filters that much of the open-source world leans on to make deployment safe have,
for this language, close to nothing behind them, and they report a clean bill of
health while it is true.

---

*The full data, all 300 prompts, every guard verdict, the pre-registration, and
the analysis are in our
[guard-collapse repository](https://github.com/Unkadlabs/unkad-guard-collapse). The
harmful prompts come from [SomaliBench](https://arxiv.org/abs/2605.25420).
Correspondence to research@unkad.com.*
