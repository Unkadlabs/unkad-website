---
title: "The overseer that cannot read"
date: "2026-07-22"
description: "We gave a model a passage it could not read and asked it to judge claims about that passage. It did not become uncertain. It started saying no to almost everything, and in doing so it scored a perfect 1.000 on half the data."
hook: "62% → 6%"
hookLabel: "How often the judge said yes, when it could read the source and when it could not"
topics:
  - Safety
  - Scalable oversight
  - Evaluation
keywords:
  - scalable oversight
  - AI debate
  - multilingual safety
  - LLM judge
  - AI alignment
  - low-resource languages
  - safety classifier evaluation
  - debate protocol
  - weak judge strong model
  - pre-registration
---

There is a number in our results that we keep coming back to.

We gave a language model a passage it could not read, in a cipher it provably
cannot decode, and asked it to answer yes or no questions about that passage. The
correct answer was yes about 62 percent of the time.

It answered yes 6 percent of the time.

Not randomly. Not with hedging or refusals or expressions of uncertainty. It read
a block of text it could not parse, and it started saying no to nearly everything
put in front of it. Two different models, run separately, landed at 6.3 percent
and 6.0 percent. The behaviour is not a quirk. It is a regularity.

And here is the part that has occupied us since: on the questions where the true
answer was no, that model scored **1.000**. Perfect. Every single one correct.

A number like that, sitting in a results table, looks like competence.

## Two ways to be a weak judge

The field of scalable oversight studies a specific problem. Suppose you want to
supervise a system more capable than your supervisor. You cannot simply check its
work, because checking is the thing you lack the capacity to do. What structures
let a weaker judge reliably evaluate a stronger participant?

The standard answers are three protocols. In **direct judging**, the judge decides
alone. In **consultancy**, one model advocates for an assigned position and the
judge decides. In **debate**, two models argue opposite sides and the judge decides
between them. The comparison between these, and the finding that debate tends to
outperform the others, is well established, most carefully by Kenton and colleagues
in their 2024 paper on weak judges evaluating strong models.

That literature makes judges weak in two ways. It gives them a smaller model, or
it withholds information from them, usually the source document itself. Both are
real forms of weakness. But notice what they share. In both cases the judge remains
inside the same representational world as the debaters. A weak English-speaking
judge, reading an English debate about an English passage, can still parse claims,
follow an argument, and check whether a quoted sentence actually says what someone
claims it says. It knows less. It can still verify.

Call that weakness of **capability**.

We became interested in a different weakness. Not a judge that knows less, but a
judge that **cannot read the thing it is judging**.

Call that weakness of **access**.

This distinction is not academic for us. An automated overseer applied to material
it cannot process is not a thought experiment, it is the ordinary condition of
safety tooling across most of the world's languages. The classifier does not
announce that it is out of its depth. It runs, it returns a score, and that score
goes into a pipeline where something downstream treats it as information.

## Making access a dial instead of an assumption

So we built the standard protocols with the judge's access as an explicit
parameter, and added a level that does not exist in the literature.

**FULL.** The judge reads the passage, as in ordinary debate.

**NONE.** The judge sees no passage. This is the classic information-asymmetry
condition, and it is what the existing literature means by a judge that lacks
information.

**OBSCURED.** The judge is shown the passage, transformed so it cannot read it, and
is told that the debaters can read it and that it may not be able to verify their
quotations.

The third one is the point, and it is deliberately not the same as the second. A
judge under NONE knows nothing about the source. A judge under OBSCURED can see
that a source exists. It can see its length, its word boundaries, its punctuation,
the shape of it on the page. It can see debaters quoting from it. It simply cannot
check a single one of those quotations. That is much closer to looking at a
language you do not speak than deleting the text would be.

We used ROT13, a simple letter substitution, because it preserves everything about
the shape of a passage while destroying legibility. Before running anything, we
verified the blinding: every judge model was probed with direct decode requests,
naive reads, and requests to quote from the ciphered text, scored by word overlap
against the true plaintext. All four models scored 0.00. They cannot read it, and
we checked rather than assumed.

One design decision carries the whole experiment. **The debaters always read the
plaintext, at every access level.** Their competence never varies. So any
difference we see between access levels is a property of the judge's situation
alone, not of how good the arguments were.

## What blinding should do to debate

Debate rests on a specific argument, and it is worth stating plainly because our
experiment attacks it directly.

The argument is that **verification is easier than generation**. A dishonest
debater must construct a case that survives an opponent who can point at the
source and show where the case departs from it. Because checking a quotation is
easier than fabricating an undetectable one, honesty becomes the winning strategy,
and the judge can lean on that asymmetry without being able to do the whole task
itself.

Read that argument again with our OBSCURED condition in mind. It assumes the judge
can verify. Under OBSCURED, verification is not merely difficult. It is impossible
by construction. There is no move the judge can make to check whether a quoted
sentence appears in the passage.

We expected debate's advantage to shrink or vanish. That was the honest prediction
from the theory.

## What actually happened

We pre-registered five hypotheses, an analysis plan, a sample size, and a stopping
rule before running anything, and committed that document to the repository first.
Then we ran the full matrix: three protocols, three access levels, two judges, 300
samples per cell. 5,400 judgements, all of it on quantised models on a single
machine in Mogadishu, overnight, with no rented compute.

Debate's advantage did not vanish. It barely moved.

| judge | debate's lift with no source | debate's lift with an unreadable source |
|---|---|---|
| qwen2.5:7b | +0.207 | +0.187 |
| qwen2.5:3b | +0.243 | +0.180 |

Statistically indistinguishable, on both judges independently, and it holds when
we recompute everything in balanced accuracy rather than raw accuracy.

**Debate helps a judge that cannot check a single quotation, by roughly the amount
it helps a judge with no source at all.**

We want to be careful about what this does and does not say. It does not say debate
is safe under blinding. It says that whatever produces debate's advantage in this
setting, it is not quote verification, because quote verification was unavailable.
Something else is doing the work, and we do not yet know what it is. Our leading
suspicion is that two debaters who have both read the source constrain each other
in ways a judge can observe without reading anything: where they agree, both saw
it; where they diverge, something is contested. That is a testable idea and we have
not tested it.

The control conditions behaved, which is what makes us trust the rest. Under NONE,
debate beat direct judging by large margins on both judges, replicating the
established result. Under FULL, where the judge can read the passage perfectly
well, debate's advantage disappeared entirely. Large effect where the literature
says there should be one, no effect where there should not be.

## The hypothesis we got wrong

We predicted that an unreadable source would be **worse** than no source. The
intuition was that illegible material does not just fail to inform, it actively
misleads.

Direct judging did fall in the predicted direction on both judges, by 9.0 and 6.7
points. Neither survived correction for multiple comparisons.

**We report that hypothesis as failed.**

There is a detail here we think is worth telling in public, because it is the kind
of thing that usually happens quietly. When we computed balanced accuracy, a metric
that corrects for the fact that our dataset is 62 percent yes, the same hypothesis
passed comfortably on our primary judge. It would have been the easiest thing in
the world to present balanced accuracy as the headline metric and report a
confirmed hypothesis.

Our pre-registration named raw accuracy as the primary metric. So the hypothesis
failed. Choosing your metric after seeing which one gives the answer you wanted is
precisely the practice that pre-registration exists to make impossible, and a
pre-registration you abandon the moment it becomes inconvenient is not a
methodology, it is a decoration.

We are a new lab with no track record. The only thing we can offer early on is
being visibly the kind of people who report the failure.

## What we did not predict

The finding we consider most important was not in our hypotheses at all. We found
it afterwards, poking at the response distributions, which means it is exploratory
and gets held to a lower standard until someone pre-registers it properly.

Here is the judge's rate of answering yes, as its access degrades, against a true
rate of 61.7 percent:

| judge | protocol | full access | no source | unreadable source |
|---|---|---|---|---|
| qwen2.5:7b | direct | 0.490 | 0.193 | **0.063** |
| qwen2.5:7b | consultancy | 0.440 | 0.397 | 0.130 |
| qwen2.5:7b | debate | 0.510 | 0.480 | 0.290 |
| qwen2.5:3b | direct | 0.480 | 0.180 | **0.060** |
| qwen2.5:3b | consultancy | 0.430 | 0.367 | 0.177 |
| qwen2.5:3b | debate | 0.537 | 0.463 | 0.280 |

The pattern is monotonic in access, consistent across all three protocols, and
close to identical across two separately run judges.

**A model shown evidence it cannot read does not become uncertain. It becomes
rejecting.**

This is a different failure than the one we would have guessed. Uncertainty would
look like noise: answers scattered, confidence low, maybe more unparseable
responses. We saw none of that. Our unparsed rate was 0.000 in all eighteen cells.
The judge was not confused. It was confident, and it was confidently saying no.

## Why the perfect score is the frightening part

Now return to that 1.000.

A judge that answers no to 94 percent of questions will get every no answer right.
Not because it evaluated them, but because it was going to say no regardless. On
our data it scores 1.000 on the no items and 0.103 on the yes items.

Aggregate accuracy does not show you this. It shows you 0.447, which reads as a
weak judge having a hard time. Balanced accuracy shows you 0.551, which reads as
slightly better than chance. Neither number tells you that you are looking at a
system which has stopped discriminating and started reflexively rejecting.

Only conditioning on the true label reveals it. And conditioning on the true label
is not what most evaluation reports do.

There is a further trap. Rejection-heavy behaviour does not merely hide, it
**flatters**. A model that refuses, flags, and declines looks cautious. It looks
like a system erring on the side of safety. In a domain where the costs are
asymmetric and false negatives are worse than false positives, a conservative
overseer is exactly what you would say you want. And on any dataset where most
items are genuinely negative, which describes most safety evaluation data, that
same broken behaviour will post respectable aggregate numbers.

The failure mode and the desired behaviour look the same from the outside.

## The objection we had to answer about our own work

After we published this, we found a hole in it.

Go back and look at what the judge was actually told. Under OBSCURED it saw the
ciphertext, and it also read two sentences from us: *"You cannot decode this
passage"* and *"You may not be able to verify their quotations."* Under NONE it
read neither of those, because there was nothing to say them about.

So our two conditions differed in two ways at once, not one. The ciphertext was
one. Us telling the judge it could not verify anything was the other.

That matters enormously. If the warning was doing the work, then we had not
discovered anything about illegible evidence. We had discovered that if you tell a
language model it cannot check something, it gets suspicious, which is roughly
what you would expect and not worth a paper. The finding would have been an
artifact of our own prompt.

So we ran it. A clean two-by-two: ciphertext or no ciphertext, crossed with
warning or no warning, 300 questions per cell, on both judges, with two extra
cells reproducing the original wording exactly so we could check the new setup
against the old numbers.

| | no warning | with warning |
|---|---|---|
| **ciphertext** | 0.043 | 0.053 |
| **no passage** | 0.257 | 0.213 |

The ciphertext moves the yes rate by around 21 points. The warning moves it by
one. The ciphertext effect is seven standard errors and replicates on both
judges. The warning effect does not reach significance on either, and in the one
place it comes close it points the wrong way to explain anything.

The cell that settles it is the top left. There the judge sees the word PASSAGE,
then a block of gibberish, and **not one word anywhere about verification, or
reading, or what it can and cannot check.** It says no to 96 percent of the
questions.

The reproduction cells came back at 0.193 against the 0.193 we originally
reported, and 0.057 against 0.063.

We are telling you this partly because the result is stronger for having been
attacked, and partly because the version of this article you may have read a few
hours ago did not mention the problem, since we had not yet noticed it. A finding
that survives its own authors trying to break it is worth more than one that was
never tested. But you should know it needed the test.

The full experiment is in the
[`collapse/` directory of the oversight repository](https://github.com/Unkadlabs/unkad-oversight/tree/main/collapse).

## What this might mean, and what we have not shown

We tested question-answering judges on BoolQ. We did not test a safety classifier.
We want to be exact about that line, because the next sentence is the one people
will want to quote and it needs its fence.

**Our hypothesis**, not our finding, is this: an automated safety system applied to
a language it does not handle may fail toward rejection rather than toward noise.
If so, it would flag or refuse broadly, look appropriately conservative, report
defensible aggregate metrics, and have close to zero real discrimination. It would
pass review. It would ship. And the evaluation that would have caught it, breaking
performance down by true label rather than reporting one number, is not standard
practice.

That is a testable claim and testing it directly is our next priority. Until we
have, it remains a hypothesis generated by an experiment about something else.

## What is wrong with this study

The central limitation is one we cannot argue away, so we will lead with it.

**ROT13 is not a language.** Our motivation is oversight in languages that
overseers do not handle, and we tested a cipher on English text. A judge facing
ROT13 has exactly zero comprehension. A judge facing Somali has some non-zero
amount that we did not measure. Those are genuinely different situations, and
nothing in this study speaks directly to any natural language.

We chose the cipher deliberately. Establishing whether the effect exists at all,
under a clean binary where we can verify the blinding holds, should come before
spending translation budget on native-speaker annotation. But it means this work is
a foundation for the multilingual question rather than an answer to it. Our next
experiment replaces the binary with a gradient: the same task presented to judges
in languages where their competence varies and has been measured independently,
so we can ask at what level of competence debate stops helping, and whether the
falloff is smooth or a cliff.

Other limits. BoolQ questions are often answerable from world knowledge, which
compresses the range where protocols can show value. Our dataset is 62 percent yes,
and the exploratory finding above really needs a balanced one. Our two judges
replicate each other closely but come from the same model family. We had justified
the smaller judge as a weaker model that would give protocols more headroom, and it
turned out to read the passage just as well as the larger one, so it functioned as
a same-strength replication instead of the stress test we described. One dataset,
one debater model, one round of argument, English only.

## Why we are publishing this

Everything is in the open: the pre-registration written before the run, the code,
every transcript, every per-sample judge decision, the hypothesis that failed, and
the claim we withdrew when the second judge did not support it.

The result we are most confident in is a small one. Debate survives a judge that
cannot verify. The result we find most interesting is exploratory and needs someone
to pre-register it properly, possibly someone other than us.

We think there is something worth saying about where this came from. This ran
overnight on quantised models on a single machine, on questions that we came to
because of the languages around us. It cost nothing but attention and care. A great
deal of the work that needs doing on multilingual safety is like this: not blocked
on compute, blocked on somebody being interested enough to look.

We looked at what a model does when you take away its ability to read. It did not
tell us it was lost. It said no, confidently, over and over, and scored perfectly
on half the test.

---

*The full paper, pre-registration, code, and transcripts are available in our
[oversight repository](https://github.com/Unkadlabs/unkad-oversight). Correspondence to
research@unkad.com.*
