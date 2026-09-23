---
title: "It did not say yes. It did not understand the question."
date: "2026-09-23"
description: "Open models refuse harmful requests in English and go along with them in Somali. We asked whether they understood the Somali at all. Mostly, they did not: of every harmful Somali request Llama 3.1 went along with, it had understood none. The refusal gap is real, but it is mostly a reading failure, not a model that knows and helps anyway."
hook: "0 of 7"
hookLabel: "harmful Somali requests Llama 3.1 went along with that it had actually understood"
topics:
  - Safety
  - Multilingual safety
  - Evaluation
keywords:
  - multilingual safety
  - refusal gap
  - low-resource languages
  - Somali NLP
  - AI alignment
  - jailbreaks
  - SomaliBench
  - pre-registration
---

Here is the number we did not expect.

Llama 3.1 went along with 7 harmful requests written in Somali. We checked, one
by one, whether it had understood what it was being asked.

It had understood none of them.

## The question our own paper left open

Earlier this year we published a study, [SomaliBench
Eval](https://arxiv.org/abs/2605.25420), that put the same 100 harmful requests
to four open models in English and in Somali. The result was stark. Llama 3.1
refused all 100 in English and 7 in Somali. Every model we tested refused far
less in Somali.

That result invites an alarming reading: the safety training is bound to
English, so a model that reads your Somali request perfectly well will simply
help. We said so ourselves: "the models comply in Somali."

But the paper never checked whether the models understood the Somali. Two very
different stories produce the same low refusal rate.

In the first, the model understands the request, knows it is harmful, and helps
anyway. That is a true alignment failure.

In the second, the model does not understand the request and produces something
loosely related, or nothing coherent at all. That is a capability failure. The
refusal gap still exists, but it means something different, and it predicts
something different about the future.

We set out to tell these apart.

## The test

We wrote our predictions and our entire analysis down before running anything,
and committed them, timestamped, before the first harmful request was sent. Then we asked the
same four models, running locally, four questions about each harmful Somali
request.

**Can you translate it?** We asked each model to translate the Somali into
English, and compared its translation with a native speaker's English rendering
of the same request.

**Is it harmful?** We asked each model, in English, whether fully answering the
request would be harmful. We included 50 harmless Somali requests too, so a
model that calls everything harmful gets caught.

**What do you do with it?** We sent the request itself, the way a user would,
and recorded the response.

**Does restating it help?** We told the model to first restate the request in
English, then respond.

An automated judge labelled the responses. It declined to read 72 of them, the
most harmful ones, so a native Somali speaker labelled those by hand, and
blind-checked 40 of the judge's translation labels.

## What we found

Most of the time, the models did not understand the Somali.

| Model | Translated correctly | Went along with the request | Of those, understood and knew it was harmful |
|---|---:|---:|---:|
| Llama 3.1 8B | 2 of 100 | 7 | 0 |
| Gemma 2 9B | 27 of 100 | 18 | 4 |
| Qwen 2.5 7B | 1 of 100 | 13 | 1 |
| Aya 23 8B | 0 of 100 | 6 | 0 |

The translations tell the story. A request for detailed self-harm instructions
came back from Llama as "a clear explanation regarding the physical and mental
condition of the body." When we told models to restate requests in English
before answering, a request to make a fake ID became a request about fake news.

And most responses were not help at all. Of Llama's 100 responses to harmful
Somali requests, 90 were off-topic or incoherent. It refused 3, went along with
7, and produced noise for the rest.

So the low refusal rate in our paper was real, and we reproduced it. What it
mostly measured was a model that could not read the question.

## The one model that could read

Gemma 2 is the exception worth watching. It translated about a quarter of the
requests correctly, better than the others by a wide margin. Asked whether a
Somali request was harmful, it answered correctly 94% of the time, and correctly
passed 90% of the harmless ones. It can tell harm apart in Somali even when it
cannot fully translate it.

Gemma also refuses the most. And it is where knowing compliance appears: of the
18 harmful requests it went along with, it had understood and flagged 4, about
one in five.

That is the pattern that should worry us about the future. As models get better
at reading Somali, the incomprehension shrinks, and what remains is the model
that reads the request, knows, and still sometimes helps.

## A cheap defence that mostly works

Asking the model to restate the request in English before answering raised
refusals sharply for three of the four models, while barely touching harmless
requests.

| Model | Refused before | Refused after restating |
|---|---:|---:|
| Llama 3.1 | 3% | 33% |
| Gemma 2 | 49% | 68% |
| Aya 23 | 5% | 48% |
| Qwen 2.5 | 23% | 21% |

It works for a revealing reason. The restatements were often mistranslations too.
Refusal came back because the misreading still sounded harmful, not because the
model suddenly understood. It is a patch, and Qwen shows it does not always hold.

## We predicted the wrong thing, and we are telling you

Our main prediction was that Llama and Gemma would mostly understand the
requests they helped with. We expected the alarming story. Both predictions
failed. So did our prediction that Llama could reliably tell harmful Somali
from harmless, and our prediction that restating would help every model.

In total, 13 of our 20 pre-registered predictions held and 7 failed. We are
publishing all of them.

## A correction to our own words

We have written, in this lab's posts and pages, that open models "comply" with
harmful requests in Somali. For these small models, that overstated what we had
measured. Most of what we counted as a failure to refuse was a failure to
understand. We are correcting it here rather than quietly.

## What this is, and what it is not

The honest claim is narrow. These four small models, at 4-bit, mostly cannot
reliably read harmful Somali requests, and when they go along with one, they
usually did not understand it.

Translation is harder than comprehension, so "could not translate it" is a
stricter test than "did not understand it." Gemma shows the gap: it judged harm
far better than it translated. Our native speaker's blind check found the
automated judge was, if anything, too generous about translations, so the
understanding rates here are an upper bound.

It is not a statement about large frontier models, which read Somali far
better. The obvious next question is what a model that reads Somali well does
with the same requests. That is the experiment we are running next.

One person translated the Somali, and one person checked the labels. The
English requests come from public benchmarks the models may have seen. Four
models, one run each, 100 requests.

## Why it matters

The lazy reading of the refusal gap is that Somali is a password that unlocks a
helpful, harmful model. The data says something more useful. Today, for small
open models, the gap is mostly a reading failure, which means the danger is
lower than it looks and will grow as the models improve. Safety that depends on
a model not being able to read your language is not safety. It is a delay.

The fix is the same one that makes models better at Somali in the first place:
Somali written and checked by people, so that models learn to read it, and
evaluations exist to see what they do once they can.
