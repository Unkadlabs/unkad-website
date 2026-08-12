import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Figures for the qiimeyn article (frontier models vs the community's
// quality judgments). Article plates, not social cards — same conventions
// as make-figures-corpus.mjs: 1600 wide, paper background in both themes,
// no branding, each plate makes one claim in the text checkable.
//
//   node scripts/make-figures-qiimeyn.mjs

const W = 1600;

const PAPER = '#F2EDE3';
const INK = '#0C1026';
const TEAL = '#2F8C7E';
const SAFFRON = '#C67A1E';
const DIM = '#8A8577';
const RULE = 'rgba(12,16,38,0.16)';

// Source Serif lives in the platform repo; this repo's assets/fonts only
// carries Norwester and the webfonts.
const SERIF_DIR = path.join(process.cwd(), '..', 'unkad-platform', 'assets', 'fonts');

const fonts = [
  {
    name: 'Norwester',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'Norwester.otf')),
    weight: 400,
    style: 'normal',
  },
  ...['Regular', 'Bold'].map((w, i) => ({
    name: 'Source Serif 4',
    data: fs.readFileSync(path.join(SERIF_DIR, `SourceSerif4-${w}.otf`)),
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

const plate = (children) =>
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
// Figure 1 — the 23 rejected submissions, judge by judge.
//
// The article's central number is 0 of 23. Drawn as one cell per rejected
// submission, the emptiness of the frontier rows against the full community
// row IS the finding; a percentage would soften it.
const JUDGES = [
  ['Qor validators', 23],
  ['Claude Sonnet 5', 3],
  ['GPT-5.6', 0],
  ['Gemini 3.1 Pro', 0],
];

const fig1 = plate([
  label('THE 23 SUBMISSIONS THE COMMUNITY REJECTED', TEAL),
  h('div', {
    key: 'sub',
    style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 14, marginBottom: 40 },
  }, 'Each cell is one rejected submission. A filled cell means the judge caught it.'),
  ...JUDGES.map(([name, caught], r) =>
    h('div', {
      key: name,
      style: {
        display: 'flex', alignItems: 'center',
        paddingTop: 22, paddingBottom: 22,
        borderTop: r === 0 ? `2px solid ${INK}` : `1px solid ${RULE}`,
      },
    }, [
      h('div', {
        key: 'n',
        style: { display: 'flex', width: 400, flexShrink: 0, fontSize: 28, color: INK, fontWeight: r === 0 ? 700 : 400 },
      }, name),
      h('div', { key: 'cells', style: { display: 'flex', gap: 10 } },
        Array.from({ length: 23 }, (_, i) =>
          h('div', {
            key: i,
            style: i < caught
              ? { display: 'flex', width: 34, height: 34, borderRadius: 8, backgroundColor: TEAL }
              : { display: 'flex', width: 34, height: 34, borderRadius: 8, border: `2px solid ${RULE}` },
          })
        )
      ),
      h('div', {
        key: 'c',
        style: {
          display: 'flex', marginLeft: 'auto', width: 130, flexShrink: 0,
          justifyContent: 'flex-end', fontSize: 28, color: caught ? INK : DIM, fontWeight: 700,
        },
      }, `${caught}/23`),
    ])
  ),
]);

// ---------------------------------------------------------------------------
// Figure 2 — sector accuracy, concrete versus fuzzy.
//
// The comprehension half of the story: the same models that judge nothing
// place a health or technology text correctly almost every time, then fall
// apart exactly where the boundaries are editorial (media/culture/general).
// Averaged across the three models; per-model numbers are in the table.
const SECTORS = [
  ['health', 97.6],
  ['technology', 96.4],
  ['agriculture', 93.0],
  ['religion', 91.0],
  ['education', 86.4],
  ['law', 60.7],
  ['culture', 55.1],
  ['general', 48.5],
  ['media', 42.8],
];
const BAR_MAX = 1080;

const fig2 = plate([
  label('CAN IT TELL WHAT THE TEXT IS ABOUT?', TEAL),
  h('div', {
    key: 'sub',
    style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 14, marginBottom: 38 },
  }, 'Sector classification accuracy, averaged across the three models. Guessing would score 11%.'),
  ...SECTORS.map(([name, pct], i) =>
    h('div', {
      key: name,
      style: { display: 'flex', alignItems: 'center', paddingTop: 15, paddingBottom: 15, borderTop: i === 0 ? `2px solid ${INK}` : `1px solid ${RULE}` },
    }, [
      h('div', { key: 'n', style: { display: 'flex', width: 300, flexShrink: 0, fontSize: 28, color: INK } }, name),
      h('div', {
        key: 'b',
        style: {
          display: 'flex', width: Math.max(6, Math.round((pct / 100) * BAR_MAX)), height: 30,
          borderRadius: 6, backgroundColor: pct >= 80 ? TEAL : SAFFRON,
        },
      }),
      h('div', { key: 'v', style: { display: 'flex', marginLeft: 20, fontSize: 27, color: INK, fontWeight: 700 } }, `${pct.toFixed(0)}%`),
    ])
  ),
  h('div', {
    key: 'note',
    style: { display: 'flex', marginTop: 30, fontSize: 24, color: DIM },
  }, 'Teal: sectors with concrete vocabulary. Saffron: sectors whose boundaries are editorial judgment.'),
]);

// ---------------------------------------------------------------------------
// Figure 3 — the bug was ours.
//
// For an hour every model scored zero on agriculture, because our parser
// matched the sector name "culture" inside the word "agriculture". The
// plate shows the collision itself — the strongest form of the confession
// is letting the reader see exactly what the code saw.
const fig3 = plate([
  label('THE BUG WAS OURS', SAFFRON),
  h('div', {
    key: 'sub',
    style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 14, marginBottom: 44 },
  }, 'Our answer parser looked for the last sector name in the reply, and found one inside another word.'),
  h('div', { key: 'word', style: { display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginBottom: 10 } }, [
    h('div', { key: 'a', style: { display: 'flex', fontSize: 130, fontWeight: 700, color: INK } }, 'agri'),
    h('div', {
      key: 'b',
      style: {
        display: 'flex', fontSize: 130, fontWeight: 700, color: SAFFRON,
        borderBottom: `8px solid ${SAFFRON}`,
      },
    }, 'culture'),
  ]),
  h('div', {
    key: 'cap',
    style: { display: 'flex', justifyContent: 'center', fontSize: 25, color: DIM, marginBottom: 48 },
  }, 'Every correct “agriculture” answer was recorded as “culture”.'),
  ...[['As first scored', 0, SAFFRON], ['After the one-line fix', 93, TEAL]].map(([name, pct, color], i) =>
    h('div', {
      key: name,
      style: { display: 'flex', alignItems: 'center', paddingTop: 16, paddingBottom: 16, borderTop: i === 0 ? `2px solid ${INK}` : `1px solid ${RULE}` },
    }, [
      h('div', { key: 'n', style: { display: 'flex', width: 460, flexShrink: 0, fontSize: 28, color: INK } }, name),
      h('div', {
        key: 'b',
        style: { display: 'flex', width: Math.max(6, Math.round((pct / 100) * 880)), height: 30, borderRadius: 6, backgroundColor: color },
      }),
      h('div', { key: 'v', style: { display: 'flex', marginLeft: 20, fontSize: 27, color: INK, fontWeight: 700 } }, `${pct}%`),
    ])
  ),
  h('div', {
    key: 'note',
    style: { display: 'flex', marginTop: 30, fontSize: 24, color: DIM },
  }, 'Agriculture accuracy, average of the three models. No model was re-queried, only re-read.'),
]);

await render('fig-qiimeyn-catch.png', fig1, 560);
await render('fig-qiimeyn-sectors.png', fig2, 940);
await render('fig-qiimeyn-bug.png', fig3, 760);
