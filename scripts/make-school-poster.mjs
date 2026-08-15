// A printable poster for one school session.
//
// Each school gets its own QR pointing at visitor mode with a source
// slug, so the session's yield is measurable (scripts/campaign-report.mjs
// in unkad-platform reads it back). Students need no account: they scan,
// consent once, and write.
//
// !! VERIFY SOMALI: the Somali lines are drafts for Khalid's review !!
//
//   node scripts/make-school-poster.mjs imamu-shafici "Imamu Shafici"
//   node scripts/make-school-poster.mjs            # generic version

import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const slug = (process.argv[2] ?? 'guud').replace(/[^a-z0-9-]/gi, '').toLowerCase();
const display = process.argv[3] ?? null;

const SRC = `school-${slug}`;
const URL = `https://qor.unkad.com/visitor?src=${SRC}`;
const OUT = path.join(process.cwd(), 'public', 'images', `school-poster-${slug}.png`);

// A4 portrait at 150 dpi, so it prints cleanly on any office printer.
const W = 1240;
const H = 1754;

const BG = '#141312';
const TEXT = '#E8E6E1';
const MUTED = '#A5A19A';
const ACCENT = '#4DB6A5';

const fonts = ['Regular', 'Bold'].map((w, i) => ({
  name: 'Literata',
  data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', `Literata-${w}.ttf`)),
  weight: i === 0 ? 400 : 700,
  style: 'normal',
}));

// QR on a light plate: scanners want contrast, and a dark-on-dark code
// is a poster nobody can use.
const qrPng = execFileSync('python3', [
  '-c',
  `
import qrcode, sys, base64, io
qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=20, border=2)
qr.add_data(${JSON.stringify(URL)})
qr.make(fit=True)
img = qr.make_image(fill_color="#141312", back_color="#F4F2EB")
buf = io.BytesIO(); img.save(buf, format="PNG")
sys.stdout.write(base64.b64encode(buf.getvalue()).decode())
`,
]).toString();

const qrDataUri = `data:image/png;base64,${qrPng}`;

const img = new ImageResponse(
  h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: BG,
        padding: '90px 80px',
        fontFamily: 'Literata',
        textAlign: 'center',
      },
    },
    [
      h(
        'div',
        { key: 'top', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 } },
        [
          h(
            'div',
            { key: 1, style: { display: 'flex', fontSize: 28, color: MUTED, letterSpacing: 3 } },
            'Qor Af-Soomaali · Unkad Labs'
          ),
          h(
            'div',
            {
              key: 2,
              style: {
                display: 'flex',
                fontSize: 92,
                fontWeight: 700,
                color: TEXT,
                lineHeight: 1.1,
                letterSpacing: -1,
              },
            },
            'Qor af-Soomaaliga'
          ),
          h(
            'div',
            { key: 3, style: { display: 'flex', fontSize: 92, fontWeight: 700, color: ACCENT, lineHeight: 1.1 } },
            'ku dar kaydka'
          ),
          display
            ? h(
                'div',
                { key: 4, style: { display: 'flex', fontSize: 34, color: MUTED, marginTop: 8 } },
                display
              )
            : null,
        ].filter(Boolean)
      ),

      // The QR, big enough to scan from a desk away.
      h(
        'div',
        {
          key: 'qr',
          style: {
            display: 'flex',
            padding: 26,
            backgroundColor: '#F4F2EB',
            borderRadius: 18,
          },
        },
        h('img', { src: qrDataUri, width: 560, height: 560 })
      ),

      h(
        'div',
        { key: 'bot', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 } },
        [
          h(
            'div',
            { key: 1, style: { display: 'flex', fontSize: 46, color: TEXT, lineHeight: 1.35 } },
            'Sawir QR-ka. Diiwaangelin lama rabo.'
          ),
          h(
            'div',
            { key: 2, style: { display: 'flex', fontSize: 34, color: MUTED, lineHeight: 1.4 } },
            'Hal jumlad ayaa ku filan. Waxa aad qorto waa hanti Soomaaliyeed.'
          ),
          h(
            'div',
            { key: 3, style: { display: 'flex', fontSize: 30, color: ACCENT, marginTop: 10 } },
            'qor.unkad.com'
          ),
        ]
      ),
    ]
  ),
  { width: W, height: H, fonts }
);

const buf = Buffer.from(await img.arrayBuffer());
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB)`);
console.log(`  QR target: ${URL}`);
