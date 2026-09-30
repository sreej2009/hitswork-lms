import type { CertificateView } from '../components/dashboard/CertificateArtwork';
import { formatDate } from './format';

/**
 * Builds a one-page A4 landscape PDF of a certificate entirely in the browser:
 * the certificate is drawn on a canvas, encoded as JPEG and embedded in a minimal PDF file.
 */

const WIDTH = 2400;
const HEIGHT = Math.round(WIDTH / 1.414);
const COLORS = {
  paper: '#fdfcff',
  ink: '#0f172a',
  body: '#475569',
  muted: '#64748b',
  frame: '#c7d2fe',
  frameInner: '#e0e7ff',
  brand: '#4f46e5',
  grape: '#7c3aed',
  line: '#d9dcea',
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

/** Shrinks text until it fits `maxWidth`. */
function fitText(ctx: CanvasRenderingContext2D, text: string, font: (size: number) => string, size: number, maxWidth: number) {
  let current = size;
  ctx.font = font(current);
  while (ctx.measureText(text).width > maxWidth && current > 12) {
    current -= 2;
    ctx.font = font(current);
  }
}

async function drawCertificate(certificate: CertificateView): Promise<HTMLCanvasElement> {
  const u = WIDTH / 100; // 1cqw equivalent, matching CertificateArtwork
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  await Promise.all([
    document.fonts.load(`italic 600 ${5.6 * u}px "Playfair Display"`),
    document.fonts.load(`800 ${2.5 * u}px "Plus Jakarta Sans"`),
    document.fonts.load(`700 ${1.6 * u}px "Plus Jakarta Sans"`),
    document.fonts.load(`400 ${1.45 * u}px Inter`),
    document.fonts.load(`600 ${1.3 * u}px Inter`),
  ]).catch(() => undefined);
  const logo = await loadImage(`${import.meta.env.BASE_URL}images/Hitswork.png`).catch(() => null);

  // Paper and soft colour washes
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const wash = (x: number, y: number, r: number, color: string) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  };
  wash(WIDTH * 0.92, 0, 30 * u, 'rgba(224,231,255,0.8)');
  wash(0, HEIGHT, 32 * u, 'rgba(237,233,254,0.9)');

  // Top accent bar
  const bar = ctx.createLinearGradient(0, 0, WIDTH, 0);
  bar.addColorStop(0, COLORS.brand);
  bar.addColorStop(1, COLORS.grape);
  ctx.fillStyle = bar;
  ctx.fillRect(0, 0, WIDTH, u);

  // Frame
  ctx.strokeStyle = COLORS.frame;
  ctx.lineWidth = 0.25 * u;
  ctx.strokeRect(2.2 * u, 2.2 * u, WIDTH - 4.4 * u, HEIGHT - 4.4 * u);
  ctx.strokeStyle = COLORS.frameInner;
  ctx.lineWidth = 0.1 * u;
  ctx.strokeRect(3 * u, 3 * u, WIDTH - 6 * u, HEIGHT - 6 * u);

  const cx = WIDTH / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  let y = 6.5 * u;
  if (logo) {
    const h = 6 * u;
    const w = (logo.naturalWidth / logo.naturalHeight) * h;
    ctx.drawImage(logo, cx - w / 2, y, w, h);
  }
  y += 6 * u + 3.8 * u;

  ctx.fillStyle = COLORS.brand;
  ctx.font = `700 ${1.6 * u}px "Plus Jakarta Sans", sans-serif`;
  ctx.letterSpacing = `${0.42 * 1.6 * u}px`;
  ctx.fillText('CERTIFICATE OF COMPLETION', cx, y);
  ctx.letterSpacing = '0px';

  // Centre the recipient block between the heading and the signature row, as in CertificateArtwork.
  const blockHeight = 21.4 * u;
  const footerTop = HEIGHT - 5.5 * u - 12 * u;
  y += Math.max(3 * u, (footerTop - y - blockHeight) / 2);
  ctx.fillStyle = COLORS.body;
  ctx.font = `400 ${1.45 * u}px Inter, sans-serif`;
  ctx.fillText('This certificate is proudly presented to', cx, y);

  y += 7 * u;
  ctx.fillStyle = COLORS.ink;
  fitText(ctx, certificate.recipientName, (s) => `italic 600 ${s}px "Playfair Display", Georgia, serif`, 5.6 * u, 80 * u);
  ctx.fillText(certificate.recipientName, cx, y);

  y += 2 * u;
  const rule = ctx.createLinearGradient(cx - 17 * u, 0, cx + 17 * u, 0);
  rule.addColorStop(0, 'rgba(165,180,252,0)');
  rule.addColorStop(0.5, 'rgba(165,180,252,1)');
  rule.addColorStop(1, 'rgba(165,180,252,0)');
  ctx.fillStyle = rule;
  ctx.fillRect(cx - 17 * u, y, 34 * u, 0.12 * u);

  y += 3.6 * u;
  ctx.fillStyle = COLORS.body;
  ctx.font = `400 ${1.45 * u}px Inter, sans-serif`;
  ctx.fillText('for successfully completing', cx, y);

  y += 3.6 * u;
  ctx.fillStyle = COLORS.ink;
  fitText(ctx, certificate.courseTitle, (s) => `800 ${s}px "Plus Jakarta Sans", sans-serif`, 2.5 * u, 80 * u);
  ctx.fillText(certificate.courseTitle, cx, y);

  y += 2.6 * u;
  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 ${1.3 * u}px Inter, sans-serif`;
  ctx.fillText(`a ${certificate.hours}-hour online course on Hitswork`, cx, y);

  // Footer: signature (left), seal (centre), date + id (right)
  const bottom = HEIGHT - 5.5 * u;
  const left = 8 * u;
  const right = WIDTH - 8 * u;

  ctx.textAlign = 'left';
  ctx.fillStyle = COLORS.ink;
  ctx.font = `italic 600 ${2.2 * u}px "Playfair Display", Georgia, serif`;
  ctx.fillText(certificate.instructor, left, bottom - 5.2 * u);
  ctx.fillStyle = COLORS.line;
  ctx.fillRect(left, bottom - 4.4 * u, 20 * u, 0.1 * u);
  ctx.fillStyle = COLORS.ink;
  ctx.font = `600 ${1.15 * u}px Inter, sans-serif`;
  ctx.fillText(certificate.instructor, left, bottom - 2.3 * u);
  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 ${1.05 * u}px Inter, sans-serif`;
  ctx.fillText('Instructor', left, bottom - 0.6 * u);

  const sealR = 5 * u;
  const sealY = bottom - sealR;
  const seal = ctx.createLinearGradient(cx - sealR, sealY - sealR, cx + sealR, sealY + sealR);
  seal.addColorStop(0, COLORS.brand);
  seal.addColorStop(1, COLORS.grape);
  ctx.fillStyle = seal;
  ctx.beginPath();
  ctx.arc(cx, sealY, sealR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 0.15 * u;
  ctx.beginPath();
  ctx.arc(cx, sealY, sealR - 0.5 * u, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = `800 ${1.25 * u}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('HITSWORK', cx, sealY - 0.2 * u);
  ctx.font = `600 ${0.9 * u}px Inter, sans-serif`;
  ctx.fillText('VERIFIED', cx, sealY + 1.4 * u);

  ctx.textAlign = 'right';
  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 ${1.05 * u}px Inter, sans-serif`;
  ctx.fillText('Completed on', right, bottom - 6.2 * u);
  ctx.fillStyle = COLORS.ink;
  ctx.font = `600 ${1.3 * u}px Inter, sans-serif`;
  ctx.fillText(formatDate(certificate.issuedAt.slice(0, 10)), right, bottom - 4.4 * u);
  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 ${1.05 * u}px Inter, sans-serif`;
  ctx.fillText('Certificate ID', right, bottom - 2.2 * u);
  ctx.fillStyle = COLORS.ink;
  ctx.font = `600 ${1.15 * u}px ui-monospace, Menlo, Consolas, monospace`;
  ctx.fillText(certificate.id, right, bottom - 0.5 * u);

  return canvas;
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Minimal single-page PDF (A4 landscape) containing one full-page JPEG. */
function buildPdf(jpeg: Uint8Array, width: number, height: number): Blob {
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: string | Uint8Array) => {
    const bytes = typeof chunk === 'string' ? encoder.encode(chunk) : chunk;
    parts.push(bytes);
    length += bytes.length;
  };
  const object = (id: number, ...body: (string | Uint8Array)[]) => {
    offsets[id] = length;
    push(`${id} 0 obj\n`);
    body.forEach(push);
    push('\nendobj\n');
  };

  const pageW = 842;
  const pageH = 595;
  const content = `q ${pageW} 0 0 ${pageH} 0 0 cm /Im0 Do Q`;

  push('%PDF-1.4\n');
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
  );
  object(
    4,
    `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
    jpeg,
    '\nendstream',
  );
  object(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const xref = length;
  push(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts as BlobPart[], { type: 'application/pdf' });
}

export async function downloadCertificatePdf(certificate: CertificateView) {
  const canvas = await drawCertificate(certificate);
  const jpeg = base64ToBytes(canvas.toDataURL('image/jpeg', 0.92).split(',')[1]);
  const blob = buildPdf(jpeg, canvas.width, canvas.height);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Hitswork-Certificate-${certificate.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
