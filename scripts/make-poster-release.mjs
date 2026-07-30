import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The release announcement: one row, and everything standing behind it.
//
// Every dataset launch graphic leads with its size. This corpus is small, so
// that frame loses before it starts, and it also misses the point: the claim
// here is not how much text there is, it is that every sentence has a named
// author who agreed to release it. Scraped corpora are enormous and cannot show
// a single row's origin. This one can show all of it.
//
// So the poster is a specimen sheet. One real sentence at reading size, its
// provenance recorded beneath it like an accession label, and then the turn:
// 1,547 more carry the same record. The number arrives last, as consequence
// rather than headline.
//
// Paper rather than the dark treatment used for the campaign posters. Those
// were recruitment; this is publication, and it should feel like a page from a
// journal rather than a product announcement.
//
//   node scripts/make-poster-release.mjs
//   node scripts/make-poster-release.mjs --story

const STORY = process.argv.includes('--story');

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-release-story.png' : 'qor-release-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 92 : 84;

const PAPER = '#F2EDE3';
const INK = '#0C1026';
const TEAL = '#2F8C7E'; // darkened to hold against paper
const SAFFRON = '#C67A1E'; // likewise; used once, on the count
const DIM = '#8A8577';
const RULE = 'rgba(12,16,38,0.14)';

// The row on display. Real, accepted, peer-validated and verified; the author
// chose to be credited by name.
const ROW = {
  // Double space in the stored text is normalised at export, so the published
  // row reads as it does here.
  so: 'Hubi isha inta aadan xogta la wadaagin',
  // Not a translation of ours: this is the English source the contributor was
  // given, so nothing on this card is a rendering by anyone but the people
  // named on it.
  en: 'Check the source before sharing information.',
  author: 'Cabdikhaaliq',
  sector: 'media',
  dialect: 'Maxaa-tiri',
  written: '27 July 2026',
  validated: 'two contributors, independently',
  verified: 'reviewer sign-off',
  licence: 'CC BY-SA 4.0',
};
const TOTAL = '1,547';

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

// The signature element: the provenance record, set as an accession label.
//
// Left column is the field, right column the value, on a hairline grid. It
// reads as a specimen sheet on purpose — this is the artefact the project
// exists to produce, and a museum label is what you write when the object's
// origin is the reason it is worth keeping.
function field(label, value, accent) {
  return h('div', {
    key: label,
    style: {
      display: 'flex', alignItems: 'baseline',
      borderTop: `1px solid ${RULE}`,
      paddingTop: STORY ? 26 : 21, paddingBottom: STORY ? 26 : 21,
    },
  }, [
    h('div', {
      key: 'l',
      style: {
        display: 'flex', width: STORY ? 250 : 224, flexShrink: 0,
        fontFamily: 'Norwester', fontSize: STORY ? 20 : 18,
        color: DIM, letterSpacing: '0.16em',
      },
    }, label),
    h('div', {
      key: 'v',
      style: {
        display: 'flex', fontSize: STORY ? 25 : 22,
        color: accent ?? INK, lineHeight: 1.25,
      },
    }, value),
  ]);
}

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    padding: PAD, backgroundColor: PAPER, overflow: 'hidden',
    fontFamily: 'Source Serif 4',
  },
}, [
  // ---- masthead
  h('div', {
    key: 'top',
    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  }, [
    h('div', { key: 'b', style: { display: 'flex', alignItems: 'center', gap: 15 } }, [
      mark(32),
      h('div', {
        key: 'wm',
        style: {
          display: 'flex', fontFamily: 'Norwester', fontSize: 21,
          color: DIM, letterSpacing: '0.18em',
        },
      }, 'QOR AF-SOOMAALI'),
    ]),
    h('div', {
      key: 'v',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: 21,
        color: DIM, letterSpacing: '0.14em',
      },
    }, 'V0.1.2'),
  ]),

  // ---- eyebrow: what the reader is looking at
  h('div', {
    key: 'eyebrow',
    style: {
      display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 24 : 21,
      color: TEAL, letterSpacing: '0.24em',
      marginTop: STORY ? 76 : 58, marginBottom: STORY ? 26 : 20,
    },
  }, 'ONE ROW FROM THE CORPUS'),

  // ---- the sentence itself, the largest thing on the page
  h('div', {
    key: 'so',
    lang: 'so',
    style: {
      display: 'flex', flexWrap: 'wrap',
      fontSize: STORY ? 64 : 55, color: INK, lineHeight: 1.22,
      letterSpacing: '-0.01em',
    },
  }, ROW.so),

  h('div', {
    key: 'en',
    style: {
      display: 'flex', fontSize: STORY ? 26 : 23, color: DIM,
      marginTop: STORY ? 22 : 18, lineHeight: 1.4,
    },
  }, ROW.en),

  // ---- the passport
  h('div', {
    key: 'record',
    style: {
      display: 'flex', flexDirection: 'column',
      marginTop: STORY ? 54 : 40,
    },
  }, [
    field('WRITTEN BY', ROW.author, TEAL),
    field('DOMAIN', ROW.sector),
    field('DIALECT', ROW.dialect),
    field('DATE', ROW.written),
    field('VALIDATED', ROW.validated),
    field('VERIFIED', ROW.verified),
    field('LICENCE', ROW.licence),
  ]),

  // ---- the turn: the number arrives as consequence, not headline
  h('div', {
    key: 'turn',
    style: {
      display: 'flex', flexDirection: 'column',
      marginTop: 'auto', borderTop: `2px solid ${INK}`, paddingTop: STORY ? 30 : 24,
    },
  }, [
    h('div', {
      key: 't',
      style: {
        display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
        fontSize: STORY ? 40 : 34, color: INK, lineHeight: 1.3,
      },
    }, [
      h('span', {
        key: 'n',
        style: {
          fontFamily: 'Norwester', fontSize: STORY ? 60 : 50,
          color: SAFFRON, letterSpacing: '-0.01em', marginRight: 14,
        },
      }, TOTAL),
      'sentences. Every one carries this record.',
    ]),
    h('div', {
      key: 'sub',
      style: {
        display: 'flex', fontSize: STORY ? 23 : 20, color: DIM,
        marginTop: STORY ? 14 : 11, lineHeight: 1.45,
      },
    }, 'No scraping. No machine translation. Open under CC BY-SA 4.0.'),
  ]),

  // ---- where to get it
  h('div', {
    key: 'foot',
    style: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginTop: STORY ? 34 : 26,
      fontFamily: 'Norwester', fontSize: STORY ? 24 : 21, letterSpacing: '0.12em',
    },
  }, [
    h('div', { key: 'a', style: { display: 'flex', color: INK } }, 'HUGGINGFACE.CO/UNKADLABS'),
    h('div', { key: 'b', style: { display: 'flex', color: DIM } }, 'UNKAD LABS · MOGADISHU'),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`);
