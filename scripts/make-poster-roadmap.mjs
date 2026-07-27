import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The roadmap: what each corpus size actually unlocks, and where the corpus is
// now.
//
// Each rung is anchored to a real comparison rather than an aspiration, because
// this card is meant to be shown to people who will check. 2,000 is the scale
// of a FLORES-style evaluation set. 50,000 is the scale of the instruction sets
// that first showed small models could be usefully tuned. A million is where a
// language stops being an afterthought in a base model's training mix.
//
// Numbers grow down the card so the jump from 2,000 to a million is felt rather
// than read. The rungs are evenly spaced, which is a deliberate distortion: on
// a true scale the first four would collapse into one line at the top and the
// card would say nothing.
//
// Labels are English. The milestone poster this follows is English too, and the
// audience for a roadmap is researchers and funders as much as contributors.
// The Somali on it is brand furniture reused verbatim from the platform.
//
//   node scripts/make-poster-roadmap.mjs                 # 1080x1920 story
//   node scripts/make-poster-roadmap.mjs --now 127       # mark current position
//   node scripts/make-poster-roadmap.mjs --portrait      # 1080x1350

const PORTRAIT = process.argv.includes('--portrait');
const nowIdx = process.argv.indexOf('--now');
const NOW = nowIdx > -1 ? Number(process.argv[nowIdx + 1]) : null;

const OUT = path.join(
  process.cwd(), 'public', 'images',
  PORTRAIT ? 'qor-roadmap-4x5.png' : 'qor-roadmap-story.png'
);
const W = 1080;
const H = PORTRAIT ? 1350 : 1920;

const BG = '#141312';
const TEXT = '#E8E6E1';
const MUTED = '#A5A19A';
const ACCENT = '#4DB6A5';

const MILESTONES = [
  ['2,000', 'Benchmark any model in Somali'],
  ['30,000', 'Train and test a first Somali model'],
  ['50,000', 'Fine-tune a model that speaks Somali'],
  ['100,000', 'An open dataset, free for everyone'],
  ['1,000,000', 'Somali stops being a low-resource language'],
];

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

// Numbers scale up as the milestones do. The smallest rung is still large
// enough to read at a glance in a feed.
// Sized to fill the frame. The first pass ran the rungs out at roughly two
// thirds of a 1920px story and left a third of the card empty below the last
// one, which in a feed reads as an image that failed to finish loading.
const NUM = PORTRAIT ? [50, 58, 68, 80, 94] : [82, 96, 114, 136, 160];
const LABEL = PORTRAIT ? 24 : 32;
const GAP = PORTRAIT ? 16 : 26;

// Each milestone is a cell, in the same rounded-box language as the
// acknowledgements poster. A left rule made the five read as one continuous
// list; boxes make them read as five separate things you arrive at in turn.
const rungs = MILESTONES.map(([n, label], i) =>
  h('div', {
    key: n,
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: PORTRAIT ? '22px 28px 26px' : '30px 38px 34px',
      borderRadius: PORTRAIT ? 16 : 22,
      // The first cell is the one being worked toward now, so it carries the
      // accent. The rest are the horizon and stay quiet.
      border: i === 0
        ? `2px solid rgba(77,182,165,0.75)`
        : `1px solid rgba(232,230,225,0.20)`,
      backgroundColor: i === 0
        ? 'rgba(77,182,165,0.10)'
        : 'rgba(232,230,225,0.035)',
      marginTop: i === 0 ? 0 : GAP,
    },
  }, [
    h('div', {
      key: 'n',
      style: {
        display: 'flex',
        fontSize: NUM[i],
        fontWeight: 700,
        color: i === 0 ? ACCENT : TEXT,
        letterSpacing: '-0.02em',
        lineHeight: 1,
      },
    }, n),
    h('div', {
      key: 'l',
      style: {
        display: 'flex', fontSize: LABEL, color: i === 0 ? TEXT : MUTED,
        marginTop: PORTRAIT ? 10 : 14,
      },
    }, label),
  ])
);

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: PORTRAIT ? '80px 84px' : '96px 88px',
    backgroundColor: BG,
    backgroundImage:
      'radial-gradient(900px 780px at 8% 104%, rgba(77,182,165,0.17), rgba(20,19,18,0) 62%)',
    fontFamily: 'Source Serif 4',
  },
}, [
  h('div', { key: 'top', style: { display: 'flex', flexDirection: 'column' } }, [
    h('div', { key: 'brand', style: { display: 'flex', alignItems: 'center', gap: 20 } }, [
      mark(PORTRAIT ? 44 : 48),
      h('div', {
        key: 'wm',
        style: { display: 'flex', fontSize: PORTRAIT ? 28 : 32, color: MUTED },
      }, 'Qor Af-Soomaali'),
    ]),

    // Where the corpus actually is. Stated in the same unit as the rungs, so
    // the distance to the first one is legible rather than implied.
    NOW != null
      ? h('div', {
          key: 'now',
          style: {
            display: 'flex', alignItems: 'baseline', gap: 14,
            marginTop: PORTRAIT ? 34 : 48,
          },
        }, [
          h('div', {
            key: 'v',
            style: {
              display: 'flex', fontSize: PORTRAIT ? 40 : 48, fontWeight: 700,
              color: TEXT, lineHeight: 1,
            },
          }, NOW.toLocaleString()),
          h('div', {
            key: 't',
            style: { display: 'flex', fontSize: PORTRAIT ? 24 : 28, color: MUTED },
          }, 'validated sentences today'),
        ])
      : null,

    h('div', {
      key: 'rule',
      style: {
        display: 'flex', height: 1, width: '100%',
        backgroundColor: 'rgba(232,230,225,0.14)',
        marginTop: PORTRAIT ? 28 : 40, marginBottom: PORTRAIT ? 34 : 52,
      },
    }),

    h('div', { key: 'rungs', style: { display: 'flex', flexDirection: 'column' } }, rungs),
  ]),

  h('div', { key: 'foot', style: { display: 'flex', flexDirection: 'column' } }, [
    h('div', {
      key: 'r',
      style: {
        display: 'flex', height: 3, width: 96, backgroundColor: ACCENT,
        marginBottom: PORTRAIT ? 20 : 24,
      },
    }),
    h('div', {
      key: 'u',
      style: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: PORTRAIT ? 28 : 32,
      },
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
