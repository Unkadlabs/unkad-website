---
title: "Unkad: creation from nothing"
date: "2026-07-19"
description: "Why we started a lab to measure whether AI systems are safe in Somali, what the name means, and why safety that only works in English is not safety."
topics:
  - The lab
  - Safety
keywords:
  - Somali AI research lab
  - multilingual safety
  - AI alignment low-resource languages
  - AI safety Somali
  - Somali NLP
  - Maay dialect
  - safety evaluation
---

In Somali, <em lang="so">unkad</em> means creation from nothing.<!-- VERIFY SOMALI --> It shares a root with <em lang="so">unug</em>, the cell, the smallest unit of a living thing. The pairing describes how we think large things get built: not by arriving whole, but by assembling small units until something holds together.

That is what we are attempting for Somali, and it is worth being precise about which part of the problem we have taken on.

## The specific gap

There is a general problem, widely acknowledged, that AI systems serve some languages better than others. That framing is true and too broad to act on. Underneath it sits a narrower problem that almost nobody is working on, and that is the one this lab exists for.

**We do not know whether AI systems are safe in most of the world's languages, because nobody has checked.**

When a frontier lab publishes a safety evaluation, it is nearly always an evaluation in English. The model is red-teamed in English, its refusal behaviour is measured in English, its jailbreak resistance is characterised in English. Then it is deployed globally, to people who will not speak to it in English, and the safety claims travel along with the deployment as though language were incidental to them.

It is not incidental. We measured it.

We built [SomaliBench](https://huggingface.co/spaces/unkadlabs/somalibench), which takes a set of harmful requests and puts each one to a model twice: once in English, once in Somali, same request, verified by a native speaker. Then we count how often the model refuses.

Llama 3.1 refuses 97 percent of the time in English. In Somali, 7 percent. Aya goes from 80 percent to 5 percent. Qwen 2.5 from 93 to 24. Gemma 2 holds up best and still loses 38 points.

These are not marginal differences. They describe models whose safety behaviour largely evaporates when the language changes. And Somali is spoken by more than twenty million people, so this is not an edge case in any meaningful sense of the term.

## Why this happens, as far as we can tell

We are cautious about mechanism claims, but the shape of the explanation seems clear enough to state.

Safety behaviour is trained. A model learns to refuse through examples of refusal, mostly assembled in English, sometimes translated into a handful of high-resource languages. Somali is not in that set in any serious quantity. So the behaviour was never taught in Somali; at best it generalised there, and generalisation is exactly the thing that degrades when a language is thin in the training data.

There is a compounding factor underneath. We [measured how tokenizers treat Somali](/articles/the-somali-token-tax) and found that every major one cuts it into roughly twice as many pieces as English for identical content. A model reading Somali is reassembling meaning from more fragments, with less training material, than it had for English. Comprehension built on that foundation is less stable, and safety behaviour rides on comprehension.

We should say plainly that we have not proven fragmentation causes the safety gap. Data scarcity could independently produce both. Separating those explanations is a research question we want to work on rather than a conclusion we are asserting.

## What we are building, and why in this order

**First, the ability to measure.** You cannot fix what nobody has quantified, and you cannot argue with a frontier lab using anecdotes. Benchmarks, safety test sets, and red-teaming methods designed for low-resource languages come first, because measurement is the thing that turns a widely-felt problem into a specific, addressable one.

**Second, the data underneath.** Evaluation sets have to be built out of language, and Somali is thin in exactly the registers evaluation needs: conversation, instruction, everyday speech, technical vocabulary. That is why we built [Qor Af-Soomaali](https://qor.unkad.com), a platform where Somali speakers write, translate, and validate text. It is infrastructure for the evaluation work, not a separate mission.

Two commitments are built into it rather than promised alongside it. Nobody contributes anything before explicitly consenting and choosing how they want to be credited. And every contribution records its dialect, because Somali is not uniform, and a model that behaves safely in Maxaa tiri while failing in Maay has not been evaluated, it has been sampled.

**Third, generalisation.** Somali is a useful hard case: little data, real dialect variation, a vast oral tradition and a young written one. Methods that survive here should transfer to the hundreds of languages in similar positions. We publish our methodology, our code, and our negative results, because the point is not that Somali becomes safe while everything else stays unmeasured.

## What we are not doing

We are not building a Somali chatbot, and we are not training a frontier model. Those are reasonable things for someone to do and they are not our work.

We are also not making the argument that AI is bad for Somali speakers. Millions of people are already using these systems, and they will use them more. Precisely because that is true, someone should be checking whether the systems behave safely when addressed in the language those people actually speak.

## The name, again

Creation from nothing is an accurate description of the current state. There is no Somali safety benchmark of any scale. There is no Somali entry in the flagship African reasoning benchmarks. There is almost no dialect-tagged Somali data anywhere. The corpus counter on our platform starts near zero, publicly, and we left it visible on purpose.

Starting from nothing is not a complaint. It is the reason the work is worth doing, and it is why the unit that matters is the cell: one sentence written down, one contribution validated, one measurement published, until there is something there that was not there before.

If you speak Somali, in any dialect, you can [add to it](https://qor.unkad.com). If you work on multilingual safety or evaluation, we would like to compare notes: research@unkad.com.
