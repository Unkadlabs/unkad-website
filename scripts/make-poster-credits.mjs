import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The credit roll: everyone who built the corpus, named the way they chose.
//
// Companion to the specimen card. That one shows a single row and everything
// standing behind it; this one shows the people who are that "behind". Together
// they are the release: one sentence with its provenance, and the provenance
// itself made of names.
//
// Consent decides what appears here, not editorial judgement. Contributors
// chose at onboarding between their handle, their real name, or anonymity, and
// the eight who chose anonymity are counted in the total and never named. That
// rule is the same one the exported CREDITS.md follows, so the poster and the
// dataset can never disagree about who agreed to what.
//
// Names are equal in size. A roll that sized people by output would turn a
// thank-you into a leaderboard, and the person who wrote three careful
// sentences took the same risk on this project as the person who wrote three
// hundred. The teal-to-saffron ramp on the cells is positional, not ranked, and
// carries the same `unug` idea as the corpus poster: a person is a cell too.
//
//   node scripts/make-poster-credits.mjs
//   node scripts/make-poster-credits.mjs --story
//   node scripts/make-poster-credits.mjs --data /tmp/credits.json

const STORY = process.argv.includes('--story');
// Somali variant for the community channels. The English card is for a
// researcher scanning a dataset card; this one is for the people whose names
// are on it, and the thank-you is the founder's own wording.
const SO = process.argv.includes('--so');
const dataIdx = process.argv.indexOf('--data');
const DATA = JSON.parse(
  fs.readFileSync(dataIdx === -1 ? '/tmp/credits.json' : process.argv[dataIdx + 1], 'utf8')
);

const OUT = path.join(
  process.cwd(), 'public', 'images',
  SO
    ? (STORY ? 'qor-credits-so-story.png' : 'qor-credits-so-4x5.png')
    : (STORY ? 'qor-credits-story.png' : 'qor-credits-4x5.png')
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 88 : 80;

const PAPER = '#F2EDE3';
const INK = '#0C1026';
const TEAL = '#2F8C7E';
const WARM = '#C67A1E';
const DIM = '#8A8577';

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

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const [t1, t2, t3] = hex(TEAL);
const [w1, w2, w3] = hex(WARM);
const ramp = (t) => `rgb(${lerp(t1, w1, t)},${lerp(t2, w2, t)},${lerp(t3, w3, t)})`;

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
    sq(38, 70, TEAL), sq(6, 70, INK), sq(70, 70, INK),
    sq(6, 38, INK), sq(70, 38, INK), sq(6, 6, INK), sq(70, 6, INK),
  ]);
}

const names = DATA.named;
const FIELD_W = W - PAD * 2;
// Column count follows the format, because 67 names do not fit a square poster
// in two columns and ran straight through the heading and the footer rule.
// Three columns on 4x5, two on the taller story, with the type sized so the
// longest name on the roll still holds one line: a poster whose only job is to
// credit people cannot truncate their names to make the grid work.
// Three columns in both formats. Two fitted the square poster's width but not
// its height, and on the taller story it still ran 67 names straight through
// the footer rule. Three columns hold every name whole in both.
const COLS = 3;
const NAME_SIZE = STORY ? 20 : 18;

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    padding: PAD, backgroundColor: PAPER, overflow: 'hidden',
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

  h('div', {
    key: 'head',
    style: {
      flexShrink: 0, display: 'flex', flexWrap: 'wrap',
      fontSize: STORY ? 52 : 44, color: INK, lineHeight: 1.2,
      marginTop: STORY ? 44 : 32, marginBottom: STORY ? 12 : 9,
    },
  }, SO ? 'Mahadsanidiin dhamaantiin' : 'The people who wrote it'),

  h('div', {
    key: 'sub',
    style: {
      flexShrink: 0, display: 'flex', flexWrap: 'wrap',
      fontSize: SO ? (STORY ? 30 : 25) : (STORY ? 25 : 22), color: DIM,
      lineHeight: 1.45, marginBottom: STORY ? 34 : 26,
    },
  }, SO
      ? 'sida qiimaha leh ee aad ooga qeyb qaadateen inaad jumlado ugu biirisaan.'
      : `${DATA.total} contributors. Each chose how to appear here, before writing a word.`),

  h('div', {
    key: 'names',
    style: {
      flexShrink: 0, display: 'flex', flexWrap: 'wrap', width: FIELD_W,
      rowGap: STORY ? 13 : 10,
    },
  }, names.map((n, i) =>
    h('div', {
      key: n + i,
      style: {
        display: 'flex', alignItems: 'flex-start', gap: 10,
        width: Math.floor(FIELD_W / COLS), paddingRight: 12,
      },
    }, [
      h('div', {
        key: 'c',
        style: {
          display: 'flex', width: 8, height: 8, borderRadius: 2, flexShrink: 0,
          backgroundColor: ramp(i / Math.max(1, names.length - 1)),
        },
      }),
      h('div', {
        key: 't',
        lang: 'so',
        style: {
          display: 'flex', flexWrap: 'wrap', fontSize: NAME_SIZE, color: INK,
          lineHeight: 1.3,
        },
      }, n),
    ])
  )),

  h('div', {
    key: 'anon',
    style: {
      flexShrink: 0, display: 'flex', fontSize: STORY ? 24 : 21, color: DIM,
      marginTop: STORY ? 26 : 20, lineHeight: 1.45,
    },
  }, SO
      ? `iyo ${DATA.anon} qof oo doortay inaan magacyadooda la qorin.`
      : `and ${DATA.anon} who chose to stay anonymous, counted here and named nowhere.`),

  h('div', {
    key: 'foot',
    style: {
      flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginTop: 'auto', borderTop: `2px solid ${INK}`, paddingTop: STORY ? 26 : 21,
      fontFamily: 'Norwester', fontSize: STORY ? 24 : 21, letterSpacing: '0.12em',
    },
  }, [
    h('div', { key: 'a', style: { display: 'flex', color: INK } }, 'QOR.UNKAD.COM'),
    h('div', { key: 'b', style: { display: 'flex', color: DIM } }, 'CC BY-SA 4.0'),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB) — ${names.length} named, ${DATA.anon} anonymous`);
