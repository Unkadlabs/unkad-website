import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The poster made out of the corpus rather than about it.
//
// The other direction draws 1,789 cells: the corpus as quantity. This one sets
// the actual Somali people wrote, at reading size, filling the page. A metric
// tells you a language is being written down. A page of the language shows you.
//
// Inverted to warm paper on purpose. Every artefact this project has made is
// dark, so a light one is the one that stops a thumb. It is not the usual
// cream-and-terracotta editorial look either — the accents are the brand's
// teal and a deep indigo, and the display face is a condensed industrial
// grotesque rather than a high-contrast serif.
//
// The lines fade toward the bottom instead of being clipped. A hard cut says
// "ran out of room"; a fade says "continues", which is true — there are
// thousands more, and the fade is the only honest way to end a page of them.
//
// Every line is real, accepted, and never from the account whose provenance is
// unresolved. Nothing here is set for effect: this text ships in the dataset.
//
//   node scripts/make-poster-language.mjs --data /tmp/corpus.json
//   node scripts/make-poster-language.mjs --data /tmp/corpus.json --story

const STORY = process.argv.includes('--story');
const dataIdx = process.argv.indexOf('--data');
if (dataIdx === -1) {
  console.error('need --data <file.json> from unkad-platform/scripts/corpus-data.mjs');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(process.argv[dataIdx + 1], 'utf8'));
if (!data.lines?.length) {
  console.error('data file has no `lines`; re-run corpus-data.mjs');
  process.exit(1);
}

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-language-story.png' : 'qor-language-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 86 : 78;

const PAPER = '#F2EDE3';
const INK = '#0C1026';
const SEED = '#2F8C7E'; // teal darkened to hold its own on paper
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
    sq(38, 70, SEED), sq(6, 70, INK), sq(70, 70, INK),
    sq(6, 38, INK), sq(70, 38, INK), sq(6, 6, INK), sq(70, 6, INK),
  ]);
}

const LINE = STORY ? 27 : 25;
const LEADING = 1.62;
// Enough lines that the text runs all the way down to the footer rule. At 17
// the fade completed a quarter of the page early and the poster read as
// half-finished rather than as a page that continues past the edge.
const COUNT = STORY ? 33 : 21;

// Deterministic pick, so the same corpus always yields the same poster and a
// regenerated image is not a different one.
const lines = data.lines.slice(0, COUNT);

const body = lines.map((text, i) => {
  // Fades to nothing over the last third rather than stopping dead.
  const t = i / Math.max(1, lines.length - 1);
  const alpha = t < 0.55 ? 1 : Math.max(0.04, 1 - (t - 0.55) / 0.45);
  return h('div', {
    key: i,
    lang: 'so',
    style: {
      display: 'flex',
      fontSize: LINE,
      lineHeight: LEADING,
      color: `rgba(12,16,38,${(alpha * 0.86).toFixed(3)})`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  }, text);
});

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    padding: PAD, backgroundColor: PAPER, overflow: 'hidden',
    fontFamily: 'Source Serif 4',
  },
}, [
  h('div', { key: 'brand', style: { display: 'flex', alignItems: 'center', gap: 15 } }, [
    mark(32),
    h('div', {
      key: 'wm',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: 21, color: DIM,
        letterSpacing: '0.18em',
      },
    }, 'QOR AF-SOOMAALI'),
  ]),

  // Count and label share a baseline: the number is the fact, the word is what
  // it counts, and separating them onto two lines made the label look like a
  // caption for something else.
  h('div', {
    key: 'count',
    style: {
      display: 'flex', alignItems: 'baseline', gap: 22,
      marginTop: STORY ? 44 : 32,
    },
  }, [
    h('div', {
      key: 'n',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 172 : 140,
        color: INK, letterSpacing: '-0.035em', lineHeight: 0.8,
      },
    }, data.sentences.toLocaleString()),
    h('div', {
      key: 'l',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 40 : 33,
        color: SEED, letterSpacing: '0.24em',
      },
    }, 'JUMLADO'),
  ]),

  h('div', {
    key: 'rule',
    style: {
      display: 'flex', height: 2, width: 96, backgroundColor: SEED,
      marginTop: STORY ? 40 : 30, marginBottom: STORY ? 40 : 30,
    },
  }),

  // The corpus, in its own words.
  h('div', {
    key: 'body',
    style: { display: 'flex', flexDirection: 'column' },
  }, body),

  h('div', {
    key: 'foot',
    style: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      marginTop: 'auto', borderTop: `1px solid rgba(12,16,38,0.16)`, paddingTop: 20,
    },
  }, [
    h('div', { key: 'a', style: { display: 'flex', flexDirection: 'column' } }, [
      h('div', {
        key: 'p',
        style: {
          display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 34 : 29,
          color: INK, letterSpacing: '0.04em',
        },
      }, `${data.people} WAX-KU-BIIRIYAYAAL`),
      h('div', {
        key: 's',
        style: { display: 'flex', fontSize: STORY ? 21 : 19, color: DIM, marginTop: 7 },
      }, 'Jumlado la hubiyay'),
    ]),
    h('div', {
      key: 'b',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 26 : 23,
        color: INK, letterSpacing: '0.14em',
      },
    }, 'QOR.UNKAD.COM'),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H}) — ${lines.length} real lines`);
