import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Three numbers, and nothing else.
//
// The minimal poster built on statistics rather than a sentence. The discipline
// is in what is left out: no chart, no domain breakdown, no explanation. Three
// figures that only mean something together.
//
//   75 people made
//   1,547 sentences
//   0 of them in Maay
//
// The last one is the reason the poster exists. A release card that prints only
// what was achieved is an advertisement; the zero turns the same three numbers
// into an invitation, and it is the single most useful line the lab can put in
// front of a Somali reader. It carries the warm accent for that reason, the only
// colour on the page that is not the type.
//
// Exact brand palette, no drift: ink #0C1026, paper #F4EFE4, teal #4DB6A5 on the
// seed cell, saffron #E9A13B on the zero.
//
//   node scripts/make-poster-tirooyin.mjs
//   node scripts/make-poster-tirooyin.mjs --story

const STORY = process.argv.includes('--story');
const SHAPE = JSON.parse(fs.readFileSync('/tmp/corpus-shape.json', 'utf8'));
const CREDITS = JSON.parse(fs.readFileSync('/tmp/credits.json', 'utf8'));

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-tirooyin-story.png' : 'qor-tirooyin-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 100 : 92;

const INK = '#0C1026';
const PAPER = '#F4EFE4';
const TEAL = '#4DB6A5';
const WARM = '#E9A13B';
const DIM = '#6B7186';

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

// !! VERIFY SOMALI !! — three labels, founder to confirm.
const FIGURES = [
  [CREDITS.total.toLocaleString('en-US'), 'QOF AYAA QORAY', PAPER],
  [SHAPE.sentences.toLocaleString('en-US'), 'JUMLADOOD', PAPER],
  ['0', 'JUMLADOOD OO AF-MAAY AH', WARM],
];

const figure = ([n, label, colour], i) =>
  h('div', {
    key: label,
    style: {
      display: 'flex', flexDirection: 'column',
      marginBottom: i === FIGURES.length - 1 ? 0 : (STORY ? 78 : 62),
    },
  }, [
    h('div', {
      key: 'n',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 168 : 142,
        color: colour, letterSpacing: '-0.045em', lineHeight: 0.9,
      },
    }, n),
    h('div', {
      key: 'l',
      lang: 'so',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 25 : 22,
        color: colour === WARM ? WARM : DIM, letterSpacing: '0.2em',
        lineHeight: 1.5, marginTop: STORY ? 14 : 11,
      },
    }, label),
  ]);

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    padding: PAD, backgroundColor: INK, overflow: 'hidden',
    fontFamily: 'Source Serif 4',
  },
}, [
  // The seed cell, the brand's atom, standing in for the whole mark.
  h('div', {
    key: 'seed',
    style: {
      display: 'flex', width: 22, height: 22, borderRadius: 5,
      backgroundColor: TEAL, flexShrink: 0,
    },
  }),

  h('div', {
    key: 'figures',
    style: { display: 'flex', flexDirection: 'column' },
  }, FIGURES.map(figure)),

  h('div', {
    key: 'foot',
    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  }, [
    h('div', {
      key: 'a',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 23 : 20,
        color: PAPER, letterSpacing: '0.14em', lineHeight: 1.4,
      },
    }, 'QOR.UNKAD.COM'),
    h('div', {
      key: 'b',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 23 : 20,
        color: DIM, letterSpacing: '0.14em', lineHeight: 1.4,
      },
    }, 'CC BY-SA 4.0'),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`);
