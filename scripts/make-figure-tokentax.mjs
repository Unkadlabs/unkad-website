import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The token tax plate (23 Aug 2026): what frontier tokenizers charge Somali
// versus English for the same meaning, measured on 261 consented parallel
// pairs from the Qor community corpus, and the Somali-first fix.
//
//   node scripts/make-figure-tokentax.mjs

const W = 1600, H = 900;
const PAPER = '#F2EDE3';
const INK = '#0C1026';
const TEAL = '#12917B';
const RUST = '#A63C2C';
const DIM = '#8A8577';

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

const ROWS = [
  { label: 'English', sub: 'GPT-4o tokenizer', val: 2888, tag: 'baseline', color: DIM },
  { label: 'Somali', sub: 'GPT-4o tokenizer', val: 5397, tag: '1.9× the price', color: RUST },
  { label: 'Somali', sub: 'GPT-4 tokenizer', val: 6915, tag: '2.4× the price', color: RUST },
  { label: 'Somali', sub: 'Somali-first tokenizer', val: 3956, tag: 'the tax, removed', color: TEAL },
];
const MAX = 7400, BARW = 1000;

const plate = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4',
  },
}, [
  h('div', {
    key: 't',
    style: { display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: TEAL, letterSpacing: '0.18em', lineHeight: 1.4 },
  }, 'THE TOKEN TAX'),
  h('div', {
    key: 's',
    style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 14, marginBottom: 34 },
  }, 'Tokens charged for the same meaning: 261 English sentences and their community Somali translations.'),
  ...ROWS.map((r, i) =>
    h('div', { key: `r${i}`, style: { display: 'flex', flexDirection: 'column', marginBottom: 30 } }, [
      h('div', { key: 'l', style: { display: 'flex', alignItems: 'baseline', gap: 14 } }, [
        h('div', { key: 'a', style: { display: 'flex', fontSize: 29, fontWeight: 700, color: INK } }, r.label),
        h('div', { key: 'b', style: { display: 'flex', fontSize: 23, color: DIM } }, r.sub),
      ]),
      h('div', { key: 'bar', style: { display: 'flex', alignItems: 'center', marginTop: 10 } }, [
        h('div', {
          key: 'f',
          style: {
            display: 'flex', width: (r.val / MAX) * BARW, height: 36,
            backgroundColor: r.color, borderTopRightRadius: 8, borderBottomRightRadius: 8,
          },
        }),
        h('div', {
          key: 'v',
          style: { display: 'flex', marginLeft: 18, fontSize: 29, fontWeight: 700, color: INK },
        }, r.val.toLocaleString('en-US')),
        h('div', {
          key: 'g',
          style: { display: 'flex', marginLeft: 16, fontSize: 23, color: r.color === TEAL ? TEAL : DIM, fontWeight: r.color === TEAL ? 700 : 400 },
        }, r.tag),
      ]),
    ])
  ),
  h('div', {
    key: 'note',
    style: { display: 'flex', marginTop: 12, fontSize: 24, color: DIM, lineHeight: 1.5 },
  }, 'More tokens for the same meaning is a tax paid three times: more money per request, slower answers, and half the effective context window. Unug-1 ships with a Somali-first tokenizer, so Somali stops paying it. Data: consented Qor translation pairs; aggregates only.'),
]);

const res = new ImageResponse(plate, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.writeFileSync(path.join(process.cwd(), 'public', 'images', 'fig-token-tax.png'), buf);
console.log(`wrote fig-token-tax.png (${(buf.length / 1024).toFixed(0)} KB)`);
