import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Story-format thank-you: 1080x1920 for Facebook and Instagram stories.
//
// Every contributor is a circle, and the circle's AREA is proportional to what
// they did in the window (submissions + validations). Area, not radius: scaling
// the radius by the count makes a person who did four times the work look
// sixteen times the size, which is a lie told by most bubble charts.
//
// The circles are packed into a single cluster rather than laid out on a grid.
// That is the point of the picture: separate contributions becoming one body.
// The brand mark is seven cells assembling from a single seed and `unug` means
// cell, so this is the same idea drawn with real data.
//
// Consent is inherited from the data file. A contributor with `name: null`
// chose not to be identified; their circle is drawn in the accent colour with
// no text, so they are visibly present and deliberately unnamed.
//
//   cd ../unkad-platform && node scripts/thanks-data.mjs > /tmp/thanks.json
//   node scripts/make-story-thanks.mjs --data /tmp/thanks.json

const dataIdx = process.argv.indexOf('--data');
if (dataIdx === -1) {
  console.error('need --data <file.json> (from unkad-platform/scripts/thanks-data.mjs)');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(process.argv[dataIdx + 1], 'utf8'));
if (!data.people) {
  console.error('data file has no `people` array; re-run thanks-data.mjs to regenerate it');
  process.exit(1);
}

const OUT = path.join(process.cwd(), 'public', 'images', 'qor-thanks-story.png');
const W = 1080;
const H = 1920;

const BG = '#141312';
const TEXT = '#E8E6E1';
const MUTED = '#A5A19A';
const ACCENT = '#4DB6A5';

// The field the cluster is packed into. Leaves room for the title above and the
// footer below.
const FIELD = { x: 0, y: 430, w: W, h: 1290 };
const CX = FIELD.x + FIELD.w / 2;
const CY = FIELD.y + FIELD.h / 2;

const people = data.people
  .map((p) => ({ ...p, weight: (p.subs ?? 0) + (p.vals ?? 0) }))
  .filter((p) => p.weight > 0)
  .sort((a, b) => b.weight - a.weight);

// Radius from area: r = k * sqrt(weight). k is solved so the total circle area
// fills a fixed share of the field, which keeps the picture looking the same
// whether the day had 12 contributors or 60.
// Raised from 0.42: at that density the cluster sat as a small island in the
// middle of a 1920px canvas with dead space above and below it.
const FILL = 0.58;
const sumW = people.reduce((a, p) => a + p.weight, 0);
const k = Math.sqrt((FILL * FIELD.w * FIELD.h) / (Math.PI * sumW));
const R_MIN = 44; // below this a name stops being legible at all
const R_MAX = 205;
for (const p of people) {
  p.r = Math.max(R_MIN, Math.min(R_MAX, k * Math.sqrt(p.weight)));
}

// Greedy pack: place the largest at the centre, then spiral each next circle
// outward to the first spot where it touches nothing. Deterministic, so the
// same data always produces the same picture.
const placed = [];
const GAP = 7;
for (const p of people) {
  if (placed.length === 0) {
    p.x = CX;
    p.y = CY;
    placed.push(p);
    continue;
  }
  let found = false;
  for (let step = 0; step < 20000 && !found; step++) {
    // Phyllotaxis-ish spiral: golden angle keeps successive candidates from
    // lining up into visible spokes.
    const a = step * 2.399963229728653;
    const rad = 6 * Math.sqrt(step);
    const x = CX + rad * Math.cos(a);
    const y = CY + rad * Math.sin(a);
    if (
      x - p.r < FIELD.x || x + p.r > FIELD.x + FIELD.w ||
      y - p.r < FIELD.y || y + p.r > FIELD.y + FIELD.h
    ) continue;
    const clash = placed.some(
      (q) => Math.hypot(q.x - x, q.y - y) < q.r + p.r + GAP
    );
    if (!clash) { p.x = x; p.y = y; placed.push(p); found = true; }
  }
  if (!found) p.dropped = true;
}

const drawn = placed.length;
const dropped = people.length - drawn;
if (dropped > 0) {
  console.error(`WARNING: ${dropped} circle(s) did not fit and are not drawn`);
}

const fonts = ['Regular', 'Bold'].map((w, i) => ({
  name: 'Source Serif 4',
  data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', `SourceSerif4-${w}.otf`)),
  weight: i === 0 ? 400 : 700,
  style: 'normal',
}));

function mark(size) {
  const u = size / 100;
  const sq = (x, y, fill) =>
    h('div', {
      key: `${x}-${y}`,
      style: {
        position: 'absolute', left: x * u, top: y * u,
        width: 24 * u, height: 24 * u, borderRadius: 6 * u, backgroundColor: fill,
      },
    });
  return h('div', { style: { position: 'relative', width: size, height: size, display: 'flex' } }, [
    sq(38, 70, ACCENT), sq(6, 70, TEXT), sq(70, 70, TEXT),
    sq(6, 38, TEXT), sq(70, 38, TEXT), sq(6, 6, TEXT), sq(70, 6, TEXT),
  ]);
}

// A name only goes inside a circle if it actually fits. Otherwise the circle
// stands on its own: a clipped name reads as a bug, an unlabelled cell reads as
// design.
function fitName(name, r) {
  if (!name) return null;
  const first = name.split(/\s+/)[0];
  const budget = r * 1.72;
  for (const size of [30, 26, 23, 20, 18, 16]) {
    if (name.length * size * 0.5 <= budget) return { text: name, size };
    if (first.length * size * 0.5 <= budget) return { text: first, size };
  }
  return null;
}

const circles = placed.map((p, i) => {
  const anon = !p.name;
  const label = anon ? null : fitName(p.name, p.r);
  return h('div', {
    key: `c${i}`,
    style: {
      position: 'absolute',
      left: p.x - p.r,
      top: p.y - p.r,
      width: p.r * 2,
      height: p.r * 2,
      borderRadius: p.r,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 8,
      // Withheld contributors are solid accent and carry no text.
      // Raised from 0.055/0.22: on a phone screen in daylight the circles were
      // barely distinguishable from the background and the cluster read as a
      // smudge rather than as separate people.
      backgroundColor: anon ? 'rgba(77,182,165,0.30)' : 'rgba(232,230,225,0.085)',
      border: anon
        ? '2px solid rgba(77,182,165,0.80)'
        : '1px solid rgba(232,230,225,0.38)',
      color: TEXT,
      fontSize: label ? label.size : 1,
      lineHeight: 1.15,
    },
  }, label ? label.text : '');
});

const story = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    backgroundColor: BG,
    backgroundImage:
      'radial-gradient(900px 900px at 50% 46%, rgba(77,182,165,0.13), rgba(20,19,18,0) 68%)',
    fontFamily: 'Source Serif 4',
    position: 'relative',
  },
}, [
  h('div', {
    key: 'head',
    style: { display: 'flex', flexDirection: 'column', padding: '96px 88px 0' },
  }, [
    h('div', { key: 'brand', style: { display: 'flex', alignItems: 'center', gap: 20 } }, [
      mark(48),
      h('div', { key: 'wm', style: { display: 'flex', fontSize: 32, color: MUTED } }, 'Qor Af-Soomaali'),
    ]),
    h('div', {
      key: 't',
      style: {
        display: 'flex', fontSize: 108, fontWeight: 700, color: ACCENT,
        letterSpacing: '-0.02em', lineHeight: 1, marginTop: 58,
      },
    }, 'Mahadsanidiin'),
    h('div', {
      key: 's',
      style: { display: 'flex', fontSize: 36, color: TEXT, marginTop: 22 },
    }, `${data.active} wax-ku-biiriyayaal`),
  ]),

  // The cluster sits in absolutely positioned space so packing coordinates are
  // page coordinates and nothing reflows underneath it.
  ...circles,

  h('div', {
    key: 'foot',
    style: {
      position: 'absolute', left: 88, right: 88, bottom: 96,
      display: 'flex', flexDirection: 'column',
    },
  }, [
    data.withheld > 0
      ? h('div', {
          key: 'anon',
          style: { display: 'flex', fontSize: 26, color: MUTED, marginBottom: 26 },
        }, `Magac la’aan × ${data.withheld}`)
      : null,
    h('div', {
      key: 'r',
      style: { display: 'flex', height: 3, width: 96, backgroundColor: ACCENT, marginBottom: 24 },
    }),
    h('div', {
      key: 'u',
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 32 },
    }, [
      h('div', { key: 'a', style: { display: 'flex', color: MUTED } }, 'Bilow hadda'),
      h('div', { key: 'b', style: { display: 'flex', color: TEXT } }, 'qor.unkad.com'),
    ]),
  ]),
]);

const res = new ImageResponse(story, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(
  `wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H}) — ` +
  `${drawn} circles, r ${Math.round(Math.min(...placed.map((p) => p.r)))}–${Math.round(Math.max(...placed.map((p) => p.r)))}`
);
