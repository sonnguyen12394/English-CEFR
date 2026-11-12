// 📄 Chép PDF từ Google Drive (v159, specs/015-gopy-pdf-drive). JS thuần, `fetch` truyền vào được: máy chủ Deno dùng `fetch` thật, test node dùng `fetch` giả.
// Mã truy cập (tok) của người dùng chỉ dùng cho đúng cuộc gọi này: KHÔNG ghi vào bảng, KHÔNG đưa vào chữ báo lỗi hay nhật ký.
export const MB = 1024 * 1024;
export const FID_RE = /^[A-Za-z0-9_-]{10,120}$/;      // mã tệp Drive
export const TOK_RE = /^[A-Za-z0-9._~+\/=-]{20,2048}$/;  // mã truy cập OAuth (ya29.…)
const API = "https://www.googleapis.com/drive/v3/files/";

export const okIds = (fid, tok) => FID_RE.test(String(fid || "")) && TOK_RE.test(String(tok || ""));

// Lỗi Drive → mã lỗi cho trang. 401: mã hết hạn / sai; 403, 404: không có quyền hoặc không thấy tệp (drive.file chỉ cho tệp người dùng đã chọn).
export const driveErr = (status) => status === 401 ? { error: "tok" } : (status === 403 || status === 404) ? { error: "quyen" } : { error: "drive", st: status };

// Thông tin tệp: tên, cỡ (Drive khai, trang không được khai), loại. Chỉ nhận PDF chưa vào thùng rác.
export async function driveMeta(fid, tok, f = fetch) {
  let r;
  try { r = await f(API + encodeURIComponent(fid) + "?fields=id,name,size,mimeType,trashed&supportsAllDrives=true", { headers: { Authorization: "Bearer " + tok } }); }
  catch (e) { return { error: "net" }; }
  if (!r.ok) return driveErr(r.status);
  const m = await r.json().catch(() => null);
  if (!m || m.trashed) return { error: "quyen" };
  if (m.mimeType !== "application/pdf") return { error: "ngoai", mime: String(m.mimeType || "") };
  const size = Number(m.size);
  if (!(size > 0)) return { error: "ngoai", mime: "" };
  return { name: String(m.name || "tai-lieu.pdf"), size };
}

// Khoảng byte của phần i (mỗi phần CH byte, phần cuối ngắn hơn).
export function partRange(i, size, CH) {
  const a = i * CH, b = Math.min((i + 1) * CH, size) - 1;
  return { a, b, want: b - a + 1 };
}

// Tải phần i bằng Range. Drive trả 206 (đúng khoảng) hoặc 200 (cả tệp, chỉ chấp nhận khi tệp ≤ 1 phần).
export async function driveRange(fid, tok, i, size, CH, f = fetch) {
  const { a, b, want } = partRange(i, size, CH);
  if (!(i >= 0) || a >= size) return { error: "phan" };
  let r;
  try { r = await f(API + encodeURIComponent(fid) + "?alt=media&supportsAllDrives=true", { headers: { Authorization: "Bearer " + tok, Range: `bytes=${a}-${b}` } }); }
  catch (e) { return { error: "net" }; }
  if (r.status === 200 && size > CH) return { error: "drive", st: 200 };   // Drive bỏ qua Range: không được tải cả tệp vào bộ nhớ
  if (!r.ok) return driveErr(r.status);
  const buf = new Uint8Array(await r.arrayBuffer());
  if (buf.length !== want) return { error: "drive", st: 0, got: buf.length, want };
  return { buf };
}
