import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { crc32, dosDateTime, makeZip, zipParts } from "@/lib/zip";

const bytes = (s: string) => new TextEncoder().encode(s);

function sample() {
  const big = new Uint8Array(70000);
  for (let i = 0; i < big.length; i++) big[i] = (i * 31 + 7) & 0xff;
  return [
    { name: "photo.jpg", data: bytes("hello world"), date: new Date(2024, 4, 17, 13, 45, 30) },
    { name: "फोटो (2).png", data: big },
    { name: "empty.txt", data: new Uint8Array(0) },
  ];
}

/** Parses the archive from the end, the way real unzip tools do. */
function parse(zip: Uint8Array) {
  const v = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  const e = zip.length - 22;
  expect(v.getUint32(e, true)).toBe(0x06054b50);
  const count = v.getUint16(e + 10, true);
  const cdSize = v.getUint32(e + 12, true);
  let p = v.getUint32(e + 16, true);
  expect(p + cdSize).toBe(e);
  const out: { name: string; data: Uint8Array; flags: number; crc: number }[] = [];
  for (let i = 0; i < count; i++) {
    expect(v.getUint32(p, true)).toBe(0x02014b50);
    const flags = v.getUint16(p + 8, true);
    const crc = v.getUint32(p + 16, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true);
    const local = v.getUint32(p + 42, true);
    const name = new TextDecoder().decode(zip.subarray(p + 46, p + 46 + nameLen));
    expect(v.getUint32(local, true)).toBe(0x04034b50);
    expect(v.getUint16(local + 8, true)).toBe(0); // STORE
    expect(v.getUint32(local + 14, true)).toBe(crc);
    const lNameLen = v.getUint16(local + 26, true);
    const start = local + 30 + lNameLen + v.getUint16(local + 28, true);
    out.push({ name, data: zip.subarray(start, start + size), flags, crc });
    p += 46 + nameLen;
  }
  return out;
}

describe("crc32", () => {
  it("matches the standard check value", () => {
    expect(crc32(bytes("123456789"))).toBe(0xcbf43926);
    expect(crc32(new Uint8Array(0))).toBe(0);
  });
});

describe("dosDateTime", () => {
  it("packs date and time", () => {
    const { time, date } = dosDateTime(new Date(2024, 4, 17, 13, 45, 30));
    expect(date).toBe(((2024 - 1980) << 9) | (5 << 5) | 17);
    expect(time).toBe((13 << 11) | (45 << 5) | 15);
  });
});

describe("zip writer", () => {
  it("round-trips through our own parser", () => {
    const entries = sample();
    const zip = makeZip(entries);
    const got = parse(zip);
    expect(got.map((g) => g.name)).toEqual(entries.map((e) => e.name));
    got.forEach((g, i) => {
      expect(g.flags & 0x0800).toBe(0x0800);
      expect(g.crc).toBe(crc32(entries[i].data));
      expect([...g.data]).toEqual([...entries[i].data]);
    });
  });

  it("parts concatenate to the same archive", () => {
    const parts = zipParts(sample());
    expect(parts.reduce((s, p) => s + p.length, 0)).toBe(makeZip(sample()).length);
  });

  it("empty archive is just an EOCD", () => {
    const z = makeZip([]);
    expect(z.length).toBe(22);
    expect(parse(z)).toEqual([]);
  });

  it("passes python zipfile and unzip -t", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "zip-test-"));
    try {
      const file = path.join(dir, "out.zip");
      writeFileSync(file, makeZip(sample()));
      const py = execFileSync("python3", [
        "-I",
        "-c",
        "import sys,zipfile,json;z=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None;print(json.dumps([[i.filename,i.file_size,i.date_time[:5]] for i in z.infolist()]))",
        file,
      ], { encoding: "utf8" });
      const info = JSON.parse(py);
      expect(info[0]).toEqual(["photo.jpg", 11, [2024, 5, 17, 13, 45]]);
      expect(info[1][0]).toBe("फोटो (2).png");
      expect(info[1][1]).toBe(70000);
      let unzip = "";
      try { unzip = execFileSync("unzip", ["-t", file], { encoding: "utf8" }); } catch (e) { if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e; }
      if (unzip) expect(unzip).toMatch(/No errors detected/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
