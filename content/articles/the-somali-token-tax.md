---
title: "The Somali token tax"
date: "2026-07-20"
description: "Every major tokenizer cuts Somali into roughly twice as many pieces as English. That fragmentation is where a model's relationship with a language begins, and we think it is connected to why safety behaviour does not survive translation."
image: "/images/somali-token-tax.png"
topics:
  - Safety
  - Evaluation
  - Tokenization
keywords:
  - Somali NLP
  - multilingual safety
  - AI alignment low-resource languages
  - tokenizer fertility
  - token tax
  - LLM tokenization
  - FLORES-200 Somali
  - safety evaluation
  - African NLP
  - Somali tokenizer
---

Before a language model reads a single word, something has already happened to the text. A tokenizer has cut it into pieces. Those pieces, not the words, are what the model actually sees, learns from, and reasons over. Tokenization is the point where a model's relationship with a language begins, and almost nobody looks at it.

We looked at it for Somali. What we found is a large, consistent disadvantage, and we think it is connected to a safety problem we measured separately.

## What we did

The method is deliberately boring, because boring methods are hard to argue with.

FLORES-200 is a translation benchmark containing sentences professionally translated into more than two hundred languages. Its devtest split has 1,012 sentences that exist in both English and Somali, carrying the same meaning, produced by professional translators rather than machines. That gives a clean comparison: identical content, two languages, no confound about what is being said.

We ran both sides through nine tokenizers and counted. No models were loaded, no inference was run. Just counting. The whole thing takes about a minute on a laptop, and the [code and data are public](https://github.com/unkadlabs/somali-token-tax) so anyone can check us.

The ratio of Somali tokens to English tokens, over identical content, is what we are calling the token tax.

![Bar chart of the Somali to English token ratio across nine tokenizers. Every major LLM tokenizer sits between 1.72 and 2.23. mT5 reaches 1.49. A Somali-first tokenizer reaches 0.68.](/images/somali-token-tax.png)

## What we found

Every major tokenizer charges Somali between 1.7 and 2.2 times more tokens than English for the same content. DeepSeek V3 sits at 2.23. GPT-4's cl100k at 2.21. Llama 3.1, Qwen 2.5, and Mistral cluster tightly at 2.19. Gemma 2 does better at 1.94. GPT-4o's o200k, with its much larger vocabulary, is the best of the majors at 1.72, and still charges Somali seventy-two percent extra.

The tight clustering is the interesting part. These tokenizers were built by different organisations, on different corpora, with different algorithms and vocabulary sizes. They arrive at nearly the same penalty for Somali. That consistency suggests the cause is not a quirk of any one training pipeline. It is what happens to a language that is thin on the web when vocabulary is allocated by frequency.

Two results break the pattern, and both are informative.

mT5, whose tokenizer was built with deliberately balanced multilingual sampling rather than raw web proportions, reaches 1.49. Effort in the right direction moves the number.

More striking: a tokenizer we trained on Somali text alone, only sixteen thousand vocabulary items, represents Somali content at 0.68 times what the large tokenizers need for the English. Its English performance is poor, as you would expect from a monolingual tokenizer. That asymmetry is the point. Every tokenizer is efficient for what it was built around. Somali simply was not what the major tokenizers were built around, and the penalty we measure is the size of that omission.

## Why a safety lab is writing about tokenization

We could have written this as a cost story. Fragmentation makes Somali more expensive per unit of meaning and consumes context windows faster. That is true, and it is not our subject.

Our subject is that **fragmentation is a representation problem, and representation quality is a safety property.**

Consider what over-fragmentation does. A word that English encodes as one token might be split into four or five pieces in Somali, and often those pieces do not correspond to any meaningful unit of the language. They are not morphemes. They are not syllables in any principled sense. They are the residue of a compression algorithm that was optimised elsewhere.

The model must then learn to reassemble meaning from fragments that carry no linguistic structure, using far fewer examples than it had for English, because Somali is thin in the training data to begin with. It is being asked to do a harder job with less material.

There is a reasonable expectation that this produces weaker, less stable internal representations of the language. And here is what matters for us: safety behaviour is not a separate module bolted onto a model. Refusal, harm recognition, and instruction-following are learned behaviours that ride on the model's understanding of what is being asked. If comprehension is shakier in a language, there is every reason to expect the behaviours built on top of comprehension to be shakier too.

We have measured that those behaviours are in fact shakier. In [SomaliBench](https://huggingface.co/spaces/unkadlabs/somalibench), we put identical harmful requests to open-weight models in English and in Somali. Llama 3.1 refuses 97 percent of the time in English and 7 percent of the time in Somali. Aya drops from 80 percent to 5 percent. Qwen from 93 to 24. The safety behaviour does not survive the translation.

So we have two measurements of the same language, taken independently: it is fragmented roughly twice as hard, and its safety behaviour collapses.

## Being careful about what we are claiming

We are not claiming that fragmentation causes the refusal gap. We have not shown that, and we want to be precise about the difference between a correlation we can measure and a mechanism we can prove.

Both phenomena plausibly share a cause. A language that is scarce in training data will be poorly served by a frequency-based tokenizer *and* poorly represented in the model *and* underrepresented in the safety tuning data that shapes refusal behaviour. Data scarcity could be the common root, with fragmentation and safety failure as parallel symptoms rather than cause and effect.

Distinguishing those possibilities is a real research question, and it is one we intend to work on. If fragmentation contributes independently to safety failure, then tokenizer design becomes a safety intervention, which would be a genuinely useful thing to know. If it does not, and data scarcity explains everything, then the path forward is exactly the corpus work we are already doing.

We also want to flag a limitation in our own safety measurement that cuts against an easy reading. A low refusal rate does not automatically mean fluent, harmful compliance. In our evaluation, some Somali responses that failed to refuse were also incoherent or off-target. A model that produces confused output instead of refusing has still failed, but it has failed differently, and conflating the two would overstate the danger. Separating genuine harmful compliance from low-quality generation is part of what the next version of the benchmark needs to do properly.

## What follows from this

For anyone building or evaluating multilingual models, three things seem worth taking seriously.

**Measure fertility per language before you claim multilingual support.** It costs almost nothing. A model that fragments a language at twice the rate is doing something different with that language than with English, and that difference is worth knowing before you ship.

**Treat evaluation in the fragmented languages as mandatory rather than optional.** The languages with the worst token ratios are precisely the ones where we found safety behaviour failing. If a lab evaluates safety in English and infers that the model is safe, that inference does not hold for the languages that were fragmented hardest.

**Recognise that the fix is upstream.** Tokenizers learn from what exists. Somali barely exists in usable, openly licensed digital form, and neither do the evaluation sets that would catch these failures. That is why we built [Qor Af-Soomaali](https://qor.unkad.com), where Somali speakers write, translate, and validate the text their language is missing. Better data produces better tokenizers, better representations, and, we expect, safety behaviour that holds up when the language changes.

## Method

FLORES-200 devtest, 1,012 parallel English and Somali sentences. Token counts over the full set, special tokens excluded. Tokenizers accessed through their public repositories; gated models loaded via public mirrors. Word-level fertility uses whitespace-delimited words, a crude measure applied identically to both languages, and the headline ratio does not depend on it at all.

Everything reproduces in about a minute at [github.com/unkadlabs/somali-token-tax](https://github.com/unkadlabs/somali-token-tax). If you work on tokenizers or multilingual safety and want to compare notes, we are at research@unkad.com.
