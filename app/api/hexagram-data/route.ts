import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { parse } from "csv-parse/sync";
import path from "path";

// Type definitions
interface HexagramRecord {
  binary: string;
  hex: string;
  hex_font: string;
  english: string;
  pinyin: string;
  trad_chinese: string;
  symbolic: string;
  image: string;
  judgment: string;
  lines: string;
}

export async function POST(req: NextRequest) {
  try {
    const { binary } = await req.json();

    if (!binary || typeof binary !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const reversedBinary = binary.split("").reverse().join("");
    const filePath = path.join(process.cwd(), "public", "yijing_fixed.csv");
    const csvRaw = await readFile(filePath, "utf-8");
    const records: HexagramRecord[] = parse(csvRaw, {
      columns: true,
      skip_empty_lines: true,
    });

    const match = records.find((row) => row.binary === reversedBinary);

    if (!match) {
      return NextResponse.json(
        { error: "Hexagram not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hex: match.hex,
      hexFont: match.hex_font,
      binary: match.binary,
      english: match.english,
      pinyin: match.pinyin,
      tradChinese: match.trad_chinese,
      symbolic: match.symbolic,
      image: match.image,
      judgment: match.judgment,
      lines: match.lines,
    });
  } catch (error) {
    console.error("Hexagram data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
