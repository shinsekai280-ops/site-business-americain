import { NextResponse } from "next/server";
import sharp from "sharp";
import opentype from "opentype.js";
import { site } from "@/config/site";
import { INTER_BOLD_BASE64 } from "@/lib/watermark-font";
import { orderRef } from "@/lib/server";
import { loadFileForUser } from "@/lib/access";
import { STORAGE_BUCKET, supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let font: opentype.Font | null = null;
function getFont() {
  if (!font) {
    const buf = Buffer.from(INTER_BOLD_BASE64, "base64");
    font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  }
  return font;
}

/** Text converted to vector shapes: renders the same on every server, no installed font needed. */
function textPath(text: string, size: number) {
  return getFont().getPath(text, 0, 0, size).toPathData(1);
}

/**
 * Watermark: repeated diagonal lines "BRAND · PREVIEW · #ORDER · client email".
 * The order number and email make any screenshot traceable to the client.
 */
function watermarkSvg(w: number, h: number, label: string) {
  const size = Math.max(14, Math.round(Math.min(w, h) / 38));
  const d = textPath(label, size);
  const lineW = getFont().getAdvanceWidth(label, size) + size * 3;
  const stepY = size * 4.2;
  const rows: string[] = [];
  const span = Math.hypot(w, h);
  let i = 0;
  for (let y = -span / 2; y < span; y += stepY, i++) {
    for (let x = -span / 2 + ((i % 2) * lineW) / 2; x < span; x += lineW) {
      rows.push(`<path transform="translate(${x.toFixed(1)},${y.toFixed(1)})" d="${d}"/>`);
    }
  }
  const all = rows.join("");
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <g transform="rotate(-28 ${w / 2} ${h / 2})">
      <g fill="black" opacity="0.22" transform="translate(1.5,1.5)">${all}</g>
      <g fill="white" opacity="0.5">${all}</g>
    </g>
  </svg>`);
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const ctx = await loadFileForUser(params.id);
  if (!ctx) return new NextResponse("Not found", { status: 404 });

  const { data, error } = await supabaseAdmin().storage.from(STORAGE_BUCKET).download(ctx.file.storage_path);
  if (error || !data) return new NextResponse("File unavailable", { status: 404 });

  try {
    const input = Buffer.from(await data.arrayBuffer());
    const base = sharp(input, { density: 150 }).rotate().resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true }).flatten({ background: "#ffffff" });
    const { data: buf, info } = await base.png().toBuffer({ resolveWithObject: true });
    const out = await sharp(buf)
      .composite([{ input: watermarkSvg(info.width, info.height, `${site.brandName.toUpperCase()} · PREVIEW · #${orderRef(ctx.order.id)} · ${ctx.order.email}`), top: 0, left: 0 }])
      .jpeg({ quality: 78 })
      .toBuffer();
    return new NextResponse(out, {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, max-age=600", "Content-Disposition": "inline" },
    });
  } catch {
    // not an image (zip, ai, etc.): show a neutral placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#F1F1EE"/><text x="400" y="300" text-anchor="middle" font-family="Arial" font-size="28" fill="#5F6368">${ctx.file.file_name.replace(/[<&>]/g, "")}</text></svg>`;
    return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "private, max-age=600" } });
  }
}
