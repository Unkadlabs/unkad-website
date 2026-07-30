---
title: "Every sentence has a name"
date: "2026-07-30"
description: "We released the first version of an open Somali corpus. It is small, and that is not the interesting part. Every sentence in it has a named author who agreed to release it before writing it, which is a thing no scraped corpus of any language can say."
hook: "150"
hookLabel: "Sentences we deleted, because we could not say who wrote them"
topics:
  - Datasets
  - Low-resource languages
  - Provenance
keywords:
  - Somali corpus
  - Somali dataset
  - low-resource languages
  - open dataset
  - data provenance
  - consent-based data collection
  - sentence segmentation
  - Somali NLP
  - CC BY-SA
  - multilingual AI safety
---

Today we released [Qor Af-Soomaali v0.1.2](https://huggingface.co/datasets/unkadlabs/qor-af-soomaali),
an open corpus of 1,547 Somali sentences. Fifty-nine people wrote it, on their
phones, over eleven days in Mogadishu.

That is a small number, and the size is not the point. There is more Somali text
than that inside CC100, inside OSCAR, inside the multilingual crawls every large
model is trained on. If you want volume, it already exists.

Here is what does not exist. Take one sentence out of any of those corpora and
try to answer seven questions about it: who wrote it, did they agree to its
release, under what licence, when, in which dialect, was it machine translated,
and did anyone check it. For a scraped corpus the honest answer to nearly all of
them is that nobody knows and nobody can find out.

![A table comparing what is knowable about one sentence from a scraped corpus versus one from this corpus. The scraped column reads unknown, unknown, unclear, unknown, unlabelled, often undetectably machine translated, nobody. The written column names the author, the consent, the licence, the date, the dialect, and who validated it.](/images/fig-provenance.png)

We can answer all seven for every sentence we published. That is the entire
claim, and it is worth more than volume for reasons that are specific to
low-resource languages.

## Why this matters more for Somali than for English

Two problems compound in scraped low-resource text.

The first is machine translation. A large share of the low-resource web is
already machine output, and it is not labelled as such. When a model trains on
Somali scraped from the web, some meaningful fraction of what it learns is what
an earlier model guessed Somali might be. The errors are not random noise that
averages out; they are systematic, and training on them teaches a model to
reproduce them confidently. For English this contamination exists but is diluted
by an ocean of human text. For Somali there is no ocean.

The second is consent. English speakers have not consented to their text being
scraped either, but they have institutions, jurisdictions and lawyers engaging
with that question. Somali speakers have had their language taken without being
asked and without anyone to ask. When the resulting model is deployed back into
Somali-speaking communities, the people whose language built it were never part
of the transaction.

Neither problem is solved by a corpus of 1,547 sentences. What a small corpus can
do is demonstrate that the alternative is buildable: that you can ask people to
write, tell them exactly what it is for, get their agreement in advance, and let
them choose how to be credited. Fifty-nine people chose. Four of them chose to
stay anonymous, and that choice is honoured in the release, counted but unnamed.

## What it cost

Provenance is only a claim until it costs you something.

Nine days in, one contributor had written more than any other. His submissions
arrived faster than anyone types, so we flagged the account, and when the founder
called him it turned out he was a working writer pasting his own articles. He
confirmed the text was his and gave permission directly. That judgement was
recorded against his account with a name and a date, and his work stayed.

A different contributor's submissions also arrived in bursts. On the phone he
confirmed those were messages copied from a Telegram channel by a group of
people. That text belonged to whoever wrote it in that channel, we had no licence
for any of it, and about 150 sentences were deleted. Twice, because he came back
twelve hours later and posted more.

The deletion moved our public milestone backwards by more than a week. We had
been within touching distance of two thousand sentences, and announced instead
that the corpus had shrunk. There is no version of this where we could have kept
that text and still written the paragraph above about knowing where every
sentence came from.

We are describing it here because a licence statement with nothing behind it is
boilerplate, and every open dataset has one.

## Counting is not simple either

We hit a problem we did not expect: nobody agrees on how many sentences Somali
text contains, because nothing exists that can count them.

Sentence segmentation is a solved problem in the sense that good tools exist.
**Punkt**, **PySBD**, **spaCy**, **Stanza**, and the **Moses/SRX** rules used in
machine-translation pipelines all do it well. Every one of them requires a
per-language model or rule set, and none of them supports Somali. There is no
Somali model in spaCy or Stanza, no Somali rule set in PySBD, and no Somali
Universal Dependencies treebank to train one on.

So every sentence count we published rested on a regex somebody wrote in an
afternoon. Ours split on terminal punctuation and on line breaks, and the line
break rule was wrong.

![Two versions of the same Somali sentence. In the first, a line break splits it in half and both halves are counted as sentences. In the second, the break is correctly treated as a soft wrap and the sentence stays whole.](/images/fig-segmentation.png)

Contributors write on phones and press Enter to wrap long lines. Every one of
those wraps was being counted as a sentence boundary, cutting real sentences in
half and counting each half. When we fixed it, the corpus lost 6% of its
reported size overnight: 1,840 sentences were really 1,722. That inflation had
been in every number we had published, including a poster.

The corrected segmenter protects decimals, ellipses and initials, and treats a
line break as a boundary only when the surrounding text supports it. Two
distinctions in it are specific to Somali and worth stating, because we got both
wrong first. Title abbreviations never end a sentence, since a name follows:
`Sh. Maxamed` is one noun phrase. Terminal abbreviations frequently do end one:
in `hilib, iwm. Kadib waan seexday`, the `iwm.` is Somali's *etc.* and the period
closes the sentence. Protecting it unconditionally welded two sentences into one.

Somali turns out to be easier than English here. Across every document in the
corpus, exactly one token was followed by a period and then a lowercase letter,
where English prose would produce hundreds of `Dr.` and `etc.`

An unmeasured segmenter is still just an opinion, so we published the segmenter
and a way to score it. `tools/` in the
[GitHub repository](https://github.com/Unkadlabs/qor-af-soomaali) contains the
segmenter, an evaluation harness that reports boundary precision, recall and F1
as the segmentation literature does, and forty passages sampled deterministically
across all nine domains, ready for a human to annotate. Deterministic sampling
means two annotators can be handed the identical file and their agreement
measured.

We are not aware of an existing Somali sentence-boundary evaluation set. If one
exists we would rather use it than duplicate it, and the repository has an issues
tab.

## What is actually in it

![A bar chart of sentences by domain, drawn to scale. General holds 1,091 sentences; religion 183; technology 87; culture 69; education 52; agriculture 47; media 17; health 15; law 9.](/images/fig-coverage.png)

Nine domains are represented. We could have written that sentence and stopped,
and it would have been true. Drawn to scale, `general` holds seven of every ten
sentences and `law` holds nine sentences in total.

The imbalance has a mechanical cause: a single long essay contributes dozens of
sentences to one domain, and our early contributors wrote essays. It is the
current priority of collection, and the reason the platform now serves
domain-targeted prompts rather than letting everyone write freely into the same
category.

Some of what is in there cannot be obtained by translating English, because it
never existed in English: how frankincense is tapped by cutting the bark and
returning weeks later for the resin, how a nomadic house is folded onto a camel
at dawn and raised again by evening, which cup of camel milk goes to the guest
when the vessel is small.

## What is wrong with it

- **It is small.** An early release from an ongoing collection.
- **Contribution is concentrated.** A minority of contributors wrote a majority
  of the text, as in every volunteer language effort we know of.
- **Maay is absent.** Every item so far is Maxaa-tiri or unspecified. Somali is
  not one dialect, and a corpus of one dialect should not be read as the
  language. This is the gap we would most like readers to help close.
- **Verification granularity varies.** Longer passages were signed off as
  passages rather than sentence by sentence. Sentence-level review with multiple
  independent votes is the next thing we build.
- **English pairs are held back.** Translated items are reserved for a separate
  held-out evaluation set. Publishing them here would let them be trained on and
  destroy their value as a benchmark, which is the more useful artifact.

## Why a safety lab is building a corpus

Unkad Labs works on one question: safety and alignment evaluations are built,
measured and reported in English, and nobody knows what survives translation. A
model that refuses a harmful request in English and complies with it in Somali
has not been made safe. It has been made safe in one language, and the safety
card says nothing about the other one.

You cannot test that claim without text, and you cannot test it with scraped text
either, because a model that behaves differently on natural Somali than on
translated Somali would be invisible to an evaluation built from translated
prompts. The evaluation set has to be written by Somali speakers, in Somali, on
purpose.

This corpus is the first thing that made that possible. The held-out evaluation
set is what it is for.

## Get it, or add to it

The data is on [Hugging Face](https://huggingface.co/datasets/unkadlabs/qor-af-soomaali),
under CC BY-SA 4.0. The segmenter and its evaluation harness are on
[GitHub](https://github.com/Unkadlabs/qor-af-soomaali), under Apache 2.0.

If you write Somali, [qor.unkad.com](https://qor.unkad.com) is open. Every
sentence is validated by two other contributors before it is accepted, and
reviewed again before it is published. If you speak Maay, you are the person we
need most.

And if you take one thing from this: do not submit text you did not write, or
text whose licence is not yours to give. That rule is not bureaucracy. It is the
only reason any of the rest of this is worth anything.
