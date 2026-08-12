import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The ten-minutes poster, for the Facebook recruitment post.
//
// The post's whole argument is one number: less than ten minutes a week is a
// real contribution. So the poster says only that. The headline is the first
// six words of the founder's own post, verbatim — no Somali was written or
// edited for this image; the caption below the post carries the rest.
//
// Same discipline as the hal and tirooyin posters: dark ink field, serif in
// warm off-white, one teal accent doing one job (here it holds the number
// phrase), one seed cell, and the address at the foot. Nothing else.
//
//   node scripts/make-poster-daqiiqo.mjs
//   node scripts/make-poster-daqiiqo.mjs --story

const STORY = process.argv.includes('--story');

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-daqiiqo-story.png' : 'qor-daqiiqo-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 100 : 92;

const INK = '#141312';
const PAPER = '#E8E6E1';
const TEAL = '#4DB6A5';
const DIM = '#A5A19A';

// Founder's post, first clause, verbatim word order. The teal span is the
// number phrase; everything else stays paper.
const WORDS = [
  ['Wax', PAPER], ['ka', PAPER], ['yar', PAPER],
  ['10', TEAL], ['daqiiqo', TEAL],
  ['isbuucii.', PAPER],
];

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

const SIZE = STORY ? 118 : 104;

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    padding: PAD, backgroundColor: INK, overflow: 'hidden',
    fontFamily: 'Source Serif 4',
  },
}, [
  // The seed cell. One sentence of effort is one cell of the corpus.
  h('div', {
    key: 'seed',
    style: {
      display: 'flex', width: 22, height: 22, borderRadius: 5,
      backgroundColor: TEAL, flexShrink: 0,
    },
  }),

  h('div', {
    key: 'text',
    lang: 'so',
    style: { display: 'flex', flexWrap: 'wrap', columnGap: SIZE * 0.28 },
  }, WORDS.map(([word, colour], i) =>
    h('div', {
      key: i,
      style: {
        display: 'flex', fontSize: SIZE, color: colour,
        lineHeight: 1.18, letterSpacing: '-0.02em',
        fontWeight: colour === TEAL ? 700 : 400,
      },
    }, word)
  )),

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
