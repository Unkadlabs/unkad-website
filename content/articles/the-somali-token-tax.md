---
title: "The Somali token tax"
date: "2026-07-20"
description: "Somali speakers pay 1.7–2.2× more tokens than English speakers for identical content, across every major LLM tokenizer. We measured it — and the tax turns out to be a design choice."
---

Before a language model reads a single word, a tokenizer decides how to slice the text into pieces. Those pieces — tokens — are the unit of everything: what API users pay for, how fast responses stream, how much fits in a context window. If a tokenizer slices your language inefficiently, you pay more, wait longer, and fit less, on every request, forever.

We measured what that means for Somali.

## The measurement

The method is simple and fair. FLORES-200, the standard translation benchmark, contains 1,012 sentences professionally translated into both English and Somali — identical meaning, two languages. We ran both sides through nine tokenizers and counted. The ratio between the Somali count and the English count is the tax.

![Bar chart: Somali/English token ratio across nine tokenizers. Every major LLM tokenizer charges Somali 1.7–2.2×; mT5 1.49×; the Somali-first SomaliWeb tokenizer 0.68×.](/images/somali-token-tax.png)

Every major LLM tokenizer charges Somali between 1.7× and 2.2× more tokens for the same content. DeepSeek V3 sits at 2.23×, GPT-4 at 2.21×, Llama 3.1, Qwen 2.5, and Mistral at 2.19×. The best of them, GPT-4o's tokenizer with its larger vocabulary, still charges 72% extra.

## What the tax buys

At 2.2×, a Somali speaker using a per-token API pays roughly double for the same conversation. Their responses stream more slowly. Their effective context window — the amount of conversation, instructions, or documents the model can hold — is roughly half. And over-fragmentation is not just an economic problem: heavily fragmented text is harder for models to learn from and reason over, so the tax on cost travels with a tax on quality.

The people paying the highest per-token rates are, systematically, the speakers of the languages the tokenizers were not built for.

## The tax is a choice

Two results in the data show this is not an intrinsic property of Somali.

First, mT5 — a tokenizer built with deliberately balanced multilingual sampling — brings the tax down to 1.49×. Design effort helps.

Second, and more telling: a small Somali-first tokenizer (16k vocabulary, trained on the [SomaliWeb corpus](https://huggingface.co/datasets/khaledyusuf44/somaliweb-v1)) represents the same Somali content in *fewer* tokens than the major tokenizers need for the English side — 0.68×. Its English performance is poor, as expected. That is precisely the point: every tokenizer is efficient at what it was built for. Somali was simply not what the major tokenizers were built for.

## What we're doing about it

Measurement like this is the first half of our agenda: making Somali's position in AI systems visible and quantified. The second half is fixing the data foundation it rests on — which is what [Qor Af-Soomaali](https://qor.unkad.com), our community corpus platform, exists to do.

Everything here is reproducible in about a minute on a laptop: [github.com/unkadlabs/somali-token-tax](https://github.com/unkadlabs/somali-token-tax). If you work on tokenizers or multilingual models and want to talk, we're at research@unkad.com.
