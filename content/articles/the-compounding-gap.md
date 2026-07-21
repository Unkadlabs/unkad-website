---
title: "The compounding gap"
date: "2026-07-21"
description: "A Somali speaker pays 2.2× more tokens for the same AI conversation and earns 78× less. Combine the two and one exchange costs 12% of a day's income, against 0.07% in an OECD country."
image: "/images/compounding-gap.png"
topics:
  - Evaluation
  - Access
  - Somali NLP
keywords:
  - Somali NLP
  - AI access inequality
  - token tax
  - digital divide Somalia
  - low-resource languages
  - AI affordability
  - World Bank Somalia data
  - African NLP
  - AI fairness
  - language technology equity
---

We have written before about the [token tax](/articles/the-somali-token-tax): every major AI tokenizer charges Somali between 1.7 and 2.2 times more tokens than English for identical content. That is a measurement about language technology.

This is what happens when you put it next to a measurement about people.

## Two numbers that belong together

The World Bank puts Somalia's GDP per capita at **$661 a year** for 2025. That is about **$1.81 a day**. The OECD average is **$51,734 a year**, roughly $142 a day. An income gap of about **78 times**.

Now add the tokenizer. A Somali speaker does not pay the same price as an English speaker for the same AI conversation. They pay roughly 2.2 times more, because their language is cut into more pieces.

The two disadvantages multiply. They do not take turns.

![Bar chart comparing the cost of one identical AI conversation as a share of one day's average income: Somalia 12.20%, world average 0.25%, OECD members 0.07%.](/images/compounding-gap.png)

Take an AI exchange that costs an English speaker ten cents. For someone on the OECD average income, that is **0.07% of a day's earnings** — imperceptible. For a Somali speaker, the same exchange costs about 22 cents after the token tax, and that is **12.2% of a day's income**.

The same conversation. **One hundred and seventy-three times the relative cost.**

## Who this is about

The numbers underneath are not small or hypothetical.

Somalia's population is now about **19.7 million** people. Roughly **28% are online** — around **5.5 million people** already using the internet, with mobile subscriptions at 54 per 100 people and climbing. Adult literacy is around **54%**.

And **46.5% of the country is under fifteen**. About **9.1 million children** who will spend their entire adult lives in a world where AI systems mediate access to information, education, health guidance, and public services. They will meet those systems in Somali.

## Why this is a language problem, not a pricing problem

It would be easy to read this as an affordability story with a familiar shape: poor country, expensive technology. It is not that, or not only that.

The income gap is a development problem that decades of work are addressing. The token tax is different: it is a **design outcome**, and we can show that directly. In our measurements, a small Somali-first tokenizer represents the same Somali content at **0.68 times** the cost the major tokenizers need for English. The 2.2× penalty is not a property of the Somali language. It is a property of tokenizers built without Somali in view.

That part is fixable. It is fixable with data, and the data does not exist yet — which is precisely the work we are doing.

## What this means for anyone building AI for Africa

If you are pricing an AI product per token, you are charging your poorest users the most for the same service. Not by intent, but by architecture.

Three things follow.

**Measure your fertility per language before you price.** The disparity is invisible unless you look for it, and it is trivial to measure — our [method and code](https://github.com/unkadlabs/somali-token-tax) run on a laptop in about a minute.

**Language-specific tokenizers are an equity intervention**, not only an efficiency one. A 2.2× to 0.68× swing is a bigger cost reduction than most infrastructure optimisation will ever deliver.

**The data gap is the root cause.** Tokenizers are trained on what exists. Somali barely exists in usable, openly licensed form, and that is a solvable problem — which is why we built [Qor Af-Soomaali](https://qor.unkad.com), an open platform where Somali speakers write, translate, and validate the text their language is missing.

## Method and honesty

Development figures are World Bank open data, retrieved from their API in July 2026: GDP per capita 2025 (current US$), population 2025, internet use 2024, mobile subscriptions 2023, adult literacy 2022. Tokenizer fertility is our own measurement on FLORES-200 devtest, 1,012 professionally translated parallel sentences, reproducible from our public repository.

Three caveats we want stated rather than buried. GDP per capita is a crude proxy for what an individual can actually spend, and Somalia's remittance economy makes it cruder than usual. The ten-cent baseline is illustrative; the ratio, not the absolute figure, is the finding. And most people do not pay for AI per token today, they use free consumer tiers — but the token cost is real underneath, and it shapes what companies choose to build, in which languages, and for whom.

The direction of the finding does not depend on any of those choices. Two multipliers, pointing the same way, at the same people.
