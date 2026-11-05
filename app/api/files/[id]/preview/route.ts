import { NextResponse } from "next/server";
import sharp from "sharp";
import { site } from "@/config/site";
import { loadFileForUser } from "@/lib/access";
import { STORAGE_BUCKET, supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Watermark drawn with shapes (works on any server, even without fonts) + the brand name as text. */
function watermarkSvg(w: number, h: number) {
  const tile = 190;
  const marks: string[] = [];
  for (let y = -tile; y < h + tile; y += tile) {
    for (let x = -tile; x < w + tile; x += tile) {
      const ox = x + ((y / tile) % 2 === 0 ? 0 : tile / 2);
      marks.push(`
        <g transform="translate(${ox},${y}) rotate(-30 60 30)">
          <rect x="0" y="0" width="34" height="34" rx="10" fill="none" stroke="white" stroke-width="3"/>
          <path d="M11 8h8a5 5 0 0 1 1 9.8 5.3 5.3 0 0 1-1.4 10.2H11Z" fill="none" stroke="white" stroke-width="3"/>
          <text x="46" y="24" font-family="Arial, Helvetica, DejaVu Sans, sans-serif" font-size="20" font-weight="700" fill="white">${site.brandName.toUpperCase()} · PREVIEW</text>
        </g>`);
    }
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <g opacity="0.5">${marks.join("")}</g>
    <g opacity="0.25">${marks.join("").replaceAll("white", "black")}</g>
  </svg>`);
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const ctx = await loadFileForUser(params.id);
  if (!ctx) return new NextResponse("Not found", { status: 404 });

  const { data, error } = await supabaseAdmin().storage.from(STORAGE_BUCKET).download(ctx.file.storage_path);
  if (error || !data) return new NextResponse("File unavailable", { status: 404 });

  try {
    const input = Buffer.from(await data.arrayBuffer());
    const base = sharp(input, { density: 150 }).rotate().resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true }).flatten({ background: "#ffffff" });
    const { data: buf, info } = await base.png().toBuffer({ resolveWithObject: true });
    const out = await sharp(buf)
      .composite([{ input: watermarkSvg(info.width, info.height), top: 0, left: 0 }])
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
