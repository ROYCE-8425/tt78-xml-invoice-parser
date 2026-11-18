import { XMLParser } from "fast-xml-parser";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
  parseTagValue: false,
  trimValues: true,
  isArray: (tagName) => tagName === "HHDVu" || tagName === "LTSuat",
});

function toNumber(val) {
  if (val === undefined || val === null || val === "") return 0;
  const num = Number(String(val).replace(/,/g, ""));
  return Number.isFinite(num) ? num : 0;
}

function findHDonRoot(obj) {
  if (!obj || typeof obj !== "object") return null;
  if (obj.HDon) return obj.HDon;
  if (obj.DLHDon) return obj;
  for (const key of Object.keys(obj)) {
    if (key === "Signature") continue;
    const found = findHDonRoot(obj[key]);
    if (found) return found;
  }
  return null;
}

export function parseCircular78Invoice(rawXml, expectedBuyerTaxCode = "") {
  const cleanXml = String(rawXml || "").replace(/^\uFEFF/, "").trim();
  const parsed = xmlParser.parse(cleanXml);
  const hdon = findHDonRoot(parsed);

  const dl = hdon?.DLHDon;
  if (!dl?.TTChung || !dl?.NDHDon) {
    throw new Error("Invalid Circular 78 XML: missing DLHDon/TTChung/NDHDon");
  }

  const tt = dl.TTChung;
  const nban = dl.NDHDon.NBan || {};
  const nmua = dl.NDHDon.NMua || {};
  const ttoan = dl.NDHDon.TToan || {};

  const rawItems = dl.NDHDon?.DSHHDVu?.HHDVu || [];
  const items = rawItems.map((item, idx) => ({
    stt: toNumber(item.STT) || idx + 1,
    tinhChat: toNumber(item.TChat) || 1,
    tenHang: item.THHDVu || "",
    dvt: item.DVTinh || "",
    soLuong: toNumber(item.SLuong),
    donGia: toNumber(item.DGia),
    thanhTien: toNumber(item.ThTien),
    thueSuat: item.TSuat || "KCT",
  }));

  const preTax = toNumber(ttoan.TgTCThue);
  const vatAmount = toNumber(ttoan.TgTThue);
  const grandTotal = toNumber(ttoan.TgTTTBSo);
  const mathDiff = Math.abs(preTax + vatAmount - grandTotal);
  const buyerMstMatch = expectedBuyerTaxCode
    ? String(nmua.MST || "").trim() === expectedBuyerTaxCode.trim()
    : true;

  return {
    uniqueKey: `${nban.MST || "NA"}|${tt.KHMSHDon || ""}|${tt.KHHDon || ""}|${tt.SHDon || ""}`,
    mauSo: tt.KHMSHDon || "",
    kyHieu: tt.KHHDon || "",
    soHoaDon: tt.SHDon || "",
    ngayLap: tt.NLap || "",
    nguoiBan: { mst: nban.MST || "", ten: nban.Ten || "", diaChi: nban.DChi || "" },
    nguoiMua: { mst: nmua.MST || "", ten: nmua.Ten || "", diaChi: nmua.DChi || "" },
    items,
    tongTruocThue: preTax,
    tongTienThue: vatAmount,
    tongThanhToan: grandTotal,
    audit: { passed: mathDiff <= 5 && buyerMstMatch, mathDiff, buyerMstMatch },
  };
}
