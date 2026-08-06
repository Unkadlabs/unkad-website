---
title: "One model reads Somali. The next one approves word salad."
date: "2026-08-05"
description: "We gave three open models the easiest version of our community's validation job: tell a real Somali sentence from the same words shuffled. One scored 0.94. One rejected 31% of sentences our validators had already approved. One called scrambled Somali a proper sentence nine times out of ten. Same task, same size class, and no benchmark table would show you the difference."
hook: "9 in 10"
hookLabel: "Bags of scrambled Somali words that an open model called a natural sentence"
topics:
  - Evaluation
  - Multilingual
  - Somali NLP
keywords:
  - low-resource languages
  - Somali NLP
  - evaluation
  - calibration
  - grammaticality judgement
  - community corpus
  - open models
  - Gemma
  - Llama
  - Qwen
  - tokenization
---

Everyone knows that language models are worse in low-resource languages. That is
not a finding, it is the background assumption of the entire field, ours included.
We have written it ourselves. We went into this experiment expecting to measure
how much worse, on Somali, at the simplest task we could construct.

The assumption is wrong, or at least far too coarse to be useful. Of three open
models in the same size class, on the same test, one was nearly as good in Somali
as in English. One threw away a third of our corpus. One approved word salad nine
times out of ten.

There is no such thing as how well models do in Somali. There is only which model,
and nothing on any of their model cards tells you which is which.

## What Hubi is, and why we were asking

On qor.unkad.com, Somali speakers write sentences and other Somali speakers check
them. The checking mode is called Hubi. Nothing enters our open corpus until two
independent reviewers, working separately, agree that a sentence is correct,
natural Somali. As of this week the community has verified 2,377 sentences that
way, on phones, in under ten minutes a week each.

Every few weeks somebody asks the obvious question. Why are people doing this by
hand? A model could check the sentences.

It is a fair question and we had opinions rather than a measurement. So we built
the easiest possible version of the Hubi job. Not the real job, which turns on
inflection and dialect and register and which our validators genuinely argue over.
The floor beneath it.

Take a verified sentence. Shuffle its words into random order. Show a model each
version separately and ask one thing: is this a coherent, natural sentence with
correct word order, yes or no.

A fluent speaker scores essentially 100% on this. One version is a sentence a
person wrote and two people approved. The other is the same words in a bag. If a
model cannot do this, there is no version of Somali validation it can do, and the
question answers itself.

## The test

Three open models: Gemma 2 at 9B, Llama 3.1 at 8B, Qwen2.5 at 7B. 200 verified
Somali sentences from our corpus with their shuffled counterparts, and 200 clean
English news sentences with theirs as a control. 2,400 judgements, everything
local, on 4-bit quantised weights, on one machine in Mogadishu. No API keys, no
rented compute.

The control is what makes the result mean anything. A model that is simply bad at
this task, or thrown by the phrasing of the question, would fail in English too,
and the Somali number would tell us nothing about Somali. So we watched both.

We also never read the models' prose. We request exactly one token and read the
probability the model puts on Yes against No. A model that hedges, refuses, or
writes a paragraph cannot corrupt the measurement, because we are reading the
distribution rather than parsing an answer. That detail turns out to matter more
than we expected, and we come back to it.

We wrote our predictions down before running, and got two of the three wrong.

## What we found

English first, since it is the control and it behaved:

| model | English |
|---|---|
| Gemma 2 9B | 0.985 |
| Llama 3.1 8B | 0.950 |
| Qwen2.5 7B | 0.978 |

All three can do the task. Whatever happens on Somali is therefore about Somali.

Then Somali pulled them apart:

| model | Somali | real Somali rejected | scrambled Somali accepted |
|---|---|---|---|
| Gemma 2 9B | **0.935** | 5% | 8% |
| Llama 3.1 8B | **0.825** | **31%** | 4% |
| Qwen2.5 7B | **0.542** | 1% | **90%** |

![Horizontal bar chart of balanced accuracy on the Somali test. Gemma 2 9B reaches 0.935, Llama 3.1 8B 0.825, Qwen2.5 7B 0.542, against a chance line at 0.50. A dashed mark on each row shows the same model's English score, all of them close to 1.00.](/images/fig-hubi-spread.png)

Read the last two columns together, because the combination is the finding. These
are not three degrees of one failure. They are three different failures, and two
of them point in opposite directions.

Gemma reads Somali. 0.935, five points off its own English, on a language with
almost no open text behind it. We did not predict this and we were wrong to be so
confident. It is the most useful single fact we learned, and it is good news: the
capability exists today, free, in a model that runs on a laptop.

Qwen says yes to anything written in Somali. It accepted 90% of the word salad and
99% of the real sentences. Its answer is not a judgement, it is a reflex.

Llama fails in the opposite direction, and that is the one that costs us
something. It waved through only 4% of the scrambled text, better than Gemma did.
By the usual framing it is the most careful of the three. It also rejected 63 real
sentences, written by Somali speakers and approved by two independent Somali
validators, as not natural Somali. Nearly a third of our corpus, discarded by the
model that looks most cautious.

![Horizontal bar chart splitting each model's Somali errors into two channels. Gemma rejects 5% of real sentences and accepts 8% of scrambled ones. Llama rejects 31% of real sentences but accepts only 4% of scrambled ones. Qwen rejects 1% of real sentences and accepts 90% of scrambled ones.](/images/fig-hubi-errors.png)

## Qwen is not blind. Its answer is.

Ninety percent looks like a model that cannot see Somali at all. It is not, and
the difference is the most practically useful thing in this writeup.

Score the same model a second way, ignoring its yes-or-no entirely. Hand it a real
sentence and a scrambled one, and ask only which of the two gets more probability
on Yes. Qwen ranks the real sentence higher **88% of the time.**

The information is in there. So we asked what would happen if we moved the line.
For each model we found the cut point that would have maximised its accuracy:

| model | as answered | at its best threshold | recovered |
|---|---|---|---|
| Gemma 2 9B | 0.935 | 0.940 | +0.005 |
| Llama 3.1 8B | 0.825 | 0.840 | +0.015 |
| Qwen2.5 7B | 0.542 | **0.800** | **+0.258** |

![Horizontal bar chart of Somali accuracy as answered versus at the best decision threshold. Gemma moves from 0.935 to 0.940 and Llama from 0.825 to 0.840, both barely visible. Qwen moves from 0.542 to 0.800, a recovered segment of plus 0.258 shown in teal.](/images/fig-hubi-threshold.png)

Gemma and Llama are already where they should be. Their answers extract
essentially everything their probabilities know, which means their scores are real
ceilings rather than artifacts of where a threshold happens to sit. That matters:
it means Llama's 31% rejection rate is not a tuning problem, it is what the model
believes.

Qwen is a different animal entirely. Twenty-six points of accuracy were sitting
inside the model and were destroyed at the moment it committed to a word. Its
decision threshold, wherever it was tuned, sits in the wrong place for Somali, and
every answer it gives inherits that error.

For anyone building on these models the consequence is concrete. A Somali pipeline
that reads Qwen's answers is a validator that approves gibberish. A pipeline that
reads Qwen's probabilities and picks its own threshold on a few hundred labelled
examples is something usable. Same weights, same prompt, twenty-six points apart,
and no leaderboard distinguishes them, because leaderboards report the answer.

## What Llama throws away

Llama's rejections are not spread evenly. Broken down against the provenance we
ship with every sentence:

| | rejected |
|---|---|
| conversational register | 61.5% (8 of 13) |
| corpus bulk | 28.9% |
| sentences of 6 to 10 words | 43% |
| sentences of 16 to 20 words | 18% |

The buckets are small and we will not build a theory on thirteen sentences. But
the direction is consistent and it is the direction that matters for a project
like ours. The model is least willing to accept everyday spoken-style Somali, and
least willing to accept short utterances.

That is precisely what a community corpus is made of. It is also precisely what is
absent from whatever Somali this model saw in training, which will have been
mostly formal, mostly written, and mostly translated. The failure concentrates on
the part of the language that most needs recording.

## Why an average would have hidden all of this

Every finding above required splitting the results into two error channels and
looking at them separately. Collapse them into one accuracy number and the article
disappears.

Consider how each of these models would look on an ordinary evaluation. Somali
eval sets are small and usually built from real text, because real text is what
exists. On a set that is mostly real sentences, Qwen, the model that approves word
salad nine times in ten, scores near the top, because it says yes to everything
and almost everything is a yes. Build the set the other way, weighted toward
negatives, and Llama looks excellent while quietly discarding a third of genuine
contributions.

Both would ship. Both would carry a number that survives review.

This is now the third time we have hit the same shape. Our overseer experiment
gave a judge a passage it could not read, and it collapsed to saying no to almost
everything while posting a perfect 1.000 on the half of the data where no was
correct. Our guard experiment found safety filters catching 100% of harmful
English and 16% of the same content in Somali, while handling harmless Somali
almost perfectly and scoring about 95% on realistic traffic.

A judge that refuses. A guard that permits. A validator that approves word salad,
and another that rejects real work. Four surfaces, one fault underneath: a system
that has stopped discriminating still emits confident answers, and an aggregate
absorbs it quietly. In a low-resource language this is not an occasional reporting
problem, it is the default outcome, because the eval sets are small, the label
balance is skewed, and almost nobody has the labelled data to notice.

## One observation about tokenizers, offered carefully

We measured token cost separately, as its own exercise. Setting it beside the
Somali scores produces an ordering that is hard to look away from:

| model | tokens per Somali word | Somali accuracy |
|---|---|---|
| Gemma 2 9B | 2.25 | 0.935 |
| Llama 3.1 8B | 2.52 | 0.825 |
| Qwen2.5 7B | 2.56 | 0.542 |

The cheapest Somali tokenizer belongs to the best Somali reader, and the ordering
matches exactly across all three.

Three points cannot establish a trend and we are not claiming one. Tokenizer
efficiency and the amount of Somali in the training data almost certainly travel
together, so this may be a shadow of the corpus rather than a fact about
tokenization. We report it because it is a cheap hypothesis somebody with more
models than us can test: if fragmentation does real work, then tokens per word is
a free proxy for whether a model can read your language, computable in seconds
without running the model once. For a community choosing which open model to build
on, that would be worth having.

## Why a safety lab is testing grammar

This is a grammaticality experiment, which is not obviously our business.

It is our business for the same reason the guard experiment was. The systems that
decide what is acceptable, in any language, are increasingly models. Filters,
validators, judges, reward models, data-quality classifiers deciding which
sentences are good enough to train on. Every one of them is the same architecture
as the thing we tested here: text goes in, a verdict comes out, and a number
somewhere reports how often the verdict was right.

We now have four experiments saying that number is not measuring what its readers
think, whenever the language is one the model barely saw. The failures are not
noise. They are systematic, they are invisible to aggregate metrics, and they run
in whichever direction the particular model happens to lean.

Somali is where we can see it clearly, because we have a corpus with known-correct
labels produced by people rather than machines. Most languages in this position do
not have that, which is the whole reason we are building one.

## We predicted the wrong thing, and we are saying so

Before running this we registered three predictions.

We predicted every model would score at least 15 points worse on Somali than on
its own English. That failed for two of the three. Gemma lost 5 points. Llama lost
12.5.

We predicted the Somali errors would lean toward acceptance for every model, on
the reasoning that text you cannot read looks plausible whether or not it has been
scrambled. That failed for two of three, and Llama failed it by going the opposite
way entirely.

Only the English control prediction held.

What we were most confident about was that Somali would be uniformly hard. It is
not uniformly anything, and we would have missed that completely had we tested one
model and generalised, which is what we nearly did.

## What is wrong with this study

Three open models in the 7B to 9B class, quantised to 4 bits, one corruption type,
one prompt, written in English, 200 sentences per language. We did not test
frontier API models, so nothing here speaks to what the largest systems do with
Somali.

Word shuffling is the crudest corruption available. Passing this floor does not
make a model able to do Hubi. It means only that the model is not obviously
disqualified, and two of these three are.

The register and length breakdowns rest on small buckets and are directional, not
conclusive. The tokenizer ordering is three data points. The explanation we offer
for Llama's rejections, that it saw formal written Somali and not everyday speech,
is consistent with the pattern but is not something this data proves.

Our threshold analysis finds the best cut point using the same data it is
evaluated on, so the recovered numbers are an upper bound on what recalibration
would achieve, not an out-of-sample estimate. The honest claim is that the
information exists inside the model, not that 0.800 is what you would get in
deployment.

One caveat we did close. A shuffled sentence might in principle still read
acceptably, which would make the test unfair to the models. A native Somali
speaker checked a random sample of twelve shuffled items against their originals.
All twelve were judged clearly broken. No item was dropped and no number in this
article moved.

Three of our 200 Somali sentences contain enough English to muddy them, including
one that quotes an English proverb whole. That is a data-quality note about our own
corpus rather than a finding about models, and we are fixing it upstream.

## Why we are publishing this

The result that would have made the cleanest story is the one we expected: models
cannot read Somali, here is the number, support the corpus. We did not get it. One
model reads Somali well, which is a fact that argues against the simplest version
of our own case for existing.

We think the real result is more useful anyway. If the spread between open models
of the same size is 39 points, then the single most consequential decision a
Somali developer makes is which model to start from, and right now that decision
is being made on English leaderboards. Nobody has published the number that would
inform it, for this language, until now.

The next experiment is whether the threshold repair that recovers 26 points for
Qwen survives corruptions our validators actually see: wrong inflection, dropped
agreement, word order calqued from English. If it does, then a few hundred
community-labelled examples become enough to make a mediocre model usable, and the
corpus stops being only training data and starts being the instrument that
calibrates whatever you already have.

That experiment is possible only because 2,377 sentences were checked by people
who do effortlessly what one of these models cannot do at all, and another gets
wrong a third of the time.

That skill is the asset. It is why the corpus exists, and why it is open.

---

*The eval set, all 2,400 judgements with their probabilities, the
pre-registration with its dated amendments, the native-speaker check, and the
analysis are in the
[qor-hubi-floor repository](https://github.com/Unkadlabs/qor-hubi-floor). The
sentences come from the
[Qor corpus](https://huggingface.co/datasets/unkadlabs/qor-af-soomaali), written
and verified by Somali speakers at [qor.unkad.com](https://qor.unkad.com), and
credited by name where they asked to be. Correspondence to research@unkad.com.*
