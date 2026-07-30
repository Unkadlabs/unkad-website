import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Figures for the corpus release article.
//
// Article plates, not social cards. They are 1600 wide and sized to be read at
// article width on a phone, they carry no branding or URLs because the page
// around them already does, and each one exists to make a claim in the text
// checkable rather than to decorate it. A figure that only repeats a sentence
// from the paragraph above it should be cut.
//
// Paper background in both themes on purpose: the site has a dark mode, and a
// figure that inverts with it would need two renders and would still read as a
// screenshot rather than a plate. Printed plates on a dark page are a long
// convention and they hold.
//
//   node scripts/make-figures-corpus.mjs

const W = 1600;

const PAPER = '#F2EDE3';
const INK = '#0C1026';
const TEAL = '#2F8C7E';
const SAFFRON = '#C67A1E';
const DIM = '#8A8577';
const RULE = 'rgba(12,16,38,0.16)';

const fonts = [
  {
    name: 'Norwester',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'Norwester.otf')),
    weight: 400,
    style: 'normal',
  },
  ...['Regular', 'Bold'].map((w, i) => ({
    name: 'Source Serif 4',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', `SourceSerif4-${w}.otf`)),
    weight: i === 0 ? 400 : 700,
    style: 'normal',
  })),
];

const label = (text, color = DIM, size = 22) =>
  h('div', {
    style: {
      display: 'flex', fontFamily: 'Norwester', fontSize: size,
      color, letterSpacing: '0.18em', lineHeight: 1.4,
    },
  }, text);

const plate = (children, height) =>
  h('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4',
    },
  }, children);

async function render(name, node, height) {
  const res = new ImageResponse(node, { width: W, height, fonts });
  const out = path.join(process.cwd(), 'public', 'images', name);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(out, buf);
  console.log(`wrote ${name} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${height})`);
}

// ---------------------------------------------------------------------------
// Figure 1 — what is knowable about one sentence, scraped versus written.
//
// The article's central claim is that provenance is the difference, not size.
// Two columns of the same seven questions makes that checkable at a glance:
// one column is almost entirely unknown, the other is entirely answered. The
// asymmetry is the argument, so nothing else on the plate competes with it.
const FIELDS = [
  ['Who wrote it', 'unknown', 'Salma Dhegacadde'],
  ['Did they agree to release it', 'unknown', 'yes, before writing'],
  ['Under what licence', 'unclear', 'CC BY-SA 4.0'],
  ['When was it written', 'unknown', '29 July 2026'],
  ['Which dialect', 'unlabelled', 'Maxaa-tiri'],
  ['Machine translated?', 'often, undetectably', 'no'],
  ['Who checked it', 'nobody', 'two peers, one reviewer'],
];

const fig1 = plate([
  label('ONE SENTENCE, TWO WAYS OF GETTING IT', TEAL),
  h('div', {
    key: 'sub',
    style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 14, marginBottom: 34 },
  }, 'The same questions, asked of a sentence from a scraped corpus and of a sentence from this one.'),

  h('div', { key: 'head', style: { display: 'flex', borderBottom: `2px solid ${INK}`, paddingBottom: 12 } }, [
    h('div', { key: 'a', style: { display: 'flex', width: 520, flexShrink: 0 } }, label('', DIM)),
    h('div', { key: 'b', style: { display: 'flex', width: 440, flexShrink: 0 } }, label('SCRAPED FROM THE WEB', DIM)),
    h('div', { key: 'c', style: { display: 'flex' } }, label('WRITTEN FOR THIS CORPUS', TEAL)),
  ]),

  ...FIELDS.map(([q, scraped, ours], i) =>
    h('div', {
      key: q,
      style: {
        display: 'flex', alignItems: 'baseline',
        borderBottom: i === FIELDS.length - 1 ? 'none' : `1px solid ${RULE}`,
        paddingTop: 20, paddingBottom: 20,
      },
    }, [
      h('div', { key: 'q', style: { display: 'flex', width: 520, flexShrink: 0, fontSize: 27, color: INK } }, q),
      h('div', { key: 's', style: { display: 'flex', width: 440, flexShrink: 0, fontSize: 27, color: DIM } }, scraped),
      h('div', { key: 'o', style: { display: 'flex', fontSize: 27, color: INK } }, ours),
    ])
  ),
]);

// ---------------------------------------------------------------------------
// Figure 2 — coverage, drawn to true scale.
//
// The card could say "nine domains" and be honest by the letter. Drawn, the
// imbalance is unmissable: one domain holds seven in ten sentences and the
// thinnest holds nine sentences in total. Publishing the picture rather than
// the summary is the whole point of the figure — a reader who discovers this
// themselves trusts everything else less.
const SECTORS = [
  ['general', 1091], ['religion', 183], ['technology', 87], ['culture', 69],
  ['education', 52], ['agriculture', 47], ['media', 17], ['health', 15], ['law', 9],
];
const MAX = SECTORS[0][1];
const BAR_W = 1000;

const fig2 = plate([
  label('COVERAGE BY DOMAIN', TEAL),
  h('div', {
    key: 'sub',
    style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 14, marginBottom: 36 },
  }, 'Nine domains are represented. Drawn to scale, so the imbalance is visible rather than described.'),

  ...SECTORS.map(([name, n]) =>
    h('div', {
      key: name,
      style: { display: 'flex', alignItems: 'center', marginBottom: 18 },
    }, [
      h('div', {
        key: 'l',
        style: {
          display: 'flex', width: 230, flexShrink: 0, justifyContent: 'flex-end',
          paddingRight: 22, fontSize: 26, color: INK,
        },
      }, name),
      h('div', {
        key: 'bar',
        style: {
          display: 'flex', width: Math.max(3, Math.round((n / MAX) * BAR_W)), height: 30,
          backgroundColor: name === 'general' ? SAFFRON : TEAL, borderRadius: 3,
        },
      }),
      h('div', {
        key: 'n',
        style: { display: 'flex', fontFamily: 'Norwester', fontSize: 25, color: DIM, marginLeft: 18 },
      }, String(n)),
    ])
  ),

  h('div', {
    key: 'note',
    style: { display: 'flex', fontSize: 24, color: DIM, marginTop: 22, lineHeight: 1.5 },
  }, 'One long essay contributes many sentences to a single domain, which is why general dominates. Balancing coverage is the current priority of collection.'),
]);

// ---------------------------------------------------------------------------
// Figure 3 — where a sentence ends, and why that is not obvious.
//
// The segmentation section makes an abstract claim: the naive rule cuts real
// sentences in half. This shows it happening to an actual passage, with the
// wrong cut marked. Nothing else explains the 6% correction as economically.
const seg = (text, cut, wrong) =>
  h('div', {
    key: text.slice(0, 12),
    style: {
      display: 'flex', flexDirection: 'column',
      border: `1px solid ${wrong ? SAFFRON : RULE}`, borderRadius: 10,
      padding: '22px 26px', marginBottom: 18,
      backgroundColor: wrong ? 'rgba(198,122,30,0.07)' : 'transparent',
    },
  }, [
    h('div', { key: 'l', style: { display: 'flex', marginBottom: 10 } },
      label(wrong ? 'LINE BREAK RULE — CUTS HERE' : 'CORRECTED — NO CUT', wrong ? SAFFRON : TEAL, 19)),
    h('div', {
      key: 't', lang: 'so',
      style: { display: 'flex', flexWrap: 'wrap', fontSize: 30, color: INK, lineHeight: 1.45 },
    }, text),
    h('div', {
      key: 'c',
      style: { display: 'flex', fontSize: 23, color: DIM, marginTop: 12 },
    }, cut),
  ]);

const fig3 = plate([
  label('WHERE DOES A SOMALI SENTENCE END', TEAL),
  h('div', {
    key: 'sub',
    style: { display: 'flex', flexWrap: 'wrap', fontSize: 26, color: DIM, marginTop: 14, marginBottom: 32, lineHeight: 1.5 },
  }, 'No segmenter supports Somali, so the first rule split on every line break. Contributors press Enter to wrap a long line, and the rule cut their sentences in half.'),

  seg(
    'Waa hadal dheer oo aan  /  ku qorayo laba xariiq oo kala duwan.',
    'The writer pressed Enter where the slash is. Counted as two sentences; neither half is one.',
    true
  ),
  seg(
    'Waa hadal dheer oo aan ku qorayo laba xariiq oo kala duwan.',
    'A break is a boundary only when the text around it says so: the previous line ended, or the next begins a new sentence, or it starts a list or a speaker turn.',
    false
  ),

  h('div', {
    key: 'note',
    style: { display: 'flex', flexWrap: 'wrap', fontSize: 25, color: INK, marginTop: 14, lineHeight: 1.5 },
  }, 'That single fault inflated this corpus by 6%: 1,840 reported sentences were really 1,722.'),
]);

await render('fig-provenance.png', fig1, 820);
await render('fig-coverage.png', fig2, 760);
await render('fig-segmentation.png', fig3, 700);
