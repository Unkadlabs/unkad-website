import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// What is actually in the release, drawn rather than summarised.
//
// The third card of the set. The specimen sheet shows one row and its
// provenance; the credit roll shows the people; this shows the shape of the
// thing they made, including the part that is not flattering.
//
// "Nine domains" is true and would be the normal thing to print. Drawn to
// scale, one domain holds seven in ten sentences and the thinnest holds nine
// sentences in total. Publishing the picture instead of the summary is the
// point of the card: a reader who discovers an imbalance for themselves trusts
// everything else you said rather less, and this project's whole argument is
// that its numbers can be checked.
//
// The dominant bar is the warm accent, every other bar teal. Not decoration:
// the eye should land on the imbalance first, because that is the honest
// headline of this particular card.
//
//   node scripts/make-poster-shape.mjs
//   node scripts/make-poster-shape.mjs --story
//   node scripts/make-poster-shape.mjs --data /tmp/corpus-shape.json

const STORY = process.argv.includes('--story');
const dataIdx = process.argv.indexOf('--data');
const DATA = JSON.parse(
  fs.readFileSync(dataIdx === -1 ? '/tmp/corpus-shape.json' : process.argv[dataIdx + 1], 'utf8')
);

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-shape-story.png' : 'qor-shape-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 88 : 80;

const PAPER = '#F2EDE3';
const INK = '#0C1026';
const TEAL = '#2F8C7E';
const WARM = '#C67A1E';
const DIM = '#8A8577';
const RULE = 'rgba(12,16,38,0.14)';

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
    sq(38, 70, TEAL), sq(6, 70, INK), sq(70, 70, INK),
    sq(6, 38, INK), sq(70, 38, INK), sq(6, 6, INK), sq(70, 6, INK),
  ]);
}

const stat = (n, label) =>
  h('div', {
    key: label,
    style: { display: 'flex', flexDirection: 'column', flexShrink: 0 },
  }, [
    h('div', {
      key: 'n',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 70 : 58,
        color: INK, letterSpacing: '-0.02em', lineHeight: 1.05,
      },
    }, n),
    h('div', {
      key: 'l',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 20 : 18,
        color: DIM, letterSpacing: '0.16em', lineHeight: 1.4, marginTop: 6,
      },
    }, label),
  ]);

const FIELD_W = W - PAD * 2;
const LABEL_W = STORY ? 210 : 190;
const NUM_W = 70;
const BAR_MAX = FIELD_W - LABEL_W - NUM_W;
const MAX = DATA.sectors[0][1];

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
      marginTop: STORY ? 44 : 32,
    },
  }, 'What is in it'),

  // Headline figures, three of them, no more. A fourth would turn this into a
  // dashboard and the chart below is the actual subject.
  h('div', {
    key: 'stats',
    style: {
      flexShrink: 0, display: 'flex', gap: STORY ? 74 : 62,
      marginTop: STORY ? 34 : 26, marginBottom: STORY ? 40 : 32,
      borderBottom: `2px solid ${INK}`, paddingBottom: STORY ? 32 : 26,
    },
  }, [
    stat(DATA.sentences.toLocaleString('en-US'), 'SENTENCES'),
    stat(DATA.words.toLocaleString('en-US'), 'WORDS'),
    stat(String(DATA.sectors.length), 'DOMAINS'),
  ]),

  h('div', {
    key: 'chartlabel',
    style: {
      flexShrink: 0, display: 'flex', fontFamily: 'Norwester',
      fontSize: STORY ? 22 : 19, color: TEAL, letterSpacing: '0.2em',
      lineHeight: 1.4, marginBottom: STORY ? 24 : 20,
    },
  }, 'SENTENCES BY DOMAIN, TO SCALE'),

  ...DATA.sectors.map(([name, n], i) =>
    h('div', {
      key: name,
      style: {
        flexShrink: 0, display: 'flex', alignItems: 'center',
        marginBottom: STORY ? 20 : 16,
      },
    }, [
      h('div', {
        key: 'l',
        style: {
          display: 'flex', width: LABEL_W, flexShrink: 0, justifyContent: 'flex-end',
          paddingRight: 18, fontSize: STORY ? 26 : 23, color: INK,
        },
      }, name),
      h('div', {
        key: 'bar',
        style: {
          display: 'flex', width: Math.max(4, Math.round((n / MAX) * BAR_MAX)),
          height: STORY ? 30 : 26, borderRadius: 3,
          backgroundColor: i === 0 ? WARM : TEAL,
        },
      }),
      h('div', {
        key: 'n',
        style: {
          display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 24 : 21,
          color: DIM, marginLeft: 16, lineHeight: 1.4,
        },
      }, String(n)),
    ])
  ),

  h('div', {
    key: 'note',
    style: {
      flexShrink: 0, display: 'flex', flexWrap: 'wrap',
      fontSize: STORY ? 24 : 21, color: DIM, lineHeight: 1.5,
      marginTop: STORY ? 22 : 16,
    },
  }, 'One long essay fills a single domain, which is why general dominates. Balancing this is what collection is for now.'),

  // What the chart cannot show. A card about coverage that only prints what
  // exists is telling half the truth, and the missing half is the part a reader
  // can act on: the dialect nobody has written yet, and the pairs deliberately
  // withheld so a benchmark can be built from them later.
  h('div', {
    key: 'gap',
    style: {
      flexShrink: 0, display: 'flex', flexDirection: 'column',
      marginTop: STORY ? 40 : 32, borderTop: `2px solid ${INK}`, paddingTop: STORY ? 28 : 22,
    },
  }, [
    h('div', {
      key: 'l',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 22 : 19,
        color: WARM, letterSpacing: '0.2em', lineHeight: 1.4, marginBottom: STORY ? 18 : 14,
      },
    }, 'NOT IN IT YET'),
    h('div', {
      key: 'a',
      style: { display: 'flex', alignItems: 'flex-start', marginBottom: STORY ? 12 : 9 },
    }, [
      h('div', {
        key: 'n',
        style: {
          display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 34 : 29,
          color: INK, width: STORY ? 70 : 60, flexShrink: 0, lineHeight: 1.2,
        },
      }, '0'),
      h('div', {
        key: 't',
        style: { display: 'flex', flexWrap: 'wrap', fontSize: STORY ? 25 : 22, color: INK, lineHeight: 1.4 },
      }, 'sentences in Maay. Somali is not one dialect, and this corpus is not yet the language.'),
    ]),
    h('div', {
      key: 'b',
      style: { display: 'flex', alignItems: 'flex-start' },
    }, [
      h('div', {
        key: 'n',
        style: {
          display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 34 : 29,
          color: DIM, width: STORY ? 70 : 60, flexShrink: 0, lineHeight: 1.2,
        },
      }, '168'),
      h('div', {
        key: 't',
        style: { display: 'flex', flexWrap: 'wrap', fontSize: STORY ? 25 : 22, color: DIM, lineHeight: 1.4 },
      }, 'English-paired sentences held back, so an evaluation set can be built that nobody trained on.'),
    ]),
  ]),

  h('div', {
    key: 'foot',
    style: {
      flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginTop: 'auto', borderTop: `1px solid ${RULE}`, paddingTop: STORY ? 26 : 21,
      fontFamily: 'Norwester', fontSize: STORY ? 24 : 21, letterSpacing: '0.12em',
    },
  }, [
    h('div', { key: 'a', style: { display: 'flex', color: INK } }, 'HUGGINGFACE.CO/UNKADLABS'),
    h('div', { key: 'b', style: { display: 'flex', color: DIM } }, 'CC BY-SA 4.0'),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`);
