import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Acknowledgements poster: everyone who contributed in the last 24 hours.
//
// Two rules this script enforces rather than leaves to whoever runs it.
//
// Consent. Nobody is named unless they chose to be. `credit_choice` is asked at
// onboarding and is the only thing that decides what appears here: 'handle'
// shows the display name, 'real_name' shows the real name they gave, and both
// 'anonymous' and an unset choice are counted but never named. Publishing a
// contributor who asked to stay unnamed would be a breach of the one promise
// the signup flow makes.
//
// Alphabetical, not ranked. This is a thank-you, not a leaderboard, and the
// platform already has a leaderboard for people who want one. Ordering by
// volume would quietly tell twenty people they came last.
//
// Somali is reused verbatim from the platform's lib/i18n.ts: `Mahadsanid` from
// the submit confirmation, `wax-ku-biiriyayaal` from statContributors, and
// `Magac la'aan` from creditAnonymous. No new Somali is composed here.
//
// The names are read from a JSON file rather than queried here, because this
// repo is a static site whose dependency list is deliberately tiny and a
// database driver does not belong in it. The platform repo owns the query and
// the consent filtering:
//
//   cd ../unkad-platform && node scripts/thanks-data.mjs > /tmp/thanks.json
//   node scripts/make-poster-thanks.mjs --data /tmp/thanks.json
//   node scripts/make-poster-thanks.mjs --data /tmp/thanks.json --square
//
// Expected shape: { hours, active, withheld, named: ["...", ...] }

const SQUARE = process.argv.includes('--square');
const OUT = path.join(
  process.cwd(), 'public', 'images',
  SQUARE ? 'qor-thanks.png' : 'qor-thanks-4x5.png'
);
const W = 1080;
const H = SQUARE ? 1080 : 1350;

const BG = '#141312';
const TEXT = '#E8E6E1';
const MUTED = '#A5A19A';
const ACCENT = '#4DB6A5';

const dataIdx = process.argv.indexOf('--data');
if (dataIdx === -1) {
  console.error('need --data <file.json> (see the header of this file)');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(process.argv[dataIdx + 1], 'utf8'));

const named = [...data.named].sort((a, b) => a.localeCompare(b, 'so'));
const withheld = data.withheld ?? 0;
const activeCount = data.active ?? named.length + withheld;

// A poster that silently names nobody is worse than no poster.
if (named.length === 0) {
  console.error('no one consented to being named in this window; nothing to draw');
  process.exit(1);
}

console.log(`active ${activeCount} · named ${named.length} · withheld ${withheld}`);

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

// One cell per person.
//
// The brand mark is a "U" of seven cells assembling from a single accent seed,
// and `unug` means cell — the whole idea being that a corpus is built one
// person at a time. So the contributors are drawn as cells rather than set as a
// list: each name sits in its own rounded tile, the tiles wrap into a wall, and
// the wall is the point.
//
// Tiles hug their text instead of sitting on a fixed grid. A four-column grid
// would have to size itself for "Zakariye Sheeq Abdirasak Ahmed" and would then
// waste most of its width on "Yusuf".
//
// Names shrink as the count grows, so this survives being run on a day with
// sixty contributors instead of twenty-five. The square crop is 270px shorter
// for the same width, so it starts a step smaller: at the 4:5 sizing the wall
// grew past the footer and the rule was drawn straight through the last line.
const step = named.length > 44 ? 0 : named.length > 32 ? 1 : 2;
const SCALE = SQUARE ? [20, 22, 25] : [22, 25, 28];
const nameSize = SCALE[step];
const padY = Math.round(nameSize * 0.55);
const padX = Math.round(nameSize * 0.82);

const chip = (n) =>
  h('div', {
    key: n,
    style: {
      display: 'flex',
      fontSize: nameSize,
      color: TEXT,
      lineHeight: 1.1,
      padding: `${padY}px ${padX}px`,
      border: `1px solid rgba(232,230,225,0.20)`,
      borderRadius: Math.round(nameSize * 0.42),
      backgroundColor: 'rgba(232,230,225,0.035)',
    },
  }, n);

// The people who chose to stay unnamed are still cells on the wall. Drawn in
// the accent and left empty, they read as present and deliberately blank rather
// than as missing, which is exactly what they asked for.
const anonCell = (i) =>
  h('div', {
    key: `anon-${i}`,
    style: {
      display: 'flex',
      width: nameSize + padY * 2,
      height: nameSize + padY * 2,
      borderRadius: Math.round(nameSize * 0.42),
      backgroundColor: 'rgba(77,182,165,0.22)',
      border: `1px solid rgba(77,182,165,0.55)`,
    },
  });

const wall = h('div', {
  key: 'wall',
  style: {
    display: 'flex', flexWrap: 'wrap', gap: Math.round(nameSize * 0.46),
  },
}, [
  ...named.map(chip),
  ...Array.from({ length: withheld }, (_, i) => anonCell(i)),
]);

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: SQUARE ? 80 : 86,
    backgroundColor: BG,
    backgroundImage:
      'radial-gradient(880px 700px at 12% 108%, rgba(77,182,165,0.16), rgba(20,19,18,0) 62%)',
    fontFamily: 'Source Serif 4',
  },
}, [
  h('div', { key: 'top', style: { display: 'flex', flexDirection: 'column' } }, [
    h('div', { key: 'brand', style: { display: 'flex', alignItems: 'center', gap: 20 } }, [
      mark(46),
      h('div', { key: 'wm', style: { display: 'flex', fontSize: 30, color: MUTED } }, 'Qor Af-Soomaali'),
    ]),

    h('div', {
      key: 'title',
      style: {
        display: 'flex', fontSize: SQUARE ? 88 : 100, fontWeight: 700, color: ACCENT,
        letterSpacing: '-0.02em', lineHeight: 1, marginTop: SQUARE ? 40 : 52,
      },
    }, 'Mahadsanid'),

    h('div', {
      key: 'sub',
      style: { display: 'flex', fontSize: SQUARE ? 30 : 33, color: TEXT, marginTop: 18 },
    }, `${activeCount} wax-ku-biiriyayaal`),

    h('div', {
      key: 'rule',
      style: {
        display: 'flex', height: 1, width: '100%',
        backgroundColor: 'rgba(232,230,225,0.14)',
        marginTop: SQUARE ? 34 : 44, marginBottom: SQUARE ? 32 : 42,
      },
    }),

    wall,

    // The empty accent cells need one line of explanation or they read as a
    // rendering fault rather than as three people's stated preference.
    withheld > 0
      ? h('div', {
          key: 'anonnote',
          style: {
            display: 'flex', fontSize: SQUARE ? 22 : 25, color: MUTED,
            marginTop: 28, marginBottom: 16,
          },
        }, `Magac la’aan × ${withheld}`)
      : null,
  ]),

  h('div', { key: 'foot', style: { display: 'flex', flexDirection: 'column' } }, [
    h('div', {
      key: 'r',
      style: { display: 'flex', height: 3, width: 92, backgroundColor: ACCENT, marginBottom: 22 },
    }),
    h('div', {
      key: 'u',
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 30 },
    }, [
      h('div', { key: 'a', style: { display: 'flex', color: MUTED } }, 'Bilow hadda'),
      h('div', { key: 'b', style: { display: 'flex', color: TEXT } }, 'qor.unkad.com'),
    ]),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`);
