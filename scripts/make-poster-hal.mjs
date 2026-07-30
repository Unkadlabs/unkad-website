import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// One sentence. Nothing else.
//
// The minimal alternative to the names wall. Where that poster says "look how
// many of us", this says "look what one of us wrote", and it carries no
// statistics, no chart, no explanation, and no call to action beyond the
// address at the foot. The caption on the post does that work; the image only
// has to make someone stop.
//
// Deliberately not cream paper with a big serif quote. That combination is the
// single most templated look in circulation right now and it would read as
// generic no matter how good the sentence is. Dark field instead, with the type
// in warm off-white: the same contrast the campaign posters use, so the lab
// still looks like itself.
//
// The only ornament is one teal cell. `unug` is Somali for cell, the brand mark
// is seven of them assembling from a seed, and the corpus posters draw one cell
// per sentence. Here there is one sentence, so there is one cell. That is the
// whole idea, and adding a second element would break it.
//
// The sentence is real, accepted, peer-validated by two contributors and
// verified. It is also about Somali storytelling, which is the argument for the
// entire project stated by a contributor without being asked to.
//
//   node scripts/make-poster-hal.mjs
//   node scripts/make-poster-hal.mjs --story

const STORY = process.argv.includes('--story');

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-hal-story.png' : 'qor-hal-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 100 : 92;

const INK = '#0B0F22';
const PAPER = '#F4EFE4';
const TEAL = '#4DB6A5';
const DIM = '#6B7186';

const SENTENCE = 'Ayeeyo ayaa sheekooyinka ugu fiican ka sheekeysa.';
const AUTHOR = 'Sharafdin Yusuf';

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

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    padding: PAD, backgroundColor: INK, overflow: 'hidden',
    fontFamily: 'Source Serif 4',
  },
}, [
  // One cell. One sentence. The brand's atom, used literally.
  h('div', {
    key: 'seed',
    style: {
      display: 'flex', width: 22, height: 22, borderRadius: 5,
      backgroundColor: TEAL, flexShrink: 0,
    },
  }),

  // The sentence, given the whole middle of the page and most of its air.
  h('div', {
    key: 'text',
    lang: 'so',
    style: {
      display: 'flex', flexWrap: 'wrap',
      fontSize: STORY ? 96 : 82, color: PAPER,
      lineHeight: 1.22, letterSpacing: '-0.02em',
    },
  }, SENTENCE),

  h('div', {
    key: 'foot',
    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  }, [
    h('div', { key: 'a', style: { display: 'flex', flexDirection: 'column' } }, [
      h('div', {
        key: 'n',
        style: { display: 'flex', fontSize: STORY ? 27 : 24, color: PAPER, lineHeight: 1.4 },
      }, AUTHOR),
      h('div', {
        key: 'l',
        lang: 'so',
        style: {
          display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 19 : 17,
          color: DIM, letterSpacing: '0.18em', lineHeight: 1.5, marginTop: 4,
        },
      }, 'AYAA QORAY'),
    ]),
    h('div', {
      key: 'b',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 23 : 20,
        color: DIM, letterSpacing: '0.14em', lineHeight: 1.4,
      },
    }, 'QOR.UNKAD.COM'),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`);
