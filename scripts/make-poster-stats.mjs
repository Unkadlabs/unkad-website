import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The where-we-are poster: three figures and the distance still to walk.
//
// Same skeleton as the tirooyin release poster — three stacked numbers, the
// last one teal because it is the future — plus one new element: a thin
// progress track under the figures. On a recruitment post the near-empty bar
// is the argument. It says you are early, the work is real, and there is room
// for your name in it. The percentage is set small on purpose; the bar does
// the talking.
//
// Somali labels are the three the founder already approved for the tirooyin
// poster, verbatim. No new Somali was written for this image.
//
// Figures are passed in so the poster can never silently disagree with the
// database — regenerate whenever the numbers move:
//
//   node scripts/make-poster-stats.mjs --writers 98 --sentences 2198
//   node scripts/make-poster-stats.mjs --writers 98 --sentences 2198 --story

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(process.argv[i + 1]);
};
const WRITERS = arg('writers', NaN);
const SENTENCES = arg('sentences', NaN);
if (!WRITERS || !SENTENCES) {
  console.error('pass --writers N --sentences N (current platform numbers)');
  process.exit(1);
}
const GOAL = 100_000;
const STORY = process.argv.includes('--story');

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-stats-story.png' : 'qor-stats-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 100 : 92;

const INK = '#141312';
const PAPER = '#E8E6E1';
const TEAL = '#4DB6A5';
const DIM = '#A5A19A';
const TRACK = '#2A2926';

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

const pct = (SENTENCES / GOAL) * 100;

const FIGURES = [
  [WRITERS.toLocaleString('en-US'), 'QOF AYAA QORAY', PAPER],
  [SENTENCES.toLocaleString('en-US'), 'JUMLADOOD', PAPER],
  [GOAL.toLocaleString('en-US'), 'AYAA LA HIIGSANAYAA', TEAL],
];

const figure = ([n, label, colour], i) =>
  h('div', {
    key: label,
    style: {
      display: 'flex', flexDirection: 'column',
      marginBottom: i === FIGURES.length - 1 ? 0 : (STORY ? 66 : 50),
    },
  }, [
    h('div', {
      key: 'n',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 158 : 132,
        color: colour, letterSpacing: '-0.045em', lineHeight: 0.9,
      },
    }, n),
    h('div', {
      key: 'l',
      lang: 'so',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 25 : 22,
        color: colour === TEAL ? TEAL : DIM, letterSpacing: '0.2em',
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

  // The road: how far the corpus has come against where it is pointed.
  // The fill is honest — no minimum width flattery. Early is the message.
  h('div', {
    key: 'road',
    style: { display: 'flex', flexDirection: 'column' },
  }, [
    h('div', {
      key: 'track',
      style: {
        display: 'flex', width: '100%', height: 10, borderRadius: 5,
        backgroundColor: TRACK, overflow: 'hidden',
      },
    }, h('div', {
      style: {
        display: 'flex', width: `${Math.max(pct, 0.8)}%`, height: 10,
        backgroundColor: TEAL,
      },
    })),
    h('div', {
      key: 'pct',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 22 : 19,
        color: TEAL, letterSpacing: '0.14em', marginTop: 14,
      },
    }, `${pct.toFixed(1)}%`),
  ]),

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
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H}) — ${SENTENCES}/${GOAL} = ${pct.toFixed(1)}%`);
