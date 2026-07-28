import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The corpus, drawn at one cell per sentence.
//
// Every other poster here has charted the corpus: a number, a label, an accent
// rule. This one *is* the corpus. 1,789 sentences means 1,789 cells, countable,
// filling a band across the page. `unug` means cell and the brand mark is seven
// of them assembling from a seed, so the unit was always sitting there; it just
// had never been drawn at true scale.
//
// Why the field is not coloured by contributor, which was the obvious move:
// one account holds 69% of the sentences, so contributor-coloured cells would
// render as a monochrome slab with confetti — visually claiming one person
// built this, and publicising an account whose provenance is unresolved. The
// field encodes the corpus. People are counted separately, equally, by name.
//
// Type is a real pairing rather than one family doing both jobs. Norwester is
// condensed, uppercase, industrial — infrastructure. Source Serif is warm and
// literary — people. The poster is about people building infrastructure, so the
// two faces are the argument.
//
//   node scripts/make-poster-corpus.mjs --data /tmp/corpus.json
//   node scripts/make-poster-corpus.mjs --data /tmp/corpus.json --story

const STORY = process.argv.includes('--story');
const dataIdx = process.argv.indexOf('--data');
if (dataIdx === -1) {
  console.error('need --data <file.json> from unkad-platform/scripts/corpus-data.mjs');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(process.argv[dataIdx + 1], 'utf8'));

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-corpus-story.png' : 'qor-corpus-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 88 : 80;

// Indigo rather than near-black: it has a hue, so the saffron in the field has
// something to sit against instead of floating on a void.
const INK = '#0C1026';
const PAPER = '#F4EFE4';
const DIM = '#5A6178';
const SEED = '#4DB6A5';
const WARM = '#E9A13B';

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
const [s1, s2, s3] = hex(SEED);
const [w1, w2, w3] = hex(WARM);

// A positional ramp, teal through to saffron. It carries no data — it is
// texture, so the mass reads as woven cloth rather than as a progress bar. The
// count is the only thing here making a claim.
const rampAt = (t) =>
  `rgb(${lerp(s1, w1, t)},${lerp(s2, w2, t)},${lerp(s3, w3, t)})`;

// One notch smaller than the standalone version: the roll below needs the
// vertical room more than the field needs the extra pixel.
const CELL = STORY ? 9 : 8;
const GAP = 3;
const FIELD_W = W - PAD * 2;
const PER_ROW = Math.floor((FIELD_W + GAP) / (CELL + GAP));
const total = data.sentences;
const rows = Math.ceil(total / PER_ROW);

const field = h(
  'div',
  {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: GAP,
      width: FIELD_W,
    },
  },
  Array.from({ length: total }, (_, i) =>
    h('div', {
      key: i,
      style: {
        width: CELL,
        height: CELL,
        borderRadius: 2,
        backgroundColor: rampAt(i / Math.max(1, total - 1)),
        // The first cell is the seed, as it is in the mark.
        ...(i === 0 ? { backgroundColor: PAPER } : {}),
      },
    })
  )
);

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
    sq(38, 70, SEED), sq(6, 70, PAPER), sq(70, 70, PAPER),
    sq(6, 38, PAPER), sq(70, 38, PAPER), sq(6, 6, PAPER), sq(70, 6, PAPER),
  ]);
}

// The one place boldness is spent: the count, set enormous and tracked tight
// enough to nearly span the page. Everything else stays quiet.
const NUM_SIZE = STORY ? 340 : 262;

// How many names fit, computed rather than guessed. Estimating the run and
// cutting on a whole name is what stops the block ending in a separator with
// nothing after it.
// Three columns. Four fitted the page but clipped the longest names mid-word,
// and a poster whose purpose is to credit people cannot truncate their names to
// make the grid work. Three columns hold every name whole; the vertical room
// comes out of the numeral and the field instead.
const COLS = 3;
// Sized so the longest name on the roll still holds one line in its column.
// Wrapping broke the row rhythm and pushed the final row through the footer
// rule, which read as a layout fault rather than a long name.
const NAME_SIZE = STORY ? 18 : 16;
// Whole rows only. A roll that ends halfway across its last row looks like it
// was cut off rather than finished.
const NAME_ROWS = STORY ? 17 : 12;
const shown = data.named.slice(0, COLS * NAME_ROWS);

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    padding: PAD, backgroundColor: INK, overflow: 'hidden',
    backgroundImage:
      'radial-gradient(1100px 720px at 88% -6%, rgba(233,161,59,0.13), rgba(12,16,38,0) 60%)',
    fontFamily: 'Source Serif 4',
  },
}, [
  h('div', { key: 'top', style: { display: 'flex', flexDirection: 'column' } }, [
    h('div', { key: 'brand', style: { display: 'flex', alignItems: 'center', gap: 16 } }, [
      mark(34),
      h('div', {
        key: 'wm',
        style: {
          display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: DIM,
          letterSpacing: '0.18em',
        },
      }, 'QOR AF-SOOMAALI'),
    ]),

    h('div', {
      key: 'n',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: NUM_SIZE, color: PAPER,
        letterSpacing: '-0.045em', lineHeight: 0.78, marginTop: STORY ? 40 : 28,
        // Deliberately unconstrained: it runs past the right edge and crops.
        whiteSpace: 'nowrap',
      },
    }, total.toLocaleString()),

    h('div', {
      key: 'l',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 40 : 33,
        color: SEED, letterSpacing: '0.3em',
        // Clear of the numeral's comma. lineHeight 0.78 crops the number's box
        // above where the comma actually reaches, so its tail was landing on
        // this word. The gap is measured from the glyph, not the box.
        marginTop: STORY ? 46 : 38,
      },
    }, 'JUMLADO'),
  ]),

  // The corpus itself. One cell per sentence, countable.
  h('div', { key: 'field', style: { display: 'flex', flexDirection: 'column', marginTop: STORY ? 44 : 32 } }, [
    field,
    h('div', {
      key: 'cap',
      style: {
        display: 'flex', fontSize: STORY ? 22 : 20, color: DIM,
        marginTop: 22, fontFamily: 'Source Serif 4',
      },
    }, `${rows} saf · hal unug, hal jumlad`),
  ]),

  h('div', { key: 'people', style: { display: 'flex', flexDirection: 'column', marginTop: STORY ? 44 : 32 } }, [
    h('div', {
      key: 'c',
      lang: 'so',
      style: {
        display: 'flex', flexWrap: 'wrap', fontSize: STORY ? 42 : 35,
        color: PAPER, lineHeight: 1.2,
      },
    }, `${data.people} qofood ayaa ku biiriyay jumlado kala duwan`),

    h('div', {
      key: 'names',
      style: {
        display: 'flex', flexWrap: 'wrap', width: FIELD_W,
        marginTop: STORY ? 30 : 24, columnGap: 0, rowGap: STORY ? 12 : 10,
        marginBottom: STORY ? 30 : 24,
      },
    }, shown.map((n, i) =>
      h('div', {
        key: n,
        style: {
          display: 'flex', alignItems: 'center', gap: 9,
          width: Math.floor(FIELD_W / COLS),
        },
      }, [
        h('div', {
          key: 'dot',
          style: {
            display: 'flex', width: 7, height: 7, borderRadius: 2,
            backgroundColor: rampAt(i / Math.max(1, shown.length - 1)),
          },
        }),
        h('div', {
          key: 't',
          lang: 'so',
          style: {
            display: 'flex', fontFamily: 'Norwester', fontSize: NAME_SIZE,
            color: PAPER, letterSpacing: '0.04em',
            whiteSpace: 'nowrap', overflow: 'hidden',
          },
        }, n.toUpperCase()),
      ])
    )),
  ]),

  h('div', {
    key: 'foot',
    style: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderTop: `1px solid rgba(244,239,228,0.14)`, paddingTop: 22,
      marginTop: 'auto',
      fontFamily: 'Norwester', fontSize: STORY ? 26 : 23, letterSpacing: '0.14em',
    },
  }, [
    h('div', { key: 'a', style: { display: 'flex', color: DIM } }, 'BILOW HADDA'),
    h('div', { key: 'b', style: { display: 'flex', color: PAPER } }, 'QOR.UNKAD.COM'),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(
  `wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H}) — ` +
  `${total} cells, ${PER_ROW}/row, ${rows} rows`
);
