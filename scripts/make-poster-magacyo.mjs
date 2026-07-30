import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The Facebook poster: the names are the design.
//
// The three release cards are paper, English, editorial — the register for
// researchers reading a dataset card. This audience is different. These are the
// people who wrote the corpus, on their phones, and what they want from a post
// is to find themselves in it and send it to their family. So this one is the
// darker campaign treatment, in Somali, and its whole surface is the names.
//
// Why a flowing block rather than the tidy two-column list of the credits card:
// a list is read down one column at a time and 67 names feel like an
// administrative table. Set as continuous text filling the frame, the same 67
// names read as a crowd, and the density is the message — you cannot count them
// at a glance, which is the point. The number is printed once, small, at the
// bottom, for anyone who wants it.
//
// Every name is the same size and the same colour. Sizing by output would turn
// a thank-you into a league table, and the person who wrote three careful
// sentences took the same chance on this project as the person who wrote three
// hundred. The seed cell in the mark is the only accent that moves.
//
//   node scripts/make-poster-magacyo.mjs
//   node scripts/make-poster-magacyo.mjs --story

const STORY = process.argv.includes('--story');
const dataIdx = process.argv.indexOf('--data');
const DATA = JSON.parse(
  fs.readFileSync(dataIdx === -1 ? '/tmp/credits.json' : process.argv[dataIdx + 1], 'utf8')
);
const SHAPE = JSON.parse(fs.readFileSync('/tmp/corpus-shape.json', 'utf8'));

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-magacyo-story.png' : 'qor-magacyo-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 84 : 76;

// Indigo rather than black: it has a hue, so the teal has something to sit
// against instead of floating on a void.
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

function mark(size) {
  const u = size / 100;
  const sq = (x, y, fill) =>
    h('div', {
      key: `${x}-${y}`,
      style: {
        position: 'absolute', left: x * u, top: y * u,
        width: 24 * u, height: 24 * u, borderRadius: 5 * u, backgroundColor: fill,
      },
    });
  return h('div', { style: { position: 'relative', width: size, height: size, display: 'flex' } }, [
    sq(38, 70, TEAL), sq(6, 70, PAPER), sq(70, 70, PAPER),
    sq(6, 38, PAPER), sq(70, 38, PAPER), sq(6, 6, PAPER), sq(70, 6, PAPER),
  ]);
}

const names = DATA.named;
// Sized so the block fills the frame without a gap at the bottom or a name
// clipped at the edge. Condensed caps because Norwester fits far more
// characters per line than the serif and the crowd effect depends on density.
// Tuned, not guessed: 30 left a void above the footer and 33 ran the block into
// it. The wall has to end just clear of the rule, because a name touching the
// footer reads as an accident on a poster whose entire subject is names.
const NAME_SIZE = STORY ? 35 : 31;

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    padding: PAD, backgroundColor: INK, overflow: 'hidden',
    backgroundImage:
      'radial-gradient(1100px 700px at 12% -10%, rgba(77,182,165,0.16), rgba(12,16,38,0) 60%)',
    fontFamily: 'Source Serif 4',
  },
}, [
  h('div', { key: 'brand', style: { flexShrink: 0, display: 'flex', alignItems: 'center', gap: 15 } }, [
    mark(32),
    h('div', {
      key: 'wm',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: 21, color: DIM,
        letterSpacing: '0.18em', lineHeight: 1.4,
      },
    }, 'QOR AF-SOOMAALI'),
  ]),

  // !! VERIFY SOMALI !! — founder to confirm before posting.
  h('div', {
    key: 'head',
    lang: 'so',
    style: {
      flexShrink: 0, display: 'flex', flexWrap: 'wrap',
      fontSize: STORY ? 56 : 47, color: PAPER, lineHeight: 1.18,
      marginTop: STORY ? 40 : 30, marginBottom: STORY ? 30 : 24,
    },
  }, 'Kuwani waa dadkii qoray'),

  // The wall. One flowing block, separators in teal so the eye can find the
  // gaps between names without the dots competing with the names themselves.
  h('div', {
    key: 'wall',
    style: {
      display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start',
      fontFamily: 'Norwester', fontSize: NAME_SIZE, lineHeight: 1.42,
      letterSpacing: '0.02em',
    },
  }, names.flatMap((n, i) => {
    const parts = [
      h('span', { key: `n${i}`, style: { color: PAPER, marginRight: 12 } }, n.toUpperCase()),
    ];
    if (i < names.length - 1) {
      parts.push(h('span', { key: `d${i}`, style: { color: TEAL, marginRight: 12 } }, '·'));
    }
    return parts;
  })),

  h('div', {
    key: 'anon',
    lang: 'so',
    style: {
      flexShrink: 0, display: 'flex', flexWrap: 'wrap',
      fontSize: STORY ? 24 : 21, color: DIM, lineHeight: 1.45,
      marginTop: STORY ? 24 : 19,
    },
  }, `iyo ${DATA.anon} qof oo doortay inaan magacyadooda la qorin.`),

  h('div', {
    key: 'foot',
    style: {
      flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      marginTop: 'auto', borderTop: '1px solid rgba(244,239,228,0.16)',
      paddingTop: STORY ? 26 : 21,
    },
  }, [
    h('div', { key: 'a', style: { display: 'flex', alignItems: 'baseline', gap: 12 } }, [
      h('div', {
        key: 'n',
        style: {
          display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 52 : 44,
          color: WARM, letterSpacing: '-0.01em', lineHeight: 1.1,
        },
      }, SHAPE.sentences.toLocaleString('en-US')),
      h('div', {
        key: 'l',
        lang: 'so',
        style: {
          display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 26 : 22,
          color: DIM, letterSpacing: '0.16em', lineHeight: 1.4,
        },
      }, 'JUMLADOOD'),
    ]),
    h('div', {
      key: 'b',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 26 : 22,
        color: PAPER, letterSpacing: '0.12em', lineHeight: 1.4,
      },
    }, 'QOR.UNKAD.COM'),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB) — ${names.length} names`);
