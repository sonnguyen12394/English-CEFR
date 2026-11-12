// v161 Đề riêng có mã (Đề 9 trở đi: tài liệu ETS của người sáng lập, KHÔNG công khai). Bảng de_rieng / de_rieng_ma / de_rieng_thu / de_rieng_key chỉ máy chủ đọc.
// Vào (app, JWT): { act: 'list' } → [{ id, t }] (chỉ tên đề) · { act: 'get', id, ma } → { data } khi sha256(ma) có trong de_rieng_ma.
//   Chặn đoán dò: một IP sai ≥ 5 lần / giờ, hoặc cả app sai ≥ 30 lần / giờ → 429. Mã phải ≥ 8 ký tự.
// Vào (Claude, header x-de-key = khoá tạm 24 giờ trong de_rieng_key): { act: 'nap', id, t, data } ghi / thay đề.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-de-key", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const out = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "content-type": "application/json" } });
const sha = async (s: string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))).map(b => b.toString(16).padStart(2, "0")).join("");
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.json().catch(() => ({})), act = String(body.act || ""), id = String(body.id || "").slice(0, 40);
    if (act === "nap") { const k = req.headers.get("x-de-key") || ""; if (!/^[0-9a-f]{48}$/.test(k)) return out({ error: "Sai khoá." }, 403);
      const { data: kk } = await db.from("de_rieng_key").select("k").eq("k", k).gt("at", new Date(Date.now() - 864e5).toISOString()).maybeSingle(); if (!kk) return out({ error: "Sai khoá." }, 403);
      if (!/^de\d+$/.test(id) || !body.data || typeof body.data !== "object") return out({ error: "Thiếu đề." }, 400);
      const { error } = await db.from("de_rieng").upsert({ id, t: String(body.t || id).slice(0, 80), data: body.data, at: new Date().toISOString() }); return error ? out({ error: error.message }, 500) : out({ ok: true }); }
    const auth = req.headers.get("authorization") || ""; const { data: u } = await db.auth.getUser(auth.replace(/^Bearer\s+/i, "")); if (!u || !u.user) return out({ error: "Cần đăng nhập." }, 401);
    if (act === "list") { const { data } = await db.from("de_rieng").select("id,t").order("id"); return out({ rows: data || [] }); }
    if (act === "get") { const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim().slice(0, 60) || "?", h1 = new Date(Date.now() - 36e5).toISOString();
      const { count: nIp } = await db.from("de_rieng_thu").select("id", { count: "exact", head: true }).eq("ok", false).eq("ip", ip).gt("at", h1);
      const { count: nAll } = await db.from("de_rieng_thu").select("id", { count: "exact", head: true }).eq("ok", false).gt("at", h1);
      if ((nIp || 0) >= 5 || (nAll || 0) >= 30) return out({ error: "Nhập sai nhiều lần. Thử lại sau 1 giờ." }, 429);
      const ma = String(body.ma || "").trim().toUpperCase(); let ok = false;
      if (ma.length >= 8) { const { data: m } = await db.from("de_rieng_ma").select("h").eq("h", await sha(ma)).maybeSingle(); ok = !!m; }
      await db.from("de_rieng_thu").insert({ ip, ok });
      if (!ok) return out({ error: "Sai mã." }, 403);
      const { data: d } = await db.from("de_rieng").select("id,t,data").eq("id", id).maybeSingle(); if (!d) return out({ error: "Không có đề này." }, 404);
      return out({ id: d.id, t: d.t, data: d.data }); }
    return out({ error: "Lệnh lạ." }, 400);
  } catch (e) { return out({ error: "Lỗi máy chủ." }, 500); }
});
